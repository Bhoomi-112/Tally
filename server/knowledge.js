import { SEED_DATA } from "./census.js";

// ────────────────────────────────────────────────────────────
// knowledge.js — Corpus of census documents that the RAG layer
// retrieves from. Each chunk is a self-contained fact so a
// template-based retriever can match queries without needing a
// vector DB at first. Replace with a vector store as this grows.
// ────────────────────────────────────────────────────────────

function fmt(n) {
  return (n / 1e7).toFixed(2) + " crore";
}

export function buildCorpus() {
  const n = SEED_DATA.national;
  const docs = [];

  docs.push(`India's total population as per Census ${n.censusYear} was ${fmt(n.totalPopulation)} (${n.totalPopulation.toLocaleString("en-IN")} people).`);
  docs.push(`There were ${fmt(n.males)} males and ${fmt(n.females)} females in Census ${n.censusYear}.`);
  docs.push(`The overall sex ratio in India was ${n.sexRatio} females per 1000 males (Census ${n.censusYear}).`);
  docs.push(`The child sex ratio (0-6 years) was ${n.childSexRatio} per 1000 (Census ${n.censusYear}).`);
  docs.push(`India's literacy rate reached ${n.literacyRate}% in Census ${n.censusYear}, with male literacy at ${n.maleLiteracy}% and female literacy at ${n.femaleLiteracy}%.`);
  docs.push(`The rural population was ${fmt(n.ruralPopulation)} and the urban population was ${fmt(n.urbanPopulation)}, making the urban share ${n.urbanShare}% (Census ${n.censusYear}).`);
  docs.push(`Census data published by the Office of the Registrar General & Census Commissioner, Ministry of Home Affairs, Government of India, for the year ${n.censusYear}.`);

  for (const s of SEED_DATA.states) {
    docs.push(`${s.name} had a population of ${fmt(s.population)} (${s.population.toLocaleString("en-IN")}), a sex ratio of ${s.sexRatio}, and a literacy rate of ${s.literacy}% as per Census ${s.censusYear}.`);
  }

  return docs.map((text, i) => ({ id: i, text }));
}

// ────────────────────────────────────────────────────────────
// Simple keyword-overlap retriever (no external deps, offline).
// For the free tier this returns the top-k most relevant chunks.
// ────────────────────────────────────────────────────────────
export function retrieve(query, corpus = buildCorpus(), k = 3) {
  const tokens = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2);
  const scored = corpus.map((doc) => {
    const text = doc.text.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (text.includes(t)) score += 1;
    }
    // boost for direct keyword hits on numeric-ish tokens
    if (query.toLowerCase().includes("sex ratio")) score += 2;
    if (query.toLowerCase().includes("literacy")) score += 2;
    if (query.toLowerCase().includes("population")) score += 1;
    return { doc, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((s) => s.score > 0).slice(0, k);
  return top.length ? top : scored.slice(0, k);
}

export function toContext(chunks) {
  return chunks.map((c) => `- ${c.doc.text}`).join("\n");
}