export const threadIds = ['A', 'B']

const counterOperations = ['read', 'increment', 'write']
const operationsByMode = {
  unlocked: counterOperations,
  locked: ['acquire', ...counterOperations, 'release'],
}

export function createSimulation(mode = 'unlocked') {
  return {
    mode,
    selectedThread: 'A',
    history: [{
      counter: 0,
      lockOwner: null,
      threads: {
        A: { completed: 0, value: null },
        B: { completed: 0, value: null },
      },
      event: null,
    }],
  }
}

export function currentFrame(simulation) {
  return simulation.history.at(-1)
}

export function threadStatus(simulation, thread) {
  const frame = currentFrame(simulation)
  const { completed, value } = frame.threads[thread]
  const operations = operationsByMode[simulation.mode]
  const nextOperation = operations[completed] ?? null
  return {
    value,
    completed,
    operations,
    nextOperation,
    blocked: nextOperation === 'acquire' && frame.lockOwner !== null,
  }
}

export function selectThread(simulation, thread) {
  const { nextOperation, blocked } = threadStatus(simulation, thread)
  if (!nextOperation || blocked) return simulation
  return { ...simulation, selectedThread: thread }
}

export function advance(simulation) {
  const thread = simulation.selectedThread
  if (!thread) return simulation

  const frame = currentFrame(simulation)
  const { nextOperation: operation, blocked, completed } = threadStatus(simulation, thread)
  if (!operation || blocked) return simulation

  let { counter, lockOwner } = frame
  let { value } = frame.threads[thread]
  switch (operation) {
    case 'acquire':
      lockOwner = thread
      break
    case 'read':
      value = counter
      break
    case 'increment':
      value += 1
      break
    case 'write':
      counter = value
      break
    case 'release':
      lockOwner = null
      break
  }

  const nextFrame = {
    counter,
    lockOwner,
    threads: { ...frame.threads, [thread]: { value, completed: completed + 1 } },
    event: { thread, operation, value, previousCounter: frame.counter, counter },
  }
  const next = { ...simulation, history: [...simulation.history, nextFrame] }
  const otherThread = threadIds.find(id => id !== thread)
  const selectedThread = [otherThread, thread].find(id => {
    const status = threadStatus(next, id)
    return status.nextOperation && !status.blocked
  }) ?? null

  return { ...next, selectedThread }
}

export function rewind(simulation) {
  if (simulation.history.length === 1) return simulation
  return {
    ...simulation,
    selectedThread: currentFrame(simulation).event.thread,
    history: simulation.history.slice(0, -1),
  }
}

export function counterPreset(scenario) {
  const locked = scenario === 'locked'
  const schedule = scenario === 'sequential'
    ? ['A', 'A', 'A', 'B', 'B', 'B']
    : scenario === 'race' ? ['A', 'B', 'A', 'B', 'A', 'B'] : []
  const states = [createSimulation(locked ? 'locked' : 'unlocked')]
  while (states.at(-1).selectedThread !== null) {
    const current = states.at(-1)
    const next = schedule.at(states.length - 1)
    states.push(advance(next ? selectThread(current, next) : current))
  }
  return states
}
