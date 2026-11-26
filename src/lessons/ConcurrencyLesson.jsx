import { useId, useMemo, useState } from 'react'
import Lesson from './Lesson.jsx'
import { Lab, LabMetrics, LabSelect, StepControls, useTraceSteps } from './Lab.jsx'
import { concurrencyCopy } from './concurrencyCopy.js'
import { QueueLab } from './CourseLabs.jsx'
import { JavaThreadScene } from './visuals/ExecutionScenes.jsx'
import { counterSceneCopy, sceneCopy } from './visuals/executionCopy.js'
import { Prediction, SceneNote, Timeline } from './visuals/Timeline.jsx'
import {
  advance,
  counterPreset,
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

function CounterSimulator({ copy, language }) {
  const id = useId()
  const visual = counterSceneCopy[language]
  const ui = sceneCopy[language]
  const [scenario, setScenario] = useState('race')
  const [manualSimulation, setManualSimulation] = useState(createSimulation)
  const manual = scenario === 'manual'
  const preset = useMemo(() => manual ? [] : counterPreset(scenario), [manual, scenario])
  const navigation = useTraceSteps(Math.max(0, preset.length - 1))
  const simulation = manual ? manualSimulation : preset[navigation.step]
  const frame = currentFrame(simulation)
  const threads = threadIds.map(id => ({ id, ...threadStatus(simulation, id) }))
  const step = simulation.history.length - 1
  const total = threads.reduce((sum, thread) => sum + thread.operations.length, 0)
  const finished = simulation.selectedThread === null
  const result = frame.counter === threadIds.length ? copy.bothApplied : copy.lostUpdate
  const description = frame.event ? copy.events[frame.event.operation](frame.event) : visual.ready
  const events = simulation.history.slice(1).map(({ event }) => ({
    actor: event.thread,
    label: copy.operations[event.operation],
  }))

  return (
    <Lab title={copy.title} instructions={visual.instructions}>
      <LabSelect label={visual.scenario} options={visual.scenarios} value={scenario} onChange={value => {
        setScenario(value)
        setManualSimulation(createSimulation())
        navigation.reset()
      }} />
      {manual && (
        <fieldset className="lock-options">
          <legend>{copy.mode}</legend>
          <div className="lock-choices">
            {Object.entries(copy.modes).map(([mode, label]) => (
              <label className="lab-choice" key={mode}>
                <input
                  type="radio"
                  name={`${id}-mode`}
                  checked={simulation.mode === mode}
                  onChange={() => setManualSimulation(createSimulation(mode))}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <Prediction key={`${scenario}-${simulation.mode}`} language={language} question={visual.predict}
        options={{ 0: '0', 1: '1', 2: '2' }} answer={frame.counter} revealed={finished} explanation={result} />
      <LabMetrics items={[
        [copy.counter, frame.counter],
        ...(simulation.mode === 'locked' ? [[copy.lock, frame.lockOwner ? copy.thread(frame.lockOwner) : copy.free]] : []),
      ]} />
      {manual && (
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
                onSelect={threadId => setManualSimulation(state => selectThread(state, threadId))}
              />
            ))}
          </div>
        </fieldset>
      )}
      {manual
        ? <StepControls step={step} total={total} language={language}
            back={() => setManualSimulation(rewind)} next={() => setManualSimulation(advance)}
            reset={() => setManualSimulation(state => createSimulation(state.mode))} />
        : <StepControls {...navigation} language={language} />}
      <SceneNote tone={finished && frame.counter < threadIds.length ? 'lost' : undefined}>
        {description} {finished && result}
      </SceneNote>
      <Timeline label={visual.diagram} formatPosition={ui.step} events={events}
        actors={threads.map(thread => {
          const local = `${copy.local} · ${thread.value ?? copy.noValue}`
          const status = thread.blocked ? copy.blocked(frame.lockOwner) : thread.nextOperation ? '' : copy.finished
          return { id: thread.id, label: copy.thread(thread.id), state: [local, status].filter(Boolean).join(' · '),
            tone: thread.blocked ? 'wait' : undefined }
        })} />
      <details className="event-log">
        <summary>{copy.log}</summary>
        {step === 0 ? <p>{copy.emptyLog}</p> : (
          <ol>
            {simulation.history.slice(1).map(({ event }) => (
              <li key={`${event.thread}-${event.operation}`}>{copy.events[event.operation](event)}</li>
            ))}
          </ol>
        )}
      </details>
    </Lab>
  )
}

export default function ConcurrencyLesson({ language, chapterNumber }) {
  const copy = concurrencyCopy[language]
  return (
    <Lesson copy={copy} language={language} chapterNumber={chapterNumber}>
      <CounterSimulator copy={copy.simulator} language={language} />
      <JavaThreadScene language={language} />
      <QueueLab copy={copy.queue} />
    </Lesson>
  )
}
