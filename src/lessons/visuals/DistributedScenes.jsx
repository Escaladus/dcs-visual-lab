import { useState } from 'react'
import { Lab, LabMetrics, LabRange, LabSelect, StepControls, useTraceSteps } from '../Lab.jsx'
import { databaseRate, replicaRate } from '../courseModels.js'
import { commitVisualCopy, serviceVisualCopy, sortingVisualCopy } from './distributedCopy.js'
import { commitTrace, serviceFlow, sortingTimeline } from './distributedModels.js'
import { sceneCopy } from './executionCopy.js'
import { Prediction, SceneNote, Timeline } from './Timeline.jsx'

export function SortingScene({ language, copy }) {
  const visual = sortingVisualCopy[language]
  const [sheets, setSheets] = useState(24)
  const [workers, setWorkers] = useState(3)
  const [distribution, setDistribution] = useState('balanced')
  const work = sortingTimeline(sheets, workers, distribution)
  const navigation = useTraceSteps(work.milestones.length - 1)
  const time = work.milestones[navigation.step]
  const together = work.sorters.every(sorter => sorter.end === work.combineAt)
  const answer = together ? 'yes' : 'no'

  let note
  if (time === work.total) note = visual.completed(time)
  else if (time === 0) note = workers === 1 ? visual.starting : visual.begin
  else if (time === work.dispatch) note = visual.handedOut
  else if (time === work.combineAt) note = visual.combining
  else {
    const finished = work.sorters.filter(sorter => sorter.end === time).map(sorter => copy.worker(sorter.number))
    note = visual.sorting(new Intl.ListFormat(language).format(finished))
  }

  return (
    <Lab title={copy.title} instructions={copy.instructions}>
      <div className="lab-settings">
        <LabRange label={copy.sheets} min={12} max={48} value={sheets} onChange={value => {
          setSheets(value)
          navigation.reset()
        }} />
        <LabRange label={copy.workers} min={1} max={6} value={workers} onChange={value => {
          setWorkers(value)
          navigation.reset()
        }} />
        <LabSelect label={copy.distribution} value={distribution} options={copy.distributions} onChange={value => {
          setDistribution(value)
          navigation.reset()
        }} />
      </div>
      {workers > 1 && (
        <Prediction key={`${sheets}-${workers}-${distribution}`} language={language} question={visual.predict} options={visual.answers}
          answer={answer} revealed={time >= work.combineAt} explanation={visual.outcome[answer]} />
      )}
      <StepControls {...navigation} language={language} />
      <SceneNote>{visual.at(time)}. {note}</SceneNote>
      <figure className="work-diagram" style={{ '--elapsed': `${time / work.total * 100}%` }}>
        <figcaption>{visual.timeline}</figcaption>
        <div className="work-axis" aria-hidden="true"><span>0 s</span><span>{work.total} s</span></div>
        {workers > 1 && (
          <WorkLane name={visual.coordinator} detail={`${copy.dispatch} ${visual.span(0, work.dispatch)} · ${copy.merge} ${visual.span(work.combineAt, work.total)}`}
            time={time} total={work.total} intervals={[
              { kind: 'dispatch', start: 0, end: work.dispatch },
              { kind: 'merge', start: work.combineAt, end: work.total },
            ]} />
        )}
        {work.sorters.map(sorter => (
          <WorkLane key={sorter.number} name={copy.worker(sorter.number)}
            detail={`${copy.stack(sorter.count)} · ${visual.span(sorter.start, sorter.end)}`}
            time={time} total={work.total} intervals={[{ ...sorter, kind: 'sorting' }]} />
        ))}
      </figure>
      <LabMetrics items={[
        [copy.dispatch, `${work.dispatch} s`], [copy.sorting, `${work.sorting} s`],
        [copy.merge, `${work.merge} s`], [copy.total, `${work.total} s`],
      ]} />
      <p className="lab-note">{copy.phases}</p>
    </Lab>
  )
}

function WorkLane({ name, detail, time, total, intervals }) {
  return (
    <div className="work-lane">
      <div className="work-lane-label"><strong>{name}</strong><span>{detail}</span></div>
      <div className="work-track" aria-hidden="true">
        {intervals.map(({ start, end, kind }) => (
          <span className="work-interval" key={kind} data-kind={kind}
            style={{ left: `${start / total * 100}%`, width: `${(end - start) / total * 100}%` }}>
            <span style={{ width: `${Math.max(0, Math.min(time - start, end - start)) / (end - start) * 100}%` }} />
          </span>
        ))}
      </div>
    </div>
  )
}

export function CapacityScene({ language, copy }) {
  const visual = serviceVisualCopy[language]
  const [load, setLoad] = useState(90)
  const [replicas, setReplicas] = useState(3)
  const [outage, setOutage] = useState('none')
  const flow = serviceFlow(load, replicas, outage)
  const databaseDown = outage === 'database'
  const note = databaseDown ? visual.databaseDown
    : flow.activeReplicas === 0 ? visual.noReplica
      : outage === 'replica' ? visual.replicaDown
        : flow.waiting > 0 ? visual.limited : visual.allServed

  return (
    <Lab title={copy.title} instructions={copy.instructions}>
      <div className="lab-settings">
        <LabRange label={copy.load} min={0} max={160} step={5} value={load} onChange={setLoad} format={copy.rate} />
        <LabRange label={copy.replicas} min={1} max={5} value={replicas} onChange={setReplicas} />
        <LabSelect label={copy.outage} value={outage} options={copy.outages} onChange={setOutage} />
      </div>
      <SceneNote tone={outage !== 'none' ? 'wait' : undefined}>{note}</SceneNote>
      <figure className="service-diagram">
        <figcaption>{visual.path}</figcaption>
        <div className="service-node service-hub">
          <strong>{visual.balancer}</strong>
          <span>{visual.incoming} · {copy.rate(load)}</span>
        </div>
        <span className="service-arrow" data-stopped={flow.activeReplicas === 0} aria-hidden="true">
          {flow.activeReplicas === 0 ? '⊥' : '↓'}
        </span>
        <ul className="service-replicas" role="list">
          {flow.replicas.map(replica => (
            <li className="service-node" key={replica.number} data-offline={!replica.online}>
              <strong>{visual.replica(replica.number)}</strong>
              {replica.online ? (
                <>
                  <span>{visual.forwarded(replica.forwarded)}</span>
                  <meter aria-hidden="true" value={replica.forwarded} max={replicaRate} />
                  {replica.served < replica.forwarded && <span>{copy.served} · {copy.rate(replica.served)}</span>}
                </>
              ) : <span>{visual.offline}</span>}
            </li>
          ))}
        </ul>
        <span className="service-arrow" data-stopped={databaseDown} aria-hidden="true">{databaseDown ? '⇣' : '↓'}</span>
        <div className="service-node service-hub" data-offline={databaseDown}>
          <strong>{visual.database}</strong>
          <span>{databaseDown ? visual.offline : `${copy.capacity} · ${copy.rate(databaseRate)}`}</span>
          <span>{copy.served} · {copy.rate(flow.served)}</span>
        </div>
      </figure>
      <LabMetrics live items={[
        [copy.served, copy.rate(flow.served)],
        [copy.waiting, copy.rate(flow.waiting)],
        [copy.capacity, copy.rate(flow.capacity)],
        [copy.limit, copy.limits[flow.limit]],
        [visual.appExcess, copy.rate(flow.appExcess)],
        [visual.dbExcess, copy.rate(flow.dbExcess)],
      ]} />
      <p className="lab-note">{visual.share} {copy.assumptions}</p>
    </Lab>
  )
}

export function CommitScene({ language, copy }) {
  const visual = commitVisualCopy[language]
  const ui = sceneCopy[language]
  const [votes, setVotes] = useState({ A: 'yes', B: 'yes' })
  const [delivery, setDelivery] = useState('normal')
  const { initial, frames } = commitTrace([votes.A, votes.B], delivery === 'delayed')
  const navigation = useTraceSteps(frames.length)
  const frame = frames[navigation.step - 1]
  const state = frame?.state ?? initial
  const outcome = frames.at(-1).state.decision

  return (
    <Lab title={copy.commitTitle} instructions={copy.commitInstructions}>
      <div className="lab-settings">
        {Object.entries(votes).map(([id, vote]) => (
          <LabSelect key={id} label={copy.voter(id)} value={vote} options={copy.votes} onChange={value => {
            setVotes(current => ({ ...current, [id]: value }))
            navigation.reset()
          }} />
        ))}
        <LabSelect label={visual.delivery} options={visual.deliveries} value={delivery} onChange={value => {
          setDelivery(value)
          navigation.reset()
        }} />
      </div>
      <Prediction key={`${votes.A}-${votes.B}-${delivery}`} language={language} question={visual.predict}
        options={copy.decisions} answer={outcome} revealed={state.decision !== null} explanation={visual.outcome[outcome]} />
      <StepControls {...navigation} language={language} />
      <SceneNote tone={frame?.kind === 'delay' ? 'wait' : undefined}>{commitNote(visual.notes, frame)}</SceneNote>
      <LabMetrics items={[[visual.phase, visual.phases[state.phase]], [copy.decision, copy.decisions[state.decision] ?? visual.pending]]} />
      <Timeline label={visual.diagram} formatPosition={ui.step}
        actors={[
          { id: 'A', label: visual.participant('A'), state: visual.states[state.A], tone: state.A === 'prepared' ? 'wait' : undefined },
          { id: 'coordinator', label: visual.coordinator, state: visual.states[state.coordinator] },
          { id: 'B', label: visual.participant('B'), state: visual.states[state.B], tone: state.B === 'prepared' ? 'wait' : undefined },
        ]}
        events={frames.slice(0, navigation.step).map(event => ({
          ...event,
          label: event.kind === 'deliver' ? event.state.decision.toUpperCase() : visual.events[event.kind],
          tone: event.kind === 'delay' ? 'wait' : undefined,
        }))} />
    </Lab>
  )
}

function commitNote(notes, event) {
  if (!event) return notes.ready
  const decision = event.state.decision?.toUpperCase()
  switch (event.kind) {
    case 'prepare': return notes.prepare(event.to)
    case 'yes': return notes.yes(event.from)
    case 'no': return notes.no(event.from)
    case 'decide': return notes.decide(decision)
    case 'deliver': return notes.deliver(event.to, decision)
    case 'ack': return notes.ack(event.from)
    case 'delay': return event.state.B === 'prepared' ? notes.delay : notes.delayAborted
    case 'complete': return notes.complete
  }
}
