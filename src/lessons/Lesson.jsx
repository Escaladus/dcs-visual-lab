import { useId, useState } from 'react'
import './lesson.css'

const lessonUi = {
  en: {
    goal: 'Learning goal', practice: 'Try it yourself', choose: 'Choose an answer',
    hint: 'Show hint', check: 'Check answer', correct: 'Correct.', incorrect: 'Try again.',
    source: number => `Course handout · Chapter ${number}`,
  },
  fi: {
    goal: 'Oppimistavoite', practice: 'Kokeile itse', choose: 'Valitse vastaus',
    hint: 'Näytä vihje', check: 'Tarkista vastaus', correct: 'Oikein.', incorrect: 'Kokeile uudelleen.',
    source: number => `Kurssin luentomoniste · Luku ${number}`,
  },
}

function PracticeQuestion({ question, copy }) {
  const id = useId()
  const [choice, setChoice] = useState(null)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const complete = question.parts
    ? question.parts.every(part => answers[part.id] !== undefined)
    : choice !== null
  const correct = question.parts
    ? question.parts.every(part => answers[part.id] === part.correct)
    : choice === question.correct

  return (
    <fieldset className="practice-question">
      <legend>{question.title}</legend>
      <p>{question.prompt}</p>
      {question.code && <pre><code>{question.code}</code></pre>}

      <div className="practice-choices">
        {question.parts ? question.parts.map(part => (
          <label className="lab-select" key={part.id}>
            <span>{part.label}</span>
            <select
              value={answers[part.id] ?? ''}
              onChange={event => {
                const answer = event.target.value
                setAnswers(current => ({ ...current, [part.id]: answer === '' ? undefined : Number(answer) }))
                setChecked(false)
              }}
            >
              <option value="">{copy.choose}</option>
              {part.options.map((option, index) => <option value={index} key={option}>{option}</option>)}
            </select>
          </label>
        )) : question.options.map((option, index) => (
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
        <button className="lab-button lab-primary" type="button" disabled={!complete} onClick={() => setChecked(true)}>
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

export default function Lesson({ language, chapterNumber, copy, children }) {
  const practiceId = useId()
  const ui = lessonUi[language]

  return (
    <>
      <section className="lesson-intro">
        <h2>{ui.goal}</h2>
        <p>{copy.goal}</p>
        <h2>{copy.theoryTitle}</h2>
        {copy.theory.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </section>

      {children}

      <section className="lesson-practice" aria-labelledby={practiceId}>
        <h2 id={practiceId}>{ui.practice}</h2>
        {copy.questions.map(question => (
          <PracticeQuestion key={question.id} question={question} copy={ui} />
        ))}
      </section>
      <p className="lesson-source">{ui.source(chapterNumber)}</p>
    </>
  )
}
