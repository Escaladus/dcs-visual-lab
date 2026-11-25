export const meeting = {
  id: 'm42',
  organizer: 'Aino',
  guest: 'Leo',
  peer: 'Mika',
  availability: {
    Aino: ['14:00', '15:00'],
    Leo: ['15:00', '16:00'],
    Mika: ['15:00', '17:00'],
  },
  result: '15:00',
}

const meetingPath = `/meetings/${meeting.id}`
export const meetingHttp = {
  host: 'meeting.example',
  create: {
    method: 'POST',
    path: '/meetings',
    body: { organizer: meeting.organizer, available: meeting.availability.Aino },
    status: '201 Created',
    headers: { Location: meetingPath },
  },
  availability: {
    method: 'PUT',
    path: `${meetingPath}/availability/leo`,
    body: { available: meeting.availability.Leo },
    status: '204 No Content',
  },
  result: {
    method: 'GET',
    path: `${meetingPath}/result`,
    status: '200 OK',
    result: { time: meeting.result },
  },
}

function httpMessage(lines, body) {
  if (body) {
    const json = JSON.stringify(body)
    const length = new TextEncoder().encode(json).length
    return [...lines, 'Content-Type: application/json', `Content-Length: ${length}`, '', json].join('\r\n')
  }
  return [...lines, '', ''].join('\r\n')
}

export function httpRequest({ method, path, body }) {
  return httpMessage([`${method} ${path} HTTP/1.1`, `Host: ${meetingHttp.host}`], body)
}

export function httpResponse({ status, headers = {}, result }) {
  const lines = [`HTTP/1.1 ${status}`]
  for (const [name, value] of Object.entries(headers)) lines.push(`${name}: ${value}`)
  if (!result && status !== '204 No Content') lines.push('Content-Length: 0')
  return httpMessage(lines, result)
}

export function meetingTrace(architecture, loseInvite) {
  const actors = architecture === 'server' ? ['Aino', 'Service', 'Leo'] : ['Aino', 'Leo', 'Mika']
  const owner = architecture === 'server' ? 'Service' : 'Aino'
  const events = [
    { kind: 'local', actor: 'Aino', label: 'plan' },
    { kind: 'local', actor: 'Leo', label: 'choose' },
  ]
  let nextMessage = 0

  function exchange(from, to, label, drop = false) {
    const message = ++nextMessage
    events.push({ kind: 'send', actor: from, peer: to, label, message })
    events.push(drop
      ? { kind: 'drop', actor: from, peer: to, label }
      : { kind: 'receive', actor: to, peer: from, label, message })
  }

  if (architecture === 'server') exchange('Aino', owner, 'proposal')
  exchange(owner, 'Leo', 'invite', loseInvite)
  if (loseInvite) {
    events.push({ kind: 'local', actor: owner, label: 'timeout' })
    exchange(owner, 'Leo', 'retry')
  }
  exchange('Leo', owner, 'ack')
  exchange('Leo', owner, 'availability')
  if (architecture === 'peer') {
    exchange('Aino', 'Mika', 'invite')
    exchange('Mika', 'Aino', 'availability')
  }
  events.push({ kind: 'local', actor: owner, label: 'decide' })
  if (architecture === 'server') exchange(owner, 'Aino', 'decision')
  exchange(owner, 'Leo', 'decision')
  if (architecture === 'peer') exchange(owner, 'Mika', 'decision')

  let clocks = Object.fromEntries(actors.map(actor => [actor, { lamport: 0, vector: actors.map(() => 0) }]))
  const initial = clocks
  const sent = new Map()
  const frames = events.map(event => {
    if (event.kind === 'drop') return { ...event, clocks }

    const local = clocks[event.actor]
    const remote = event.kind === 'receive' ? sent.get(event.message) : null
    const actorIndex = actors.indexOf(event.actor)
    const timestamp = {
      lamport: Math.max(local.lamport, remote?.lamport ?? 0) + 1,
      vector: local.vector.map((value, index) =>
        Math.max(value, remote?.vector[index] ?? 0) + Number(index === actorIndex)),
    }
    if (event.kind === 'send') sent.set(event.message, timestamp)
    clocks = { ...clocks, [event.actor]: timestamp }
    return { ...event, clocks }
  })

  return { actors, initial, frames }
}
