interface BoutiqueCheckboxProps {
  checked: boolean
  onChange: () => void
  label: string
  count?: number
}

export function BoutiqueCheckbox({ checked, onChange, label, count }: BoutiqueCheckboxProps) {
  return (
    <label
      onClick={onChange}
      className="group flex cursor-pointer items-center gap-3 py-1.5 transition-all duration-300"
    >
      <span
        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center border transition-all duration-300 ${
          checked
            ? 'border-aged-gold bg-aged-gold/10'
            : 'border-white/15 group-hover:border-aged-gold/40'
        }`}
      >
        <span
          className={`h-1 w-1 bg-aged-gold transition-all duration-300 ${
            checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        />
      </span>
      <span
        className={`flex-1 font-body text-xs font-normal uppercase tracking-[0.12em] transition-colors duration-300 sm:text-[11px] sm:tracking-[0.15em] ${
          checked ? 'text-bone' : 'text-bone/60 group-hover:text-bone/80'
        }`}
      >
        {label}
      </span>
      {count != null && (
        <span className="font-body text-[10px] text-champagne/30">{count}</span>
      )}
    </label>
  )
}
