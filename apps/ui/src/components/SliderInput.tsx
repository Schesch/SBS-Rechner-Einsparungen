import { clamp, parseNumberOrFallback } from '../lib/calculator';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  tooltip?: string;
  onChange: (value: number) => void;
}

export function SliderInput({ label, value, min, max, step, unit, tooltip, onChange }: SliderInputProps) {
  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(clamp(Number(e.target.value), min, max));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '' || raw === '-') return;
    const parsed = parseNumberOrFallback(raw, value);
    onChange(clamp(parsed, min, max));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const parsed = parseNumberOrFallback(e.target.value, value);
    onChange(clamp(parsed, min, max));
  };

  return (
    <div className="input-group">
      <div className="input-label">
        <span>{label}</span>
        {tooltip && (
          <span className="tooltip-wrapper">
            <span className="tooltip-icon">i</span>
            <span className="tooltip-text">{tooltip}</span>
          </span>
        )}
      </div>
      <div className="slider-row">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSlider}
          className="slider"
        />
        <div className="number-input-wrapper">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInput}
            onBlur={handleBlur}
            className="number-input"
          />
          {unit && <span className="input-unit">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
