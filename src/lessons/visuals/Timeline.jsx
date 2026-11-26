import { useId, useState } from 'react'
import './visuals.css'

export function Timeline({ label, actors, events, formatPosition }) {
  const positions = Object.fromEntries(actors.map(({ id }, index) => [id, index + 1]))
  const names = Object.fromEntries(actors.map(({ id, label: name }) => [id, name]))
  return (
    <figure className="trace-diagram" style={{ '--lanes': actors.length }}>
      <figcaption>{label}</figcaption>
      <div className="trace-actors">
        {actors.map(({ id, label: name, state, tone }) => (
          <div className="trace-actor" key={id} data-tone={tone}>
            <strong>{name}</strong>
            {state && <span>{state}</span>}
          </div>
        ))}
      </div>
      {events.length > 0 && (
        <ol className="trace-events" role="list">
          {events.map(({ actor, from, to, label: eventLabel, tone, position }, index) => {
            const current = index === events.length - 1
            const origin = positions[from ?? actor]
            const destination = positions[to] ?? origin
            const start = Math.min(origin, destination)
            const length = Math.abs(origin - destination) + 1
            return (
              <li className="trace-event" data-tone={tone} key={index} aria-current={current ? 'step' : undefined}>
                <span className="trace-position">{formatPosition(position ?? index + 1)}</span>
                <div className="trace-lanes">
                  <span className="trace-event-name">{names[from ?? actor]}{to && ` → ${names[to]}`}</span>
                  <span
                    className={length === 1 ? 'trace-node' : 'trace-message'}
                    data-direction={origin < destination ? 'right' : 'left'}
                    style={{ gridColumn: `${start} / span ${length}`, '--inset': `${50 / length}%` }}
                  >
                    <span className="trace-event-label">{eventLabel}</span>
                    {length > 1 && <span className="trace-arrow" aria-hidden="true" />}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </figure>
  )
}

export function SceneNote({ children, tone }) {
  return <p className="scene-note" data-tone={tone} role="status">{children}</p>
}

const predictionCopy = {
  en: { choose: 'Choose a prediction', correct: 'Correct.', incorrect: 'Compare your prediction with the final frame.' },
  fi: { choose: 'Valitse ennuste', correct: 'Oikein.', incorrect: 'Vertaa ennustettasi viimeiseen vaiheeseen.' },
}

export function Prediction({ language, question, options, answer, revealed, explanation }) {
  const id = useId()
  const [choice, setChoice] = useState('')
  const copy = predictionCopy[language]
  return (
    <div className="scene-prediction">
      <label className="lab-select">
        <span id={id}>{question}</span>
        <select aria-labelledby={id} value={choice} onChange={event => setChoice(event.target.value)}>
          <option value="">{copy.choose}</option>
          {Object.entries(options).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
      </label>
      {choice && revealed && (
        <p role="status"><strong>{choice === String(answer) ? copy.correct : copy.incorrect}</strong> {explanation}</p>
      )}
    </div>
  )
}
