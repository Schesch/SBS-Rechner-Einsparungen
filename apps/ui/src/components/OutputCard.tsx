interface OutputCardProps {
  title: string;
  value: string;
  variant?: 'default' | 'highlight';
}

export function OutputCard({ title, value, variant = 'default' }: OutputCardProps) {
  return (
    <div className={`output-card ${variant === 'highlight' ? 'output-card--highlight' : ''}`}>
      <div className="output-card__title">{title}</div>
      <div className="output-card__value">{value}</div>
    </div>
  );
}
