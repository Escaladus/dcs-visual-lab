export const sortingSecondsPerSheet = 3

export function sortWorkload(sheets, workers, distribution) {
  const firstStack = distribution === 'skewed' && workers > 1 ? Math.ceil(sheets / 2) : 0
  const remainingWorkers = workers - Number(firstStack > 0)
  const remainingSheets = sheets - firstStack
  const base = Math.floor(remainingSheets / remainingWorkers)
  const extra = remainingSheets % remainingWorkers
  const stacks = Array.from({ length: remainingWorkers }, (_, index) => base + Number(index < extra))
  if (firstStack) stacks.unshift(firstStack)

  const dispatch = (workers - 1) * 2
  const sorting = Math.max(...stacks) * sortingSecondsPerSheet
  const merge = workers === 1 ? 0 : sheets
  return { stacks, dispatch, sorting, merge, total: dispatch + sorting + merge }
}

export const replicaRate = 40
export const databaseRate = 100

export function serviceCapacity(load, replicas, outage) {
  const activeReplicas = replicas - Number(outage === 'replica')
  const applicationLimit = activeReplicas * replicaRate
  const databaseLimit = outage === 'database' ? 0 : databaseRate
  const capacity = Math.min(applicationLimit, databaseLimit)
  const served = Math.min(load, capacity)
  return {
    activeReplicas, capacity, served, waiting: load - served,
    limit: applicationLimit <= databaseLimit ? 'application' : 'database',
  }
}

export const queueCapacity = 3

export function createQueue() {
  return { items: [], produced: 0, consumed: 0, event: null }
}

export function queueStep(state, action) {
  if (action === 'produce') {
    if (state.items.length === queueCapacity) return { ...state, event: { kind: 'full' } }
    const item = state.produced + 1
    return { ...state, items: [...state.items, item], produced: item, event: { kind: 'added', item } }
  }
  if (state.items.length === 0) return { ...state, event: { kind: 'empty' } }
  const [item, ...items] = state.items
  return { ...state, items, consumed: state.consumed + 1, event: { kind: 'removed', item } }
}

export function lockTrace(slowerA) {
  const first = slowerA ? 'B' : 'A'
  const second = slowerA ? 'A' : 'B'
  const events = [
    { kind: 'request', actor: 'A' },
    { kind: 'signal' },
    { kind: 'request', actor: 'B' },
    { kind: 'arrive', actor: first },
    { kind: 'arrive', actor: second },
    { kind: 'release', actor: first },
    { kind: 'release', actor: second },
  ]
  let owner = null
  let waiting = []
  let order = []

  return events.map(event => {
    let granted = null
    if (event.kind === 'arrive') {
      if (owner === null) granted = event.actor
      else waiting = [...waiting, event.actor]
    }
    if (event.kind === 'release') {
      owner = null
      granted = waiting[0] ?? null
      waiting = waiting.slice(1)
    }
    if (granted) {
      owner = granted
      order = [...order, granted]
    }
    return { ...event, owner, waiting, order, granted }
  })
}

export function commitDecision(votes) {
  return votes.every(vote => vote === 'yes') ? 'commit' : 'abort'
}
