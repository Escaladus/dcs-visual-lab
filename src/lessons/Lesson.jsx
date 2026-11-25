import { useId, useState } from 'react'
import './lesson.css'

function PracticeQuestion({ question, copy }) {
  const id = useId()
  const [choice, setChoice] = useState(null)
  const [checked, setChecked] = useState(false)
  const correct = choice === question.correct

  return (
    <fieldset className="practice-question">
      <legend>{question.title}</legend>
      <p>{question.prompt}</p>
      {question.code && <pre><code>{question.code}</code></pre>}

      <div className="practice-choices">
        {question.options.map((option, index) => (
          <label className="lab-choice" key={index}>
            <input
              type="radio"
              name={id}
              checked={choice === index}
              onChange={() => {
                setChoice(index)
                setChecked(false)
              }}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      <div className="practice-actions">
        <button className="lab-button lab-primary" type="button" disabled={choice === null} onClick={() => setChecked(true)}>
          {copy.check}
        </button>
        <details className="practice-hint">
          <summary>{copy.hint}</summary>
          <p>{question.hint}</p>
        </details>
      </div>

      <div aria-live="polite">
        {checked && (
          <p className={correct ? 'practice-feedback is-correct' : 'practice-feedback'}>
            <strong>{correct ? copy.correct : copy.incorrect}</strong> {question.explanation}
          </p>
        )}
      </div>
    </fieldset>
  )
}

export default function Lesson({ copy, children }) {
  const practiceId = useId()

  return (
    <>
      <section className="lesson-intro">
        <h2>{copy.goalTitle}</h2>
        <p>{copy.goal}</p>
        <h2>{copy.theoryTitle}</h2>
        {copy.theory.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </section>

      {children}

      <section className="lesson-practice" aria-labelledby={practiceId}>
        <h2 id={practiceId}>{copy.practiceTitle}</h2>
        {copy.questions.map(question => (
          <PracticeQuestion key={question.id} question={question} copy={copy} />
        ))}
      </section>
    </>
  )
}
