import { useState } from 'react'
import { Lab, LabMetrics, LabSelect, StepControls, useTraceSteps } from '../Lab.jsx'
import { httpRequest, httpResponse, meetingHttp } from '../meeting.js'
import { sceneCopy } from './executionCopy.js'
import { tcpCopy, timingCopy, tlsCopy } from './networkCopy.js'
import { responseDeadline, tcpTrace, timingRequestId, timingTrace, tlsTrace } from './networkModels.js'
import { Prediction, SceneNote, Timeline } from './Timeline.jsx'

const updateChoices = { 0: '0', 1: '1', 2: '2' }

export function TimingScene({ language }) {
  const copy = timingCopy[language]
  const ui = sceneCopy[language]
  const [assumption, setAssumption] = useState('bounded')
  const [delivery, setDelivery] = useState('fast')
  const { initial, frames } = timingTrace(delivery)
  const navigation = useTraceSteps(frames.length)
  const frame = frames[navigation.step - 1]
  const state = frame?.state ?? initial
  const note = frame?.kind === 'timeout' ? assumption : frame?.kind ?? 'ready'
  const waiting = state.client === 'waiting' || state.client === 'timedOut'

  return (
    <Lab title={copy.title} instructions={copy.instructions}>
      <div className="lab-settings">
        <LabSelect label={copy.assumption} options={copy.assumptions} value={assumption} onChange={value => {
          setAssumption(value)
          navigation.reset()
        }} />
        <LabSelect label={copy.delivery} options={copy.deliveries} value={delivery} onChange={value => {
          setDelivery(value)
          navigation.reset()
        }} />
      </div>
      <Prediction key={`${assumption}-${delivery}`} language={language} question={copy.predict} options={updateChoices}
        answer={frames.at(-1).state.applications} revealed={navigation.step === frames.length} explanation={copy.outcome} />
      <StepControls {...navigation} language={language} />
      <SceneNote tone={frame?.tone}>{copy.notes[note]}</SceneNote>
      <LabMetrics items={[[copy.deadline, ui.tick(responseDeadline)], [copy.requestId, timingRequestId], [copy.updates, state.applications]]} />
      <Timeline label={copy.trace} formatPosition={ui.tick}
        actors={[
          { id: 'client', label: ui.client, state: copy.states[state.client], tone: waiting ? 'wait' : undefined },
          { id: 'server', label: ui.server, state: copy.states[state.server] },
        ]}
        events={frames.slice(0, navigation.step).map(event => ({
          ...event,
          position: event.tick,
          label: event.attempt ? `${copy.labels[event.kind]} · #${event.attempt}` : copy.labels[event.kind],
        }))} />
    </Lab>
  )
}

export function TcpScene({ language }) {
  const copy = tcpCopy[language]
  const ui = sceneCopy[language]
  const [scenario, setScenario] = useState('normal')
  const { initial, frames } = tcpTrace(scenario === 'loss')
  const navigation = useTraceSteps(frames.length)
  const frame = frames[navigation.step - 1]
  const state = frame?.state ?? initial

  return (
    <Lab title={copy.title} instructions={copy.instructions}>
      <LabSelect label={copy.scenario} options={copy.scenarios} value={scenario} onChange={value => {
        setScenario(value)
        navigation.reset()
      }} />
      {scenario === 'loss' && (
        <Prediction language={language} question={copy.predict} options={copy.actors} answer="server"
          revealed={navigation.step === frames.length} explanation={copy.outcome} />
      )}
      <StepControls {...navigation} language={language} />
      <SceneNote tone={frame?.tone}>{copy.notes[frame?.kind ?? 'ready']}</SceneNote>
      <Timeline label={copy.trace} formatPosition={ui.step}
        actors={[
          { id: 'client', label: ui.client, state: state.client, tone: state.client === 'SYN-SENT' ? 'wait' : undefined },
          { id: 'server', label: ui.server, state: state.server, tone: state.server === 'SYN-RECEIVED' ? 'wait' : undefined },
        ]}
        events={frames.slice(0, navigation.step).map(event => {
          const label = copy.labels[event.kind] ?? event.packet
          const numbers = [event.seq !== undefined && `SEQ=${event.seq}`, event.ack !== undefined && `ACK=${event.ack}`]
          return { ...event, label: [label, ...numbers, event.status].filter(Boolean).join(' · ') }
        })} />
      {frame?.kind === 'httpRequest' && <HttpMessage message={httpRequest(meetingHttp.result)} />}
      {frame?.kind === 'httpResponse' && <HttpMessage message={httpResponse(meetingHttp.result)} />}
      <a className="lab-link" href="#security">{copy.link}</a>
    </Lab>
  )
}

export function TlsScene({ language }) {
  const copy = tlsCopy[language]
  const ui = sceneCopy[language]
  const [certificate, setCertificate] = useState('valid')
  const [caller, setCaller] = useState('member')
  const { initial, frames } = tlsTrace(certificate === 'valid', caller === 'member')
  const navigation = useTraceSteps(frames.length)
  const frame = frames[navigation.step - 1]
  const state = frame?.state ?? initial
  const outcome = !frames.at(-1).state.requestSent ? 'stopped' : frames.at(-1).status === meetingHttp.result.status ? 'ok' : 'forbidden'
  const summary = outcome === 'stopped' ? copy.notes.badHostname : copy.notes[outcome]
  const note = frame?.kind === 'httpsResponse' ? summary : copy.notes[frame?.kind ?? 'ready']

  return (
    <Lab title={copy.title} instructions={copy.instructions}>
      <div className="lab-settings">
        <LabSelect label={copy.certificate} options={copy.certificates} value={certificate} onChange={value => {
          setCertificate(value)
          navigation.reset()
        }} />
        <LabSelect label={copy.caller} options={copy.callers} value={caller} onChange={value => {
          setCaller(value)
          navigation.reset()
        }} />
      </div>
      <Prediction key={`${certificate}-${caller}`} language={language} question={copy.predict} options={copy.answers}
        answer={outcome} revealed={navigation.step === frames.length} explanation={summary} />
      <StepControls {...navigation} language={language} />
      <SceneNote tone={frame?.tone}>{note}</SceneNote>
      <LabMetrics items={[[copy.requestSent, state.requestSent ? copy.yes : copy.no]]} />
      <Timeline label={copy.trace} formatPosition={ui.step}
        actors={[
          { id: 'client', label: ui.client, state: copy.states[state.client], tone: state.client === 'rejected' ? 'lost' : undefined },
          { id: 'server', label: ui.server, state: copy.states[state.server] },
        ]}
        events={frames.slice(0, navigation.step).map(event => ({
          ...event,
          label: [copy.labels[event.kind], event.encrypted && copy.encrypted, event.status].filter(Boolean).join(' · '),
        }))} />
      {frame?.kind === 'httpsRequest' && <HttpMessage message={httpRequest(meetingHttp.result)} />}
      {frame?.kind === 'httpsResponse' && (
        <HttpMessage message={httpResponse(outcome === 'ok' ? meetingHttp.result : { status: frame.status })} />
      )}
      <a className="lab-link" href="#communication">{copy.link}</a>
    </Lab>
  )
}

function HttpMessage({ message }) {
  return <div className="lab-event"><pre tabIndex={0}><code>{message}</code></pre></div>
}
