import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { QUIZ_QUESTIONS, type AdvisorAnswers } from '../../lib/fragranceAdvisor'

interface FragranceQuizProps {
  onComplete: (answers: AdvisorAnswers) => void
}

export function FragranceQuiz({ onComplete }: FragranceQuizProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<AdvisorAnswers>({})

  const question = QUIZ_QUESTIONS[step]
  const progress = ((step + 1) / QUIZ_QUESTIONS.length) * 100
  const selected = answers[question.id]

  function select(optionId: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }))
  }

  function next() {
    if (!selected) return
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep((s) => s + 1)
    } else {
      onComplete({ ...answers, [question.id]: selected })
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1)
  }

  return (
    <div className="border border-white/[0.06] bg-graphite/40 p-6 sm:p-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-body text-[10px] uppercase tracking-[0.35em] text-aged-gold">
            Paso {step + 1} de {QUIZ_QUESTIONS.length}
          </p>
          <p className="font-body text-[10px] text-bone/40">{Math.round(progress)}%</p>
        </div>
        <div className="h-px w-full bg-white/10">
          <div
            className="h-full bg-aged-gold/70 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h3 className="font-display text-2xl text-bone sm:text-3xl">{question.title}</h3>
      <p className="mt-2 font-body text-sm text-bone/60">{question.subtitle}</p>

      <div className="mt-8 space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => select(option.id)}
            className={`w-full border px-5 py-4 text-left transition-all duration-300 ${
              selected === option.id
                ? 'border-aged-gold/50 bg-aged-gold/5'
                : 'border-white/[0.06] bg-carbon/40 hover:border-aged-gold/25 hover:bg-carbon/60'
            }`}
          >
            <span className="font-body text-sm uppercase tracking-[0.15em] text-bone">
              {option.label}
            </span>
            {option.description && (
              <p className="mt-1 font-body text-xs leading-relaxed text-bone/50">
                {option.description}
              </p>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="flex items-center gap-1.5 font-body text-xs uppercase tracking-[0.2em] text-bone/50 transition-colors hover:text-bone disabled:opacity-30"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Atrás
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!selected}
          className="boutique-cta-solid flex items-center gap-2 disabled:opacity-40"
        >
          {step < QUIZ_QUESTIONS.length - 1 ? 'Siguiente' : 'Ver mi perfil'}
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
