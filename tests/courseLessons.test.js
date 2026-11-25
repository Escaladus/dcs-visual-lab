import assert from 'node:assert/strict'
import test from 'node:test'
import { chapters } from '../src/course.js'
import { concurrencyCopy } from '../src/lessons/concurrencyCopy.js'
import { courseLessonCopy } from '../src/lessons/courseLessonCopy.js'
import { commitDecision, createQueue, lockTrace, queueStep, serviceCapacity, sortWorkload } from '../src/lessons/courseModels.js'
import { httpRequest, httpResponse, meeting, meetingHttp, meetingTrace } from '../src/lessons/meeting.js'

test('sorting time is set by the largest stack and includes split and combine costs', () => {
  assert.deepEqual(sortWorkload(24, 3, 'balanced'), { stacks: [8, 8, 8], dispatch: 4, sorting: 24, merge: 24, total: 52 })
  assert.deepEqual(sortWorkload(24, 3, 'skewed'), { stacks: [12, 6, 6], dispatch: 4, sorting: 36, merge: 24, total: 64 })
  assert.deepEqual(sortWorkload(25, 1, 'skewed'), { stacks: [25], dispatch: 0, sorting: 75, merge: 0, total: 75 })
  assert.deepEqual(sortWorkload(25, 3, 'balanced').stacks, [9, 8, 8])
})

test('a partial failure reduces capacity and a shared database failure stops requests', () => {
  assert.deepEqual(serviceCapacity(90, 3, 'replica'), { activeReplicas: 2, capacity: 80, served: 80, waiting: 10, limit: 'application' })
  assert.deepEqual(serviceCapacity(130, 4, 'none'), { activeReplicas: 4, capacity: 100, served: 100, waiting: 30, limit: 'database' })
  assert.deepEqual(serviceCapacity(90, 3, 'database'), { activeReplicas: 3, capacity: 0, served: 0, waiting: 90, limit: 'database' })
})

test('the bounded queue preserves FIFO order at full and empty boundaries', () => {
  const initial = createQueue()
  assert.equal(queueStep(initial, 'consume').event.kind, 'empty')
  const full = ['produce', 'produce', 'produce', 'produce'].reduce(queueStep, initial)
  assert.deepEqual(full.items, [1, 2, 3])
  assert.equal(full.event.kind, 'full')
  const removed = queueStep(full, 'consume')
  assert.deepEqual(removed.event, { kind: 'removed', item: 1 })
  assert.deepEqual(queueStep(removed, 'produce').items, [2, 3, 4])
})

test('receives merge their send timestamp while the lost invitation never advances its receiver', () => {
  for (const architecture of ['server', 'peer']) {
    const { frames, actors, initial } = meetingTrace(architecture, true)
    const lost = frames.findIndex(frame => frame.kind === 'drop')
    assert.ok(lost > 0)
    assert.deepEqual(frames[lost].clocks, frames[lost - 1].clocks)
    assert.equal(frames[lost + 1].label, 'timeout')
    assert.equal(frames[lost + 2].label, 'retry')
    assert.equal(frames[lost + 3].kind, 'receive')
    assert.equal(frames[lost + 3].actor, 'Leo')
    assert.equal(frames[lost + 4].label, 'ack')
    assert.equal(frames.filter(frame => frame.kind === 'receive' && frame.label === 'invite' && frame.actor === 'Leo').length, 0)

    for (const [index, frame] of frames.entries()) {
      if (frame.kind !== 'receive') continue
      const local = (frames[index - 1]?.clocks ?? initial)[frame.actor]
      const send = frames.find(candidate => candidate.message === frame.message && candidate.kind === 'send')
      const timestamp = send.clocks[send.actor]
      assert.deepEqual(frame.clocks[frame.actor], {
        lamport: Math.max(local.lamport, timestamp.lamport) + 1,
        vector: local.vector.map((value, slot) => Math.max(value, timestamp.vector[slot]) + Number(actors[slot] === frame.actor)),
      })
    }
  }
})

test('the meeting HTTP example stays consistent with the meeting schedule', () => {
  const common = Object.values(meeting.availability).reduce((left, right) => left.filter(time => right.includes(time)))
  assert.deepEqual(common, [meeting.result])
  const request = httpRequest(meetingHttp.availability)
  const [headers, body] = request.split('\r\n\r\n')
  assert.match(headers, /^PUT \/meetings\/m42\/availability\/leo HTTP\/1\.1/)
  assert.match(headers, new RegExp(`Content-Length: ${Buffer.byteLength(body)}$`))
  assert.deepEqual(JSON.parse(body), { available: meeting.availability.Leo })
  assert.equal(httpResponse(meetingHttp.availability), 'HTTP/1.1 204 No Content\r\n\r\n')
  assert.match(httpResponse(meetingHttp.result), /\{"time":"15:00"\}$/)
})

test('central grants can violate causal order and any no vote aborts both participants', () => {
  const delayed = lockTrace(true)
  assert.deepEqual(delayed.filter(frame => frame.kind === 'request').map(frame => frame.actor), ['A', 'B'])
  assert.deepEqual(delayed.at(-1).order, ['B', 'A'])
  assert.deepEqual(delayed[4].waiting, ['A'])
  assert.equal(delayed[5].owner, 'A')
  assert.equal(delayed.at(-1).owner, null)
  assert.deepEqual(lockTrace(false).at(-1).order, ['A', 'B'])
  assert.equal(commitDecision(['yes', 'yes']), 'commit')
  assert.equal(commitDecision(['yes', 'no']), 'abort')
  assert.equal(commitDecision(['no', 'yes']), 'abort')
})

test('each chapter has parallel English and Finnish exercise choices and answers', () => {
  for (const chapter of chapters) {
    const { en, fi } = chapter.id === 'concurrency' ? concurrencyCopy : courseLessonCopy[chapter.id]
    assert.equal(en.questions.length, 2)
    assert.equal(fi.questions.length, 2)
    for (const [index, question] of en.questions.entries()) {
      const translation = fi.questions[index]
      assert.equal(translation.id, question.id)
      if (question.parts) {
        assert.deepEqual(translation.parts.map(({ id, options, correct }) => ({ id, options, correct })),
          question.parts.map(({ id, options, correct }) => ({ id, options, correct })))
      } else {
        assert.equal(translation.options.length, question.options.length)
        assert.equal(translation.correct, question.correct)
      }
    }
  }
})
