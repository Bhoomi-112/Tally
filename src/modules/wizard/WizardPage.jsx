import { useState, useCallback } from "react";
import { PHASE_I_QUESTIONS, PHASE_II_QUESTIONS } from "./wizard-questions.js";

// ── Sub-components ────────────────────────────────────────────────

function ProgressBar({ current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="wizard-progress">
      <div className="progress-bar-track" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total} aria-label={`Question ${current} of ${total}`}>
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-text">{current} / {total} questions</div>
    </div>
  );
}

function RadioQuestion({ question, value, onChange }) {
  return (
    <div className="radio-group" role="radiogroup" aria-labelledby={`q-label-${question.id}`}>
      {question.options.map(opt => (
        <label
          key={opt}
          className={`radio-option${value === opt ? " selected" : ""}`}
          htmlFor={`${question.id}-${opt}`}
        >
          <input
            type="radio"
            id={`${question.id}-${opt}`}
            name={question.id}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
          />
          <span className="radio-dot" aria-hidden="true">
            {value === opt && <span className="radio-dot-inner" />}
          </span>
          {opt}
        </label>
      ))}
    </div>
  );
}

function TextQuestion({ question, value, onChange, error }) {
  return (
    <div className="form-input">
      <input
        id={question.id}
        type="text"
        className="input"
        placeholder={question.placeholder || "Type your answer…"}
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${question.id}-error` : undefined}
      />
      {error && (
        <p className="form-error" id={`${question.id}-error`} role="alert">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

function NumberQuestion({ question, value, onChange, error }) {
  return (
    <div className="form-input">
      <input
        id={question.id}
        type="number"
        className="input"
        placeholder={question.placeholder || "Enter a number"}
        value={value || ""}
        min={question.min}
        max={question.max}
        onChange={e => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${question.id}-error` : undefined}
      />
      {question.min !== undefined && question.max !== undefined && (
        <p style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.25rem" }}>
          Range: {question.min} – {question.max}
        </p>
      )}
      {error && (
        <p className="form-error" id={`${question.id}-error`} role="alert">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

function DateQuestion({ question, value, onChange }) {
  return (
    <div className="form-input">
      <input
        id={question.id}
        type="date"
        className="input"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        max={new Date().toISOString().split("T")[0]}
      />
    </div>
  );
}

// ── Validation ────────────────────────────────────────────────────
function validate(question, value) {
  if (question.optional && !value) return null;
  if (!value && value !== 0) return "This question is required.";
  if (question.type === "number") {
    const n = Number(value);
    if (isNaN(n)) return "Please enter a valid number.";
    if (question.min !== undefined && n < question.min) return `Minimum value is ${question.min}.`;
    if (question.max !== undefined && n > question.max) return `Maximum value is ${question.max}.`;
  }
  return null;
}

// ── Summary screen ────────────────────────────────────────────────
function SummaryScreen({ phase, questions, answers, onRestart, onBack }) {
  const filledCount = questions.filter(q => answers[q.id]).length;

  return (
    <div className="summary-card card animate-slide-up">
      <div className="summary-title">✅ Phase {phase === "I" ? "I" : "II"} Walkthrough Complete</div>

      <p style={{ textAlign: "center", color: "#64748b", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
        You answered <strong style={{ color: "white" }}>{filledCount}</strong> of {questions.length} questions.
        Review your answers below — nothing has been saved.
      </p>

      <div className="summary-list" style={{ maxHeight: "18rem", overflowY: "auto" }}>
        {questions.map(q => (
          answers[q.id] ? (
            <div key={q.id} className="summary-row">
              <span className="summary-q">Q{q.number}. {q.text}</span>
              <span className="summary-a">{answers[q.id]}</span>
            </div>
          ) : null
        ))}
      </div>

      {/* ⚠️ PII warning */}
      <div className="disclaimer" style={{ marginBottom: "1.25rem" }}>
        <span aria-hidden="true">🔒</span>
        <span>
          <strong>Your data stays local.</strong> Nothing above has been sent anywhere.
          To officially submit, use the button below to go to the government portal.
        </span>
      </div>

      {/* Handoff CTA */}
      <div className="handoff-box">
        <p style={{ fontWeight: 700, color: "white", marginBottom: "0.5rem", fontSize: "1rem" }}>
          Ready to officially self-enumerate?
        </p>
        <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
          Tally never submits on your behalf. Click below to go to the official portal.
        </p>
        <a
          href="https://censusindia.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
        >
          Go to Official Portal ↗
        </a>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="btn-ghost" style={{ flex: 1 }} onClick={onBack}>← Back</button>
        <button className="btn-ghost" style={{ flex: 1 }} onClick={onRestart}>🔄 Start Over</button>
      </div>
    </div>
  );
}

// ── Main Wizard Component ─────────────────────────────────────────
export default function WizardPage() {
  const [activePhase, setActivePhase] = useState("I");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const questions = activePhase === "I" ? PHASE_I_QUESTIONS : PHASE_II_QUESTIONS;
  const question = questions[currentIndex];
  const currentValue = answers[question?.id] ?? "";

  const handlePhaseSwitch = (phase) => {
    setActivePhase(phase);
    setCurrentIndex(0);
    setAnswers({});
    setErrors({});
    setShowSummary(false);
  };

  const handleAnswer = useCallback((val) => {
    setAnswers(prev => ({ ...prev, [question.id]: val }));
    setErrors(prev => ({ ...prev, [question.id]: null }));
  }, [question]);

  const handleNext = () => {
    const err = validate(question, currentValue);
    if (err) {
      setErrors(prev => ({ ...prev, [question.id]: err }));
      return;
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
    if (showSummary) setShowSummary(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setErrors({});
    setShowSummary(false);
  };

  const handleSkip = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(i => i + 1);
    else setShowSummary(true);
  };

  return (
    <main id="wizard-page" className="page" aria-label="Enumeration Wizard">
      <div className="container">
        <div className="wizard-container">
          {/* Header */}
          <div className="wizard-header animate-slide-up">
            <span style={{ fontSize: "2.5rem" }} aria-hidden="true">🧭</span>
            <h1 className="section-title gradient-text" style={{ marginTop: "0.5rem" }}>
              Enumeration Wizard
            </h1>
            <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.5rem", lineHeight: 1.7 }}>
              Step through the official Census 2027 questions. Answers stay in your browser — nothing is sent anywhere.
            </p>
          </div>

          {/* Phase tabs */}
          <div className="wizard-phase-tabs animate-fade-in delay-100">
            {["I", "II"].map(phase => (
              <button
                key={phase}
                id={`phase-tab-${phase}`}
                className={`wizard-tab${activePhase === phase ? " active" : ""}`}
                onClick={() => handlePhaseSwitch(phase)}
                aria-selected={activePhase === phase}
              >
                Phase {phase}
                <span style={{ display: "block", fontSize: "0.7rem", fontWeight: 400, marginTop: "0.125rem", opacity: 0.8 }}>
                  {phase === "I" ? "Houselisting" : "Population Enumeration"}
                </span>
              </button>
            ))}
          </div>

          {/* Summary screen */}
          {showSummary ? (
            <SummaryScreen
              phase={activePhase}
              questions={questions}
              answers={answers}
              onRestart={handleRestart}
              onBack={() => { setShowSummary(false); setCurrentIndex(questions.length - 1); }}
            />
          ) : (
            <>
              {/* Progress */}
              <ProgressBar current={currentIndex + 1} total={questions.length} />

              {/* Question card */}
              <div className="card question-card animate-slide-right" key={question.id}>
                <div className="question-number" id={`q-label-${question.id}`}>
                  Question {question.number} of {questions.length}
                  {question.optional && (
                    <span style={{ marginLeft: "0.5rem", color: "#475569", textTransform: "none", fontSize: "0.65rem", letterSpacing: 0 }}>
                      (optional)
                    </span>
                  )}
                </div>

                <p className="question-text">{question.text}</p>

                {question.hint && (
                  <div className="question-hint" role="note">
                    💡 {question.hint}
                  </div>
                )}

                {/* Render correct input type */}
                {question.type === "radio" && (
                  <RadioQuestion
                    question={question}
                    value={currentValue}
                    onChange={handleAnswer}
                  />
                )}
                {question.type === "text" && (
                  <TextQuestion
                    question={question}
                    value={currentValue}
                    onChange={handleAnswer}
                    error={errors[question.id]}
                  />
                )}
                {question.type === "number" && (
                  <NumberQuestion
                    question={question}
                    value={currentValue}
                    onChange={handleAnswer}
                    error={errors[question.id]}
                  />
                )}
                {question.type === "date" && (
                  <DateQuestion
                    question={question}
                    value={currentValue}
                    onChange={handleAnswer}
                  />
                )}

                {/* Error display */}
                {errors[question.id] && question.type === "radio" && (
                  <p className="form-error" role="alert">⚠ {errors[question.id]}</p>
                )}
              </div>

              {/* Navigation */}
              <div className="wizard-nav">
                <button
                  className="btn-ghost"
                  onClick={handleBack}
                  disabled={currentIndex === 0}
                  style={{ opacity: currentIndex === 0 ? 0.35 : 1 }}
                  aria-label="Previous question"
                >
                  ← Back
                </button>

                <div className="flex gap-2">
                  {question.optional && (
                    <button className="btn-ghost btn-sm" onClick={handleSkip} aria-label="Skip this question">
                      Skip
                    </button>
                  )}
                  <button
                    className="btn-primary"
                    onClick={handleNext}
                    aria-label={currentIndex === questions.length - 1 ? "Review answers" : "Next question"}
                  >
                    {currentIndex === questions.length - 1 ? "Review →" : "Next →"}
                  </button>
                </div>
              </div>

              {/* Privacy note */}
              <p style={{ textAlign: "center", fontSize: "0.7rem", color: "#334155", marginTop: "1.25rem" }}>
                🔒 Answers are stored only in your browser's memory and cleared when you leave this page.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
