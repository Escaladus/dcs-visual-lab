import { useState } from 'react'
import { Lab, LabMetrics, LabRange, LabSelect, LabSteps, useLabSteps } from './Lab.jsx'
import { commitDecision, createQueue, lockTrace, queueCapacity, queueStep, serviceCapacity, sortWorkload } from './courseModels.js'
import { httpRequest, httpResponse, meeting, meetingHttp, meetingTrace } from './meeting.js'

function SortingLab({ copy }) {
  const [sheets, setSheets] = useState(24)
  const [workers, setWorkers] = useState(3)
  const [distribution, setDistribution] = useState('balanced')
  const work = sortWorkload(sheets, workers, distribution)

  return (
    <Lab title={copy.title} instructions={copy.instructions}>
      <div className="lab-settings">
        <LabRange label={copy.sheets} min={12} max={48} value={sheets} onChange={setSheets} />
        <LabRange label={copy.workers} min={1} max={6} value={workers} onChange={setWorkers} />
        <LabSelect label={copy.distribution} value={distribution} options={copy.distributions} onChange={setDistribution} />
      </div>
      <ul className="work-stacks">
        {work.stacks.map((count, index) => (
          <li key={index}>
            <span>{copy.worker(index + 1)}</span>
            <meter min={0} max={sheets} value={count} aria-hidden="true" />
            <strong>{copy.stack(count)}</strong>
          </li>
        ))}
      </ul>
      <LabMetrics live items={[
        [copy.dispatch, `${work.dispatch} s`],
        [copy.sorting, `${work.sorting} s`],
        [copy.merge, `${work.merge} s`],
        [copy.total, `${work.total} s`],
      ]} />
      <p className="lab-note">{copy.phases}</p>
    </Lab>
  )
}

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

function CapacityLab({ copy }) {
  const [load, setLoad] = useState(90)
  const [replicas, setReplicas] = useState(3)
  const [outage, setOutage] = useState('none')
  const capacity = serviceCapacity(load, replicas, outage)

  return (
    <Lab title={copy.title} instructions={copy.instructions}>
      <div className="lab-settings">
        <LabRange label={copy.load} min={0} max={160} step={5} value={load} onChange={setLoad} format={copy.rate} />
        <LabRange label={copy.replicas} min={1} max={5} value={replicas} onChange={setReplicas} />
        <LabSelect label={copy.outage} value={outage} options={copy.outages} onChange={setOutage} />
      </div>
      <meter className="capacity-meter" min={0} max={Math.max(load, 1)} value={capacity.served} aria-hidden="true" />
      <LabMetrics live items={[
        [copy.active, capacity.activeReplicas],
        [copy.served, copy.rate(capacity.served)],
        [copy.waiting, copy.rate(capacity.waiting)],
        [copy.capacity, copy.rate(capacity.capacity)],
        [copy.limit, copy.limits[capacity.limit]],
      ]} />
      <p className="lab-note">{copy.assumptions}</p>
    </Lab>
  )
}

function MeetingLab({ language, copy }) {
  const [architecture, setArchitecture] = useState('server')
  const [delivery, setDelivery] = useState('normal')
  const navigation = useLabSteps()
  const { actors, initial, frames } = meetingTrace(architecture, delivery === 'loss')
  const event = frames[navigation.step - 1]
  const clocks = event?.clocks ?? initial
  const name = actor => actor === 'Service' ? copy.service : actor
  const sender = event?.kind === 'receive' ? event.peer : event?.actor
  const receiver = event?.kind === 'receive' ? event.actor : event?.peer
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
      <div className="lab-event" aria-live="polite">
        {event ? (
          <>
            <strong>{copy.kinds[event.kind]}</strong>
            <dl className="lab-flow">
              {receiver ? (
                <>
                  <div><dt>{copy.from}</dt><dd>{name(sender)}</dd></div>
                  <div><dt>{copy.to}</dt><dd>{name(receiver)}</dd></div>
                </>
              ) : <div><dt>{copy.process}</dt><dd>{name(event.actor)}</dd></div>}
            </dl>
            <p>{description}</p>
          </>
        ) : <p>{description}</p>}
      </div>
      <LabSteps navigation={navigation} total={frames.length} language={language} />
      <table className="clock-table">
        <caption>{copy.vectorOrder}</caption>
        <thead><tr><th scope="col">{copy.process}</th><th scope="col">{copy.lamport}</th><th scope="col">{copy.vector}</th></tr></thead>
        <tbody>
          {actors.map(actor => (
            <tr key={actor} className={event?.kind !== 'drop' && event?.actor === actor ? 'clock-active' : undefined}>
              <th scope="row">{name(actor)}</th>
              <td>{clocks[actor].lamport}</td>
              <td><code>[{clocks[actor].vector.join(', ')}]</code></td>
            </tr>
          ))}
        </tbody>
      </table>
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
  const status = permitted ? meetingHttp.result.status : '403 Forbidden'

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
  const [voteA, setVoteA] = useState('yes')
  const [voteB, setVoteB] = useState('yes')
  const decision = commitDecision([voteA, voteB])

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
      <Lab title={copy.commitTitle} instructions={copy.commitInstructions}>
        <div className="lab-settings">
          <LabSelect label={copy.voter('A')} value={voteA} options={copy.votes} onChange={setVoteA} />
          <LabSelect label={copy.voter('B')} value={voteB} options={copy.votes} onChange={setVoteB} />
        </div>
        <LabMetrics live items={[[copy.decision, copy.decisions[decision]]]} />
      </Lab>
    </>
  )
}

export const courseLabs = {
  introduction: SortingLab,
  'design-principles': CapacityLab,
  'logical-clocks': MeetingLab,
  communication: CommunicationLab,
  security: SecurityLab,
  'distributed-algorithms': AlgorithmsLab,
}
