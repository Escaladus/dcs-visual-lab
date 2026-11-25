import { useId, useState } from 'react'

const controls = {
  en: { back: 'Back one step', next: 'Next step', reset: 'Reset', progress: (step, total) => `${step} of ${total} steps` },
  fi: { back: 'Edellinen askel', next: 'Seuraava askel', reset: 'Aloita alusta', progress: (step, total) => `${step}/${total} askelta` },
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
  return (
    <label className="lab-select">
      <span>{label}</span>
      <select value={value} onChange={event => onChange(event.target.value)}>
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
  const copy = controls[language]
  return (
    <div className="lab-controls">
      <button className="lab-button" type="button" disabled={step === 0} onClick={() => setStep(current => Math.max(0, current - 1))}>
        {copy.back}
      </button>
      <button className="lab-button lab-primary" type="button" disabled={step === total} onClick={() => setStep(current => Math.min(total, current + 1))}>
        {copy.next}
      </button>
      <button className="lab-button" type="button" onClick={reset}>{copy.reset}</button>
      <span className="lab-progress" role="status">{copy.progress(step, total)}</span>
    </div>
  )
}
