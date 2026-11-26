import { meetingAccessStatus, meetingHttp } from '../meeting.js'

export const responseDeadline = 5
export const timingRequestId = 'm42-availability'

export function timingTrace(delivery) {
  const initial = { client: 'ready', server: 'ready', applications: 0, acceptedAttempt: null }
  const frames = []
  let state = initial

  function record(kind, tick, event, change) {
    state = { ...state, ...change }
    frames.push({ kind, tick, requestId: timingRequestId, ...event, state })
  }

  function request(attempt, tick) {
    record(attempt === 1 ? 'request' : 'retry', tick, { from: 'client', to: 'server', attempt }, { client: 'waiting' })
  }

  function process(attempt, tick) {
    const first = state.applications === 0
    record(first ? 'apply' : 'reuse', tick, { actor: 'server', attempt }, {
      applications: first ? 1 : state.applications,
      server: 'saved',
    })
  }

  function deliver(attempt, tick) {
    const accepted = state.acceptedAttempt === null
    record(accepted ? 'accept' : 'ignore', tick, { from: 'server', to: 'client', attempt }, {
      client: 'confirmed',
      acceptedAttempt: accepted ? attempt : state.acceptedAttempt,
    })
  }

  request(1, 0)
  process(1, 1)
  if (delivery === 'fast') {
    deliver(1, 3)
    return { initial, frames }
  }

  if (delivery === 'lost') {
    record('lost', 3, { from: 'server', to: 'client', attempt: 1, tone: 'lost' })
  }
  record('timeout', responseDeadline, { actor: 'client', tone: 'wait' }, { client: 'timedOut' })
  request(2, responseDeadline)
  if (delivery === 'late') deliver(1, 6)
  process(2, 6)
  deliver(2, 8)
  return { initial, frames }
}

export function tcpTrace(loseSynAck) {
  const initial = { client: 'CLOSED', server: 'LISTEN' }
  const syn = { packet: 'SYN', from: 'client', to: 'server', seq: 100 }
  const synAck = { packet: 'SYN-ACK', from: 'server', to: 'client', seq: 300, ack: syn.seq + 1 }
  const ack = { packet: 'ACK', from: 'client', to: 'server', seq: synAck.ack, ack: synAck.seq + 1 }
  const waiting = { client: 'SYN-SENT', server: 'SYN-RECEIVED' }
  const established = { client: 'ESTABLISHED', server: 'ESTABLISHED' }

  const frames = [
    { kind: 'syn', ...syn, state: { client: 'SYN-SENT', server: 'LISTEN' } },
    { kind: 'synAck', ...synAck, state: waiting },
  ]
  if (loseSynAck) {
    frames.push(
      { kind: 'loss', ...synAck, tone: 'lost', state: waiting },
      { kind: 'timer', actor: 'server', tone: 'wait', state: waiting },
      { kind: 'retransmit', ...synAck, state: waiting },
    )
  }
  frames.push(
    { kind: 'ack', ...ack, state: { client: 'ESTABLISHED', server: 'SYN-RECEIVED' } },
    { kind: 'established', actor: 'server', state: established },
    { kind: 'httpRequest', from: 'client', to: 'server', state: established },
    { kind: 'httpResponse', from: 'server', to: 'client', status: meetingHttp.result.status, state: established },
  )
  return { initial, frames }
}

export function tlsTrace(validHostname, isMember) {
  const initial = { client: 'tcpReady', server: 'tcpReady', requestSent: false }
  const frames = []
  let state = initial

  function record(kind, event, change) {
    state = { ...state, ...change }
    frames.push({ kind, ...event, state })
  }

  const toServer = { from: 'client', to: 'server' }
  const toClient = { from: 'server', to: 'client' }
  record('clientHello', toServer, { client: 'negotiating', server: 'negotiating' })
  record('serverHello', toClient, { client: 'handshakeKeys', server: 'handshakeKeys' })
  record('credentials', { ...toClient, encrypted: true }, { client: 'checking', server: 'handshakeKeys' })
  record('serverFinished', { ...toClient, encrypted: true }, { server: 'finished' })
  if (!validHostname) {
    record('badHostname', { actor: 'client', tone: 'lost' }, { client: 'rejected' })
    return { initial, frames }
  }

  record('verified', { actor: 'client' }, { client: 'verified' })
  record('clientFinished', { ...toServer, encrypted: true }, { client: 'finished' })
  record('secure', { actor: 'server' }, { client: 'secure', server: 'secure' })
  record('httpsRequest', { ...toServer, encrypted: true }, { requestSent: true })
  record('httpsResponse', { ...toClient, encrypted: true, status: meetingAccessStatus(isMember) })
  return { initial, frames }
}

