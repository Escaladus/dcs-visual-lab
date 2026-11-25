import { useId, useState } from 'react'
import { ExtendedPractice, StudyNotes } from './StudyGuide.jsx'
import { studyGuides } from './study/index.js'
import './lesson.css'

const lessonUi = {
  en: {
    goal: 'Learning goal', practice: 'Try it yourself', choose: 'Choose an answer',
    hint: 'Show hint', check: 'Check answer', correct: 'Correct.', incorrect: 'Try again.',
    source: number => `Course handout · Chapter ${number}`,
    contents: 'In this chapter', notes: 'Study notes', labs: 'Simulators',
    extended: 'Extended practice', example: 'Worked example', solution: 'Show a worked solution',
    expand: 'Expand all', collapse: 'Collapse all',
    handout: section => `Handout § ${section}`,
    exerciseSource: reference => `Source · ${reference}`,
  },
  fi: {
    goal: 'Oppimistavoite', practice: 'Kokeile itse', choose: 'Valitse vastaus',
    hint: 'Näytä vihje', check: 'Tarkista vastaus', correct: 'Oikein.', incorrect: 'Kokeile uudelleen.',
    source: number => `Kurssin luentomoniste · Luku ${number}`,
    contents: 'Tässä luvussa', notes: 'Opiskelumuistiinpanot', labs: 'Simulaattorit',
    extended: 'Syventävät tehtävät', example: 'Ratkaistu esimerkki', solution: 'Näytä esimerkkiratkaisu',
    expand: 'Avaa kaikki', collapse: 'Sulje kaikki',
    handout: section => `Luentomoniste § ${section}`,
    exerciseSource: reference => `Lähde · ${reference}`,
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
  const id = useId()
  const ui = lessonUi[language]
  const guide = studyGuides[chapterNumber - 1]
  const sections = {
    notes: `${id}-notes`,
    labs: `${id}-labs`,
    practice: `${id}-practice`,
    extended: `${id}-extended`,
  }

  return (
    <>
      <nav className="lesson-jumps" aria-label={ui.contents}>
        {Object.entries(sections).map(([section, target]) => (
          <button
            type="button"
            key={section}
            aria-controls={target}
            onClick={() => {
              const section = document.getElementById(target)
              section?.focus({ preventScroll: true })
              section?.scrollIntoView({ block: 'start' })
            }}
          >
            {ui[section]}
          </button>
        ))}
      </nav>
      <section className="lesson-intro">
        <h2>{ui.goal}</h2>
        <p>{copy.goal}</p>
        <h2>{copy.theoryTitle}</h2>
        {copy.theory.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </section>

      <StudyNotes id={sections.notes} topics={guide.topics} language={language} copy={ui} />

      <div id={sections.labs} tabIndex={-1} className="lesson-labs">{children}</div>

      <section className="lesson-practice" aria-labelledby={sections.practice}>
        <h2 id={sections.practice} tabIndex={-1}>{ui.practice}</h2>
        {copy.questions.map(question => (
          <PracticeQuestion key={question.id} question={question} copy={ui} />
        ))}
      </section>
      <ExtendedPractice id={sections.extended} exercises={guide.exercises} language={language} copy={ui} />
      <p className="lesson-source">{ui.source(chapterNumber)}</p>
    </>
  )
}
