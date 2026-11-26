import { useEffect, useId, useState } from 'react'

const controls = {
  en: { back: 'Back one step', next: 'Next step', reset: 'Reset', play: 'Play', pause: 'Pause', progress: (step, total) => `${step} of ${total} steps` },
  fi: { back: 'Edellinen askel', next: 'Seuraava askel', reset: 'Aloita alusta', play: 'Toista', pause: 'Pysäytä', progress: (step, total) => `${step}/${total} askelta` },
}

export function Lab({ title, instructions, children }) {
  const id = useId()
  return (
    <section className="counter-lab" aria-labelledby={id}>
      <header className="counter-lab-header">
        <h2 id={id}>{title}</h2>
        <p>{instructions}</p>
      </header>
      <div className="counter-lab-body">{children}</div>
    </section>
  )
}

export function LabSelect({ label, value, onChange, options }) {
  const labelId = useId()
  return (
    <label className="lab-select">
      <span id={labelId}>{label}</span>
      <select aria-labelledby={labelId} value={value} onChange={event => onChange(event.target.value)}>
        {Object.entries(options).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
      </select>
    </label>
  )
}

export function LabRange({ label, min, max, step = 1, value, onChange, format = String }) {
  const id = useId()
  return (
    <label className="lab-range" htmlFor={id}>
      <span>{label}</span>
      <span className="range-value" aria-hidden="true">{format(value)}</span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={event => onChange(Number(event.target.value))}
      />
    </label>
  )
}

export function LabMetrics({ items, live = false }) {
  return (
    <dl className="counter-metrics" aria-live={live ? 'polite' : undefined}>
      {items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
  )
}

export function useLabSteps() {
  const [step, setStep] = useState(0)
  return { step, setStep, reset: () => setStep(0) }
}

export function LabSteps({ navigation, total, language }) {
  const { step, setStep, reset } = navigation
  return <StepControls
    step={step}
    total={total}
    language={language}
    announceProgress
    back={() => setStep(current => Math.max(0, current - 1))}
    next={() => setStep(current => Math.min(total, current + 1))}
    reset={reset}
  />
}

export function useTraceSteps(total) {
  const [{ step, playing }, setPlayback] = useState({ step: 0, playing: false })

  useEffect(() => {
    if (!playing || step >= total) return
    const timer = setTimeout(() => {
      setPlayback(current => {
        if (!current.playing || current.step !== step) return current
        return { step: step + 1, playing: step + 1 < total }
      })
    }, 1050)
    return () => clearTimeout(timer)
  }, [playing, step, total])

  function move(delta) {
    setPlayback(current => ({
      step: Math.min(total, Math.max(0, current.step + delta)),
      playing: false,
    }))
  }

  return {
    step,
    total,
    playing,
    back: () => move(-1),
    next: () => move(1),
    reset: () => setPlayback({ step: 0, playing: false }),
    toggle: () => setPlayback(current => ({ ...current, playing: !current.playing })),
  }
}

export function StepControls({ step, total, language, back, next, reset, playing, toggle, announceProgress }) {
  const copy = controls[language]
  return (
    <div className="lab-controls">
      <button className="lab-button" type="button" disabled={step === 0} onClick={back}>
        {copy.back}
      </button>
      <button className="lab-button lab-primary" type="button" disabled={step === total} onClick={next}>
        {copy.next}
      </button>
      {toggle && (
        <button className="lab-button" type="button" disabled={step === total} onClick={toggle}>
          {playing ? copy.pause : copy.play}
        </button>
      )}
      <button className="lab-button" type="button" onClick={reset}>{copy.reset}</button>
      <span className="lab-progress" role={announceProgress ? 'status' : undefined}>{copy.progress(step, total)}</span>
    </div>
  )
}
