import { useId, useState } from 'react'
import Lesson from './Lesson.jsx'
import { concurrencyCopy } from './concurrencyCopy.js'
import {
  advance,
  createSimulation,
  currentFrame,
  rewind,
  selectThread,
  threadIds,
  threadStatus,
} from './counterSimulation.js'

function ThreadCard({ thread, selected, lockOwner, group, copy, onSelect }) {
  const id = useId()
  const { nextOperation, blocked } = thread
  const status = blocked
    ? copy.blocked(lockOwner)
    : nextOperation ? copy.nextOperation(copy.operations[nextOperation]) : copy.finished

  return (
    <div className={selected ? 'thread-card is-selected' : 'thread-card'}>
      <label className="lab-choice">
        <input
          type="radio"
          name={group}
          checked={selected}
          disabled={blocked || !nextOperation}
          aria-describedby={id}
          onChange={() => onSelect(thread.id)}
        />
        <strong>{copy.thread(thread.id)}</strong>
      </label>
      <dl className="local-value">
        <dt>{copy.local}</dt>
        <dd>{thread.value ?? copy.noValue}</dd>
      </dl>
      <ol className="thread-operations">
        {thread.operations.map((operation, index) => (
          <li
            key={operation}
            className={index < thread.completed ? 'is-complete' : undefined}
            aria-current={operation === nextOperation ? 'step' : undefined}
          >
            {copy.operations[operation]}
          </li>
        ))}
      </ol>
      <p id={id} className="thread-status">{status}</p>
    </div>
  )
}

function CounterSimulator({ copy }) {
  const id = useId()
  const [simulation, setSimulation] = useState(createSimulation)
  const frame = currentFrame(simulation)
  const threads = threadIds.map(id => ({ id, ...threadStatus(simulation, id) }))
  const step = simulation.history.length - 1
  const total = threads.reduce((sum, thread) => sum + thread.operations.length, 0)
  const finished = simulation.selectedThread === null
  const result = frame.counter === threadIds.length ? copy.bothApplied : copy.lostUpdate

  return (
    <section className="counter-lab" aria-labelledby={`${id}-title`}>
      <header className="counter-lab-header">
        <h2 id={`${id}-title`}>{copy.title}</h2>
        <p>{copy.instructions}</p>
      </header>

      <div className="counter-lab-body">
        <fieldset className="lock-options">
          <legend>{copy.mode}</legend>
          <div className="lock-choices">
            {Object.entries(copy.modes).map(([mode, label]) => (
              <label className="lab-choice" key={mode}>
                <input
                  type="radio"
                  name={`${id}-mode`}
                  checked={simulation.mode === mode}
                  onChange={() => setSimulation(createSimulation(mode))}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <dl className="counter-metrics">
          <div>
            <dt>{copy.counter}</dt>
            <dd>{frame.counter}</dd>
          </div>
          {simulation.mode === 'locked' && (
            <div>
              <dt>{copy.lock}</dt>
              <dd>{frame.lockOwner ? copy.thread(frame.lockOwner) : copy.free}</dd>
            </div>
          )}
        </dl>

        <fieldset className="thread-schedule">
          <legend>{copy.schedule}</legend>
          <div className="thread-cards">
            {threads.map(thread => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                selected={simulation.selectedThread === thread.id}
                lockOwner={frame.lockOwner}
                group={`${id}-thread`}
                copy={copy}
                onSelect={threadId => setSimulation(state => selectThread(state, threadId))}
              />
            ))}
          </div>
        </fieldset>

        <div className="lab-controls">
          <button className="lab-button" type="button" disabled={step === 0} onClick={() => setSimulation(rewind)}>
            {copy.previous}
          </button>
          <button className="lab-button lab-primary" type="button" disabled={finished} onClick={() => setSimulation(advance)}>
            {copy.next}
          </button>
          <button className="lab-button" type="button" onClick={() => setSimulation(state => createSimulation(state.mode))}>
            {copy.reset}
          </button>
          <span className="lab-progress">{copy.progress(step, total)}</span>
        </div>

        <div role="status" className={finished ? undefined : 'lab-visually-hidden'}>
          <span className="lab-visually-hidden">
            {copy.progress(step, total)}. {frame.event ? copy.events[frame.event.operation](frame.event) : ''}
          </span>
          {finished && <p className="counter-result" data-lost={frame.counter < threadIds.length}>{result}</p>}
        </div>

        <section className="event-log" aria-labelledby={`${id}-log`}>
          <h3 id={`${id}-log`}>{copy.log}</h3>
          {step === 0
            ? <p>{copy.emptyLog}</p>
            : (
              <ol>
                {simulation.history.slice(1).map(({ event }) => (
                  <li key={`${event.thread}-${event.operation}`}>{copy.events[event.operation](event)}</li>
                ))}
              </ol>
            )}
        </section>
      </div>
    </section>
  )
}

export default function ConcurrencyLesson({ language }) {
  const copy = concurrencyCopy[language]
  return (
    <Lesson copy={copy}>
      <CounterSimulator copy={copy.simulator} />
    </Lesson>
  )
}
