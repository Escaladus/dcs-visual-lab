import { useState } from 'react'
import { Lab, LabMetrics, LabSelect, LabSteps, StepControls, useLabSteps, useTraceSteps } from './Lab.jsx'
import { createQueue, lockTrace, queueCapacity, queueStep } from './courseModels.js'
import { httpRequest, httpResponse, meeting, meetingAccessStatus, meetingHttp, meetingTrace } from './meeting.js'
import { CapacityScene, CommitScene, SortingScene } from './visuals/DistributedScenes.jsx'
import { IoScene } from './visuals/ExecutionScenes.jsx'
import { sceneCopy } from './visuals/executionCopy.js'
import { TcpScene, TimingScene, TlsScene } from './visuals/NetworkScenes.jsx'
import { Prediction, SceneNote, Timeline } from './visuals/Timeline.jsx'

export function QueueLab({ copy }) {
  const [queue, setQueue] = useState(createQueue)

  return (
    <Lab title={copy.title} instructions={copy.instructions}>
      <LabMetrics items={[
        [copy.enqueued, queue.produced],
        [copy.dequeued, queue.consumed],
        [copy.free, queueCapacity - queue.items.length],
      ]} />
      <div className="queue-view">
        <h3>{copy.buffer}</h3>
        {queue.items.length === 0
          ? <p>{copy.empty}</p>
          : <ol className="queue-items">{queue.items.map(item => <li key={item}>{copy.item(item)}</li>)}</ol>}
      </div>
      <div className="lab-action-row">
        <button className="lab-button lab-primary" type="button" onClick={() => setQueue(state => queueStep(state, 'produce'))}>
          {copy.produce}
        </button>
        <button className="lab-button" type="button" onClick={() => setQueue(state => queueStep(state, 'consume'))}>
          {copy.consume}
        </button>
        <button className="lab-button" type="button" onClick={() => setQueue(createQueue())}>{copy.reset}</button>
      </div>
      <p className="lab-note" role="status">
        {queue.event ? copy.events[queue.event.kind](queue.event.item) : copy.initial}
      </p>
    </Lab>
  )
}

function MeetingLab({ language, copy }) {
  const [architecture, setArchitecture] = useState('server')
  const [delivery, setDelivery] = useState('normal')
  const ui = sceneCopy[language]
  const { actors, initial, frames } = meetingTrace(architecture, delivery === 'loss')
  const navigation = useTraceSteps(frames.length)
  const event = frames[navigation.step - 1]
  const clocks = event?.clocks ?? initial
  const previousClocks = frames[navigation.step - 2]?.clocks ?? initial
  const firstInvitation = frames.findIndex(frame => frame.kind === 'receive' && (frame.label === 'invite' || frame.label === 'retry'))
  const invitationClock = frames[firstInvitation].clocks.Leo.lamport
  const name = actor => actor === 'Service' ? copy.service : actor
  const sender = event?.kind === 'receive' ? event.peer : event?.actor
  let description = copy.initial
  if (event?.kind === 'drop') description = copy.dropped
  else if (event?.label === 'availability') description = copy.availability(meeting.availability[sender])
  else if (event) description = copy.labels[event.label]

  return (
    <Lab title={copy.title} instructions={copy.instructions}>
      <div className="lab-settings">
        <LabSelect
          label={copy.architecture}
          value={architecture}
          options={copy.architectures}
          onChange={value => {
            setArchitecture(value)
            navigation.reset()
          }}
        />
        <LabSelect
          label={copy.delivery}
          value={delivery}
          options={copy.deliveries}
          onChange={value => {
            setDelivery(value)
            navigation.reset()
          }}
        />
      </div>
      <Prediction key={`${architecture}-${delivery}`} language={language} question={copy.predict}
        options={{ 3: '3', 5: '5', 7: '7' }} answer={invitationClock} revealed={navigation.step > firstInvitation}
        explanation={copy.predictionResult(invitationClock)} />
      <StepControls {...navigation} language={language} />
      <SceneNote tone={event?.kind === 'drop' ? 'lost' : undefined}>
        {event && <strong>{copy.kinds[event.kind]} · </strong>}{description}
      </SceneNote>
      <table className="clock-table">
        <caption>{copy.vectorOrder}</caption>
        <thead><tr><th scope="col">{copy.process}</th><th scope="col">{copy.lamport}</th><th scope="col">{copy.vector}</th></tr></thead>
        <tbody>
          {actors.map(actor => {
            const active = event?.kind !== 'drop' && event?.actor === actor
            return (
              <tr key={actor} className={active ? 'clock-active' : undefined}>
                <th scope="row">{name(actor)}</th>
                <td>{active && <span className="clock-before">{previousClocks[actor].lamport} → </span>}{clocks[actor].lamport}</td>
                <td><code>{active && <span className="clock-before">[{previousClocks[actor].vector.join(', ')}] → </span>}[{clocks[actor].vector.join(', ')}]</code></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Timeline label={ui.eventOrder} formatPosition={ui.step}
        actors={actors.map(actor => ({ id: actor, label: name(actor) }))}
        events={frames.slice(0, navigation.step).map(({ actor, kind, label, message, peer }) => {
          const route = kind === 'send' || kind === 'drop' ? { from: actor, to: peer } : { actor }
          return {
            ...route,
            tone: kind === 'drop' ? 'lost' : undefined,
            label: message ? `${copy.kinds[kind]} · m${message}` : copy.eventLabels[label],
          }
        })} />
      <a className="lab-link" href="#communication">{copy.link}</a>
    </Lab>
  )
}

const httpSteps = [
  { kind: 'connection', person: meeting.organizer },
  { kind: 'request', person: meeting.organizer, exchange: 'create' },
  { kind: 'response', person: meeting.organizer, exchange: 'create' },
  { kind: 'connection', person: meeting.guest },
  { kind: 'request', person: meeting.guest, exchange: 'availability' },
  { kind: 'response', person: meeting.guest, exchange: 'availability' },
  { kind: 'request', person: meeting.organizer, exchange: 'result' },
  { kind: 'response', person: meeting.organizer, exchange: 'result' },
]

function CommunicationLab({ language, copy }) {
  const navigation = useLabSteps()
  const frame = httpSteps[navigation.step - 1]
  const exchange = meetingHttp[frame?.exchange]

  return (
    <Lab title={copy.title} instructions={copy.instructions}>
      <div className="lab-event" aria-live="polite">
        {frame ? (
          <>
            <strong>{copy[frame.kind](frame.person)}</strong>
            {exchange && (
              <>
                <p>{copy.descriptions[frame.exchange]}</p>
                <pre tabIndex={0}><code>{frame.kind === 'request' ? httpRequest(exchange) : httpResponse(exchange)}</code></pre>
              </>
            )}
          </>
        ) : <p>{copy.initial}</p>}
      </div>
      <LabSteps navigation={navigation} total={httpSteps.length} language={language} />
      <a className="lab-link" href="#logical-clocks">{copy.link}</a>
    </Lab>
  )
}

function SecurityLab({ copy }) {
  const [protocol, setProtocol] = useState('https')
  const [caller, setCaller] = useState('member')
  const permitted = caller === 'member'
  const visibility = protocol === 'https' ? copy.encrypted : permitted ? copy.visibleTime : copy.visibleDenial
  const status = meetingAccessStatus(permitted)

  return (
    <Lab title={copy.title} instructions={copy.instructions}>
      <div className="lab-settings">
        <LabSelect label={copy.protocol} value={protocol} options={copy.protocols} onChange={setProtocol} />
        <LabSelect label={copy.identity} value={caller} options={copy.identities} onChange={setCaller} />
      </div>
      <dl className="visibility-cards" aria-live="polite">
        <div><dt>{copy.browser}</dt><dd>{permitted ? copy.displayTime : copy.displayDenial}</dd></div>
        <div><dt>{copy.observer}</dt><dd>{visibility}</dd></div>
        <div><dt>{copy.service}</dt><dd>{permitted ? copy.allowed : copy.denied}</dd></div>
      </dl>
      <LabMetrics items={[[copy.response, status]]} />
    </Lab>
  )
}

function AlgorithmsLab({ language, copy }) {
  const [delay, setDelay] = useState('delayed')
  const navigation = useLabSteps()
  const frames = lockTrace(delay === 'delayed')
  const frame = frames[navigation.step - 1]

  return (
    <>
      <Lab title={copy.title} instructions={copy.instructions}>
        <LabSelect
          label={copy.delay}
          value={delay}
          options={copy.delays}
          onChange={value => {
            setDelay(value)
            navigation.reset()
          }}
        />
        <div className="lab-event" aria-live="polite">
          <p>{frame ? (frame.kind === 'signal' ? copy.signal : copy[frame.kind](frame.actor)) : copy.initial}</p>
          {frame?.granted && <p>{copy.granted(frame.granted)}</p>}
          {navigation.step === frames.length && <p>{delay === 'delayed' ? copy.differences : copy.same}</p>}
        </div>
        <LabSteps navigation={navigation} total={frames.length} language={language} />
        <LabMetrics items={[
          [copy.causal, 'A → B'],
          [copy.owner, frame?.owner ?? copy.empty],
          [copy.waiting, frame?.waiting.join(', ') || copy.empty],
          [copy.order, frame?.order.join(' → ') || copy.empty],
        ]} />
      </Lab>
      <CommitScene language={language} copy={copy} />
    </>
  )
}

export const courseLabs = {
  introduction: SortingScene,
  'design-principles': CapacityScene,
  'logical-clocks': ({ language, copy }) => (
    <>
      <TimingScene language={language} />
      <MeetingLab language={language} copy={copy} />
    </>
  ),
  communication: ({ language, copy }) => (
    <>
      <IoScene language={language} />
      <TcpScene language={language} />
      <CommunicationLab language={language} copy={copy} />
    </>
  ),
  security: ({ language, copy }) => (
    <>
      <TlsScene language={language} />
      <SecurityLab copy={copy} />
    </>
  ),
  'distributed-algorithms': AlgorithmsLab,
}
