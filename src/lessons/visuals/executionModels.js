export function javaThreadTrace(scenario) {
  const initial = { main: 'running', worker: 'new' }
  if (scenario === 'run') {
    return {
      initial,
      frames: [
        { kind: 'run', actor: 'main', state: { main: 'running', worker: 'new' } },
        { kind: 'work', actor: 'main', state: { main: 'running', worker: 'new' } },
        { kind: 'returned', actor: 'main', state: { main: 'running', worker: 'new' } },
      ],
    }
  }

  const frames = [
    { kind: 'start', from: 'main', to: 'worker', state: { main: 'running', worker: 'runnable' } },
    { kind: 'mainWork', actor: 'main', state: { main: 'running', worker: 'runnable' } },
  ]
  if (scenario === 'join') {
    frames.push({ kind: 'join', actor: 'main', state: { main: 'waiting', worker: 'runnable' } })
  }
  const main = frames.at(-1).state.main
  frames.push(
    { kind: 'work', actor: 'worker', state: { main, worker: 'running' } },
    { kind: 'terminated', actor: 'worker', state: { main, worker: 'terminated' } },
  )
  if (scenario === 'join') {
    frames.push({ kind: 'joined', actor: 'main', state: { main: 'running', worker: 'terminated' } })
  }
  return { initial, frames }
}

export const inputTick = 1

export function ioTrace(delay) {
  return Array.from({ length: delay + 2 }, (_, tick) => {
    const received = tick >= delay
    return {
      tick,
      network: tick === 0 ? 'sent' : received ? 'received' : 'inFlight',
      blocking: {
        call: received ? 'returned' : 'blocked',
        input: tick < inputTick ? 'pending' : tick <= delay ? 'queued' : 'handled',
        handledAt: tick > delay ? delay + 1 : null,
      },
      async: {
        call: received ? 'resumed' : 'suspended',
        input: tick < inputTick ? 'pending' : 'handled',
        handledAt: tick >= inputTick ? inputTick : null,
      },
    }
  })
}
