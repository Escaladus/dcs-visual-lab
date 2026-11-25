import { useRef } from 'react'

export function StudyNotes({ id, topics, language, copy }) {
  const list = useRef(null)
  function setExpanded(expanded) {
    for (const topic of list.current.children) topic.open = expanded
  }

  return (
    <section className="study-guide" aria-labelledby={id}>
      <div className="study-header">
        <h2 id={id} tabIndex={-1}>{copy.notes}</h2>
        <div className="study-actions">
          <button type="button" onClick={() => setExpanded(true)}>{copy.expand}</button>
          <button type="button" onClick={() => setExpanded(false)}>{copy.collapse}</button>
        </div>
      </div>
      <div className="study-topics" ref={list}>
        {topics.map(({ section, code, ...translations }, index) => {
          const note = translations[language]
          return (
            <details key={section} open={index === 0}>
              <summary>
                <span>{note.title}</span>
                <small>{copy.handout(section)}</small>
              </summary>
              <div className="study-topic-content">
                {note.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                {code && <pre tabIndex={0}><code>{code}</code></pre>}
                <div className="study-example">
                  <h3>{copy.example}</h3>
                  <p>{note.example}</p>
                </div>
              </div>
            </details>
          )
        })}
      </div>
    </section>
  )
}

export function ExtendedPractice({ id, exercises, language, copy }) {
  return (
    <section className="study-guide" aria-labelledby={id}>
      <h2 id={id} tabIndex={-1}>{copy.extended}</h2>
      <div className="study-exercises">
        {exercises.map(({ reference, ...translations }) => {
          const exercise = translations[language]
          return (
            <article key={reference}>
              <h3>{exercise.title}</h3>
              <p className="lesson-source">{copy.exerciseSource(reference)}</p>
              <p>{exercise.prompt}</p>
              <ol>{exercise.tasks.map(task => <li key={task}>{task}</li>)}</ol>
              <details className="study-solution">
                <summary>{copy.solution}</summary>
                <p>{exercise.solution}</p>
              </details>
            </article>
          )
        })}
      </div>
    </section>
  )
}
