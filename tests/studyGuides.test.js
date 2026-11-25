import assert from 'node:assert/strict'
import test from 'node:test'
import { chapters } from '../src/course.js'
import { studyGuides } from '../src/lessons/study/index.js'

test('every chapter has referenced study notes and extended practice in both languages', () => {
  assert.equal(studyGuides.length, chapters.length)
  const sheets = new Set()

  for (const [index, { topics, exercises }] of studyGuides.entries()) {
    assert.ok(topics.length >= 5, chapters[index].id)
    assert.ok(exercises.length >= 2, chapters[index].id)
    assert.equal(new Set(topics.map(topic => topic.section)).size, topics.length)

    for (const topic of topics) {
      assert.equal(Number.parseInt(topic.section, 10), index + 1)
      for (const language of ['en', 'fi']) {
        const note = topic[language]
        assert.ok(note.title.trim())
        assert.ok(note.paragraphs.length >= 2 && note.paragraphs.every(paragraph => paragraph.trim()))
        assert.ok(note.example.trim())
      }
    }
    for (const exercise of exercises) {
      for (const sheet of exercise.reference.match(/DE[1-7]/g) ?? []) sheets.add(sheet)
      for (const language of ['en', 'fi']) {
        const translation = exercise[language]
        assert.ok(translation.title.trim() && translation.prompt.trim() && translation.solution.trim())
        assert.ok(translation.tasks.length >= 2 && translation.tasks.every(task => task.trim()))
      }
      assert.equal(exercise.en.tasks.length, exercise.fi.tasks.length)
    }
  }
  assert.deepEqual([...sheets].sort(), ['DE1', 'DE2', 'DE3', 'DE4', 'DE5', 'DE6', 'DE7'])
})
