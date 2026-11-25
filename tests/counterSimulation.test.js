import assert from 'node:assert/strict'
import test from 'node:test'
import {
  advance,
  createSimulation,
  currentFrame,
  rewind,
  selectThread,
  threadIds,
  threadStatus,
} from '../src/lessons/counterSimulation.js'

function finalCounters(simulation) {
  if (simulation.selectedThread === null) return [currentFrame(simulation).counter]

  return threadIds.flatMap(thread => {
    const status = threadStatus(simulation, thread)
    if (status.blocked || !status.nextOperation) return []
    return finalCounters(advance(selectThread(simulation, thread)))
  })
}

test('the unlocked simulator can lose an update or apply both depending on the schedule', () => {
  const results = finalCounters(createSimulation())
  assert.equal(results.length, 20)
  assert.equal(results.filter(counter => counter === 1).length, 18)
  assert.equal(results.filter(counter => counter === 2).length, 2)
})

test('holding the lock across all three operations protects both updates', () => {
  const initial = createSimulation('locked')
  const acquired = advance(initial)
  assert.equal(currentFrame(acquired).lockOwner, 'A')
  assert.equal(threadStatus(acquired, 'B').blocked, true)
  assert.strictEqual(selectThread(acquired, 'B'), acquired)
  assert.deepEqual(finalCounters(initial), [2, 2])
})

test('stepping back restores the lock, counter, local values, and the undone thread', () => {
  const initial = createSimulation('locked')
  const acquired = advance(selectThread(initial, 'B'))
  const read = advance(acquired)
  const incremented = advance(read)
  const written = advance(incremented)
  const released = advance(written)

  assert.equal(currentFrame(written).counter, 1)
  assert.equal(currentFrame(released).lockOwner, null)
  assert.equal(released.selectedThread, 'A')
  assert.deepEqual(rewind(released), written)
  assert.deepEqual(rewind(written), incremented)
  assert.equal(currentFrame(rewind(incremented)).threads.B.value, 0)
  assert.equal(currentFrame(rewind(acquired)).threads.B.value, null)
  assert.strictEqual(rewind(initial), initial)
})

test('the suggested unlocked schedule alternates threads and stops after both writes', () => {
  let simulation = createSimulation()
  for (let step = 0; step < 6; step += 1) simulation = advance(simulation)

  assert.deepEqual(simulation.history.slice(1).map(frame => frame.event.thread), ['A', 'B', 'A', 'B', 'A', 'B'])
  assert.equal(currentFrame(simulation).counter, 1)
  assert.equal(simulation.selectedThread, null)
  assert.strictEqual(advance(simulation), simulation)
})
