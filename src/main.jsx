import { StrictMode, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { chapters, text } from './course.js'
import './styles.css'

const languageKey = 'dcs-visual-lab-language'

function readLanguage() {
  try {
    return localStorage.getItem(languageKey) === 'fi' ? 'fi' : 'en'
  } catch {
    return 'en'
  }
}

function readChapter() {
  const id = window.location.hash.slice(1)
  return chapters.find(chapter => chapter.id === id) ?? null
}

function CourseOverview({ headingRef, language, copy }) {
  return (
    <>
      <div className="course-intro">
        <div className="intro-copy">
          <h1 ref={headingRef} tabIndex={-1}>{copy.courseTitle}</h1>
          <p>{copy.introduction}</p>
          <a className="start-link" href={`#${chapters[0].id}`}>{copy.start}</a>
        </div>
        <div className="network-diagram" aria-hidden="true">
          <span className="wire wire-top" />
          <span className="wire wire-middle" />
          <span className="wire wire-bottom" />
          <span className="diagram-node node-hub" />
          <span className="diagram-node node-top" />
          <span className="diagram-node node-middle" />
          <span className="diagram-node node-bottom" />
          <span className="diagram-message" />
        </div>
      </div>

      <section className="chapter-index" aria-labelledby="chapter-index-title">
        <h2 id="chapter-index-title">{copy.chapters}</h2>
        <ol className="chapter-cards">
          {chapters.map(chapter => (
            <li key={chapter.id}>
              <a href={`#${chapter.id}`} aria-labelledby={`title-${chapter.id}`}>
                <h3 id={`title-${chapter.id}`}>{chapter[language].title}</h3>
                <p>{chapter[language].summary}</p>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}

function Chapter({ chapter, headingRef, language, copy }) {
  const content = chapter[language]
  const position = chapters.indexOf(chapter)
  const previous = chapters[position - 1]
  const next = chapters[position + 1]

  return (
    <article className="chapter">
      <a className="overview-link" href="#overview">{copy.overview}</a>
      <h1 ref={headingRef} tabIndex={-1}>{content.title}</h1>
      <p className="chapter-summary">{content.summary}</p>

      <section className="chapter-topics" aria-labelledby="topic-list-title">
        <h2 id="topic-list-title">{copy.topics}</h2>
        <ul>
          {content.topics.map(topic => <li key={topic}>{topic}</li>)}
        </ul>
      </section>

      <nav className="chapter-neighbors" aria-label={copy.chapterNavigation}>
        {previous && (
          <a href={`#${previous.id}`}>
            <span>{copy.previous}</span>
            {previous[language].title}
          </a>
        )}
        {next && (
          <a href={`#${next.id}`}>
            <span>{copy.next}</span>
            {next[language].title}
          </a>
        )}
      </nav>
    </article>
  )
}

function App() {
  const [language, setLanguage] = useState(readLanguage)
  const [chapter, setChapter] = useState(readChapter)
  const [menuOpen, setMenuOpen] = useState(false)
  const headingRef = useRef(null)
  const menuButtonRef = useRef(null)
  const copy = text[language]

  useEffect(() => {
    function handleHashChange() {
      setChapter(readChapter())
      setMenuOpen(false)
      window.scrollTo({ top: 0 })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const previousChapter = useRef(chapter)
  useEffect(() => {
    if (previousChapter.current !== chapter) {
      headingRef.current?.focus({ preventScroll: true })
      previousChapter.current = chapter
    }
  }, [chapter])

  useEffect(() => {
    document.documentElement.lang = language
    document.title = chapter ? `${chapter[language].title} · DCS Visual Lab` : 'DCS Visual Lab'
  }, [chapter, language])

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage)
    try {
      localStorage.setItem(languageKey, nextLanguage)
    } catch {
      // Language changes still work for the current page when storage is blocked.
    }
  }

  function closeMenuOnEscape(event) {
    if (!menuOpen || event.key !== 'Escape') return
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  function selectMenuLink(event) {
    if (!menuOpen || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    setMenuOpen(false)
    if (event.currentTarget.getAttribute('aria-current')) {
      headingRef.current?.focus()
    }
  }

  return (
    <div className="site" onKeyDown={closeMenuOnEscape}>
      <a
        className="skip-link"
        href="#main-content"
        onClick={event => {
          event.preventDefault()
          setMenuOpen(false)
          headingRef.current?.focus()
        }}
      >
        {copy.skip}
      </a>
      <header className="site-header">
        <div className="site-header-inner">
          <a className="brand" href="#overview">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            DCS Visual Lab
          </a>
          <button
            className="menu-button"
            type="button"
            ref={menuButtonRef}
            aria-controls="course-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(open => !open)}
          >
            {copy.menu}
          </button>
          <div className="language-picker" role="group" aria-label={copy.language}>
            <button type="button" lang="en" aria-label="English" aria-pressed={language === 'en'} onClick={() => changeLanguage('en')}>EN</button>
            <button type="button" lang="fi" aria-label="Suomi" aria-pressed={language === 'fi'} onClick={() => changeLanguage('fi')}>FI</button>
          </div>
        </div>
      </header>

      <div className="course-layout">
        <nav
          id="course-navigation"
          className={menuOpen ? 'course-nav is-open' : 'course-nav'}
          aria-label={copy.chapters}
        >
          <a href="#overview" aria-current={!chapter ? 'page' : undefined} onClick={selectMenuLink}>{copy.overview}</a>
          <ol>
            {chapters.map(item => (
              <li key={item.id}>
                <a href={`#${item.id}`} aria-current={item === chapter ? 'page' : undefined} onClick={selectMenuLink}>
                  {item[language].title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <main id="main-content">
          {chapter
            ? <Chapter chapter={chapter} headingRef={headingRef} language={language} copy={copy} />
            : <CourseOverview headingRef={headingRef} language={language} copy={copy} />}
        </main>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
