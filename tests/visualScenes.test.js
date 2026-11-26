import assert from 'node:assert/strict'
import test from 'node:test'
import { counterPreset, currentFrame, threadStatus } from '../src/lessons/counterSimulation.js'
import { meetingHttp, meetingTrace } from '../src/lessons/meeting.js'
import { courseLessonCopy } from '../src/lessons/courseLessonCopy.js'
import { ioSceneCopy, threadSceneCopy } from '../src/lessons/visuals/executionCopy.js'
import { inputTick, ioTrace, javaThreadTrace } from '../src/lessons/visuals/executionModels.js'
import { tcpCopy, timingCopy, tlsCopy } from '../src/lessons/visuals/networkCopy.js'
import { responseDeadline, tcpTrace, timingTrace, tlsTrace } from '../src/lessons/visuals/networkModels.js'

test('counter presets demonstrate both unlocked outcomes and waiting for the lock', () => {
  const race = counterPreset('race')
  const sequential = counterPreset('sequential')
  const locked = counterPreset('locked')
  assert.equal(currentFrame(race.at(-1)).counter, 1)
  assert.deepEqual(race.slice(1, 3).map(state => currentFrame(state).event.value), [0, 0])
  assert.equal(currentFrame(sequential.at(-1)).counter, 2)
  assert.equal(currentFrame(locked.at(-1)).counter, 2)
  assert.equal(currentFrame(locked[1]).lockOwner, 'A')
  assert.equal(threadStatus(locked[1], 'B').blocked, true)
  assert.equal(currentFrame(locked[5]).lockOwner, null)
  assert.equal(threadStatus(locked[5], 'B').blocked, false)
})

test('run executes on main, start schedules the worker, and join waits for termination', () => {
  const direct = javaThreadTrace('run').frames
  assert.equal(direct.find(event => event.kind === 'work').actor, 'main')
  assert.ok(direct.every(event => event.state.worker === 'new'))
  const started = javaThreadTrace('start').frames
  assert.equal(started.find(event => event.kind === 'start').state.worker, 'runnable')
  assert.equal(started.find(event => event.kind === 'work').actor, 'worker')
  assert.ok(started.every(event => event.state.main === 'running'))
  const joined = javaThreadTrace('join').frames
  assert.equal(joined.find(event => event.kind === 'work').state.main, 'waiting')
  assert.equal(joined.at(-2).state.worker, 'terminated')
  assert.equal(joined.at(-1).state.main, 'running')
})

test('the same reply delay leaves input queued only on the blocking side', () => {
  for (const delay of [2, 4, 7]) {
    const frames = ioTrace(delay)
    assert.equal(frames[inputTick].blocking.input, 'queued')
    assert.equal(frames[inputTick].async.handledAt, inputTick)
    assert.equal(frames[delay].network, 'received')
    assert.equal(frames[delay].blocking.handledAt, null)
    assert.equal(frames.at(-1).blocking.handledAt, delay + 1)
  }
})

test('late and lost replies use the same retry ID and apply the update once', () => {
  for (const [scenario, acceptedAttempt] of [['fast', 1], ['late', 1], ['lost', 2]]) {
    const { initial, frames } = timingTrace(scenario)
    assert.equal(initial.applications, 0)
    assert.equal(frames.filter(frame => frame.kind === 'apply').length, 1)
    assert.equal(frames.at(-1).state.applications, 1)
    assert.equal(frames.at(-1).state.acceptedAttempt, acceptedAttempt)
    assert.equal(new Set(frames.map(frame => frame.requestId)).size, 1)
    if (scenario === 'fast') {
      assert.equal(frames.at(-1).tick, 3)
      assert.ok(frames.every(frame => frame.kind !== 'retry'))
    } else {
      assert.equal(frames.find(frame => frame.kind === 'timeout').tick, responseDeadline)
      assert.equal(frames.find(frame => frame.kind === 'retry').attempt, 2)
      assert.ok(frames.some(frame => frame.kind === 'reuse'))
    }
  }
  const late = timingTrace('late').frames
  assert.equal(late.find(frame => frame.kind === 'accept').tick, 6)
  assert.equal(late.at(-1).kind, 'ignore')
  assert.ok(timingTrace('lost').frames.some(frame => frame.kind === 'lost'))
})

test('TCP shows both endpoint states and the same SYN-ACK on retransmission', () => {
  for (const loss of [false, true]) {
    const { initial, frames } = tcpTrace(loss)
    assert.deepEqual(initial, { client: 'CLOSED', server: 'LISTEN' })
    const synAck = frames.find(frame => frame.kind === 'synAck')
    assert.equal(synAck.ack, frames[0].seq + 1)
    assert.deepEqual(synAck.state, { client: 'SYN-SENT', server: 'SYN-RECEIVED' })
    const ack = frames.find(frame => frame.kind === 'ack')
    assert.equal(ack.seq, synAck.ack)
    assert.equal(ack.ack, synAck.seq + 1)
    assert.deepEqual(ack.state, { client: 'ESTABLISHED', server: 'SYN-RECEIVED' })
    assert.deepEqual(frames.at(-2).state, { client: 'ESTABLISHED', server: 'ESTABLISHED' })
    assert.equal(frames.at(-2).kind, 'httpRequest')
    const retry = frames.find(frame => frame.kind === 'retransmit')
    if (loss) {
      assert.equal(frames.find(frame => frame.kind === 'timer').actor, 'server')
      assert.deepEqual([retry.seq, retry.ack], [synAck.seq, synAck.ack])
    } else {
      assert.equal(retry, undefined)
    }
  }
})

test('TLS authenticates the server before sending HTTPS and checks permissions after that', () => {
  for (const member of [false, true]) {
    const rejected = tlsTrace(false, member).frames
    assert.equal(rejected.at(-1).kind, 'badHostname')
    assert.ok(rejected.every(frame => !frame.state.requestSent))

    const frames = tlsTrace(true, member).frames
    assert.ok(frames.find(frame => frame.kind === 'credentials').encrypted)
    assert.ok(frames.find(frame => frame.kind === 'clientFinished').encrypted)
    assert.equal(frames.at(-3).kind, 'secure')
    assert.equal(frames.at(-3).state.requestSent, false)
    assert.equal(frames.at(-2).kind, 'httpsRequest')
    assert.equal(frames.at(-2).state.requestSent, true)
    assert.equal(frames.at(-1).status, member ? meetingHttp.result.status : '403 Forbidden')
  }
})

test('both languages cover all labels and descriptions shown by the visual traces', () => {
  const traces = [
    [threadSceneCopy, ['run', 'start', 'join'].flatMap(mode => javaThreadTrace(mode).frames)],
    [timingCopy, ['fast', 'late', 'lost'].flatMap(delivery => timingTrace(delivery).frames)],
    [tcpCopy, tcpTrace(true).frames],
    [tlsCopy, [...tlsTrace(true, true).frames, ...tlsTrace(false, true).frames]],
  ]
  for (const language of ['en', 'fi']) {
    for (const [copy, frames] of traces) {
      const translation = copy[language]
      assert.ok(translation.notes.ready)
      for (const frame of frames) {
        assert.ok(translation.labels[frame.kind] || frame.packet, frame.kind)
        const notes = { timeout: ['bounded', 'unbounded'], httpsResponse: ['ok', 'forbidden'] }
        for (const key of notes[frame.kind] ?? [frame.kind]) assert.ok(translation.notes[key], key)
        if (translation.states) {
          for (const state of [frame.state.client, frame.state.server, frame.state.main, frame.state.worker].filter(Boolean)) {
            assert.ok(translation.states[state], state)
          }
        }
      }
    }
    for (const frame of ioTrace(4)) {
      assert.ok(ioSceneCopy[language].networkStates[frame.network])
      for (const mode of ['blocking', 'async']) {
        assert.ok(ioSceneCopy[language].callStates[frame[mode].call])
        assert.ok(ioSceneCopy[language].inputStates[frame[mode].input])
      }
    }
    for (const architecture of ['server', 'peer']) {
      for (const event of meetingTrace(architecture, true).frames) {
        if (event.kind === 'local') assert.ok(courseLessonCopy['logical-clocks'][language].lab.eventLabels[event.label])
      }
    }
  }
})

test('clock diagram pairs a dropped message with its send and leaves every clock unchanged', () => {
  const { frames } = meetingTrace('server', true)
  const lost = frames.findIndex(frame => frame.kind === 'drop')
  const sent = frames[lost - 1]
  assert.equal(sent.kind, 'send')
  assert.equal(frames[lost].message, sent.message)
  assert.deepEqual(frames[lost].clocks, sent.clocks)
  assert.ok(frames.every(frame => frame.kind !== 'receive' || frame.message !== sent.message))
})
