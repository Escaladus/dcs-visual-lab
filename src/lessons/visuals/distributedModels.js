import { commitDecision, replicaRate, serviceCapacity, sortWorkload, sortingSecondsPerSheet } from '../courseModels.js'

export function sortingTimeline(sheets, workers, distribution) {
  const work = sortWorkload(sheets, workers, distribution)
  const sorters = work.stacks.map((count, index) => ({
    number: index + 1,
    count,
    start: work.dispatch,
    end: work.dispatch + count * sortingSecondsPerSheet,
  }))
  const combineAt = work.dispatch + work.sorting
  const milestones = [...new Set([0, work.dispatch, ...sorters.map(sorter => sorter.end), work.total])]
    .sort((a, b) => a - b)

  return { ...work, sorters, combineAt, milestones }
}

export function serviceFlow(load, replicaCount, outage) {
  const capacity = serviceCapacity(load, replicaCount, outage)
  const forwarded = Math.min(load, capacity.activeReplicas * replicaRate)

  function share(total, index) {
    return Math.floor(total / capacity.activeReplicas) + Number(index < total % capacity.activeReplicas)
  }

  const replicas = Array.from({ length: replicaCount }, (_, index) => {
    const online = index < capacity.activeReplicas
    return {
      number: index + 1,
      online,
      forwarded: online ? share(forwarded, index) : 0,
      served: online ? share(capacity.served, index) : 0,
    }
  })

  return {
    ...capacity,
    replicas,
    forwarded,
    appExcess: load - forwarded,
    dbExcess: forwarded - capacity.served,
  }
}

const participants = ['A', 'B']

export function commitTrace(votes, delayB) {
  const initial = { coordinator: 'ready', A: 'ready', B: 'ready', decision: null, phase: 'prepare' }
  const frames = []
  let state = initial

  function record(kind, route, changes = {}) {
    state = { ...state, ...changes }
    frames.push({ kind, ...route, state })
  }

  for (const participant of participants) {
    record('prepare', { from: 'coordinator', to: participant }, { coordinator: 'collecting', [participant]: 'preparing' })
  }
  for (const [index, participant] of participants.entries()) {
    const vote = votes[index]
    record(vote, { from: participant, to: 'coordinator' }, { [participant]: vote === 'yes' ? 'prepared' : 'aborted' })
  }

  const decision = commitDecision(votes)
  const outcome = decision === 'commit' ? 'committed' : 'aborted'
  record('decide', { actor: 'coordinator' }, { coordinator: 'recorded', decision, phase: 'decision' })

  for (const participant of participants) {
    if (participant === 'B' && delayB) record('delay', { from: 'coordinator', to: participant })
    record('deliver', { from: 'coordinator', to: participant }, { [participant]: outcome })
    record('ack', { from: participant, to: 'coordinator' })
  }
  record('complete', { actor: 'coordinator' }, { coordinator: 'complete' })
  return { initial, frames }
}
