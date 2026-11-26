import { useState } from 'react'
import { Lab, LabRange, LabSelect, StepControls, useTraceSteps } from '../Lab.jsx'
import { ioSceneCopy, sceneCopy, threadSceneCopy } from './executionCopy.js'
import { inputTick, ioTrace, javaThreadTrace } from './executionModels.js'
import { Prediction, SceneNote, Timeline } from './Timeline.jsx'

export function JavaThreadScene({ language }) {
  const copy = threadSceneCopy[language]
  const ui = sceneCopy[language]
  const [scenario, setScenario] = useState('run')
  const { initial, frames } = javaThreadTrace(scenario)
  const navigation = useTraceSteps(frames.length)
  const frame = frames[navigation.step - 1]
  const state = frame?.state ?? initial

  return (
    <Lab title={copy.title} instructions={copy.instructions}>
      <LabSelect label={copy.scenario} options={copy.scenarios} value={scenario} onChange={value => {
        setScenario(value)
        navigation.reset()
      }} />
      <Prediction key={scenario} language={language} question={copy.predict} options={copy.answers}
        answer={scenario === 'run' ? 'main' : 'worker'} revealed={navigation.step === frames.length}
        explanation={copy.outcome[scenario]} />
      <StepControls {...navigation} language={language} />
      <SceneNote tone={state.main === 'waiting' ? 'wait' : undefined}>{copy.notes[frame?.kind ?? 'ready']}</SceneNote>
      <Timeline label={ui.eventOrder} formatPosition={ui.step}
        actors={[
          { id: 'main', label: 'main', state: copy.states[state.main], tone: state.main === 'waiting' ? 'wait' : undefined },
          { id: 'worker', label: copy.actor, state: copy.states[state.worker] },
        ]}
        events={frames.slice(0, navigation.step).map(event => ({
          ...event,
          label: copy.labels[event.kind],
          tone: event.kind === 'join' ? 'wait' : undefined,
        }))} />
    </Lab>
  )
}

export function IoScene({ language }) {
  const copy = ioSceneCopy[language]
  const ui = sceneCopy[language]
  const [delay, setDelay] = useState(4)
  const frames = ioTrace(delay)
  const navigation = useTraceSteps(frames.length)
  const frame = frames[navigation.step - 1]
  const outcome = copy.handled(frames.at(-1).blocking.handledAt)
  const notes = {
    0: copy.networkStates.sent,
    [inputTick]: copy.arrival,
    [delay]: copy.reply,
    [delay + 1]: outcome,
  }

  return (
    <Lab title={copy.title} instructions={copy.instructions}>
      <LabRange label={copy.delay} min={2} max={7} value={delay} format={ui.tick} onChange={value => {
        setDelay(value)
        navigation.reset()
      }} />
      <Prediction key={delay} language={language} question={copy.predict} options={copy.answers} answer="async"
        revealed={navigation.step === frames.length} explanation={outcome} />
      <StepControls {...navigation} language={language} />
      <SceneNote>{frame ? notes[frame.tick] ?? copy.waiting : copy.ready}</SceneNote>
      <figure className="io-diagram">
        <figcaption>{copy.chart}</figcaption>
        <div className="io-tracks" aria-hidden="true" style={{ '--ticks': frames.length }}>
          <span />
          {frames.map(row => <span className="trace-position" key={row.tick}>{ui.tick(row.tick)}</span>)}
          {['blocking', 'async'].map(mode => (
            <div className="io-track" key={mode}>
              <strong>{copy[mode]}</strong>
              {frames.map(row => {
                const reached = row.tick < navigation.step
                const { call, handledAt } = row[mode]
                return (
                  <span className="io-tick-cell" key={row.tick} data-call={reached ? call : undefined} data-current={row === frame}>
                    {reached && (handledAt === row.tick
                      ? <span className="io-input-mark">✓</span>
                      : row.tick === inputTick && mode === 'blocking' ? <span className="io-input-mark is-queued">…</span> : null)}
                  </span>
                )
              })}
            </div>
          ))}
        </div>
        <table className="io-timeline">
          <thead><tr>
            <th scope="col">{copy.tick}</th>
            <th scope="col">{copy.blocking}</th>
            <th scope="col">{copy.async}</th>
            <th scope="col">{copy.network}</th>
          </tr></thead>
          <tbody>
            {frames.slice(0, navigation.step).map(row => (
              <tr key={row.tick} aria-current={row === frame ? 'step' : undefined}>
                <th scope="row" className="trace-position">{row.tick}</th>
                {['blocking', 'async'].map(mode => (
                  <td key={mode} data-tone={row[mode].input === 'queued' ? 'wait' : undefined}>
                    <strong>{copy.callStates[row[mode].call]}</strong>
                    <span>{copy.inputStates[row[mode].input]}</span>
                  </td>
                ))}
                <td>{copy.networkStates[row.network]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    </Lab>
  )
}
