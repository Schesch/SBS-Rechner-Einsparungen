export type TimeSavingUnit = 'per_hour' | 'per_day' | 'per_week';
export type WageMode = 'monthly' | 'hourly';

export interface CalculatorInputs {
  employeeCount: number;
  hoursPerWeekPerEmployee: number;
  timeSavingValueMinutes: number;
  timeSavingUnit: TimeSavingUnit;
  wageMode: WageMode;
  monthlyGross: number;
  hourlyWage: number;
}

export interface CalculatorOutputs {
  totalHoursPerMonthNoAI: number;
  totalCostPerMonthNoAI: number;
  savedHoursPerMonth: number;
  savedCostPerMonth: number;
}

const WEEKS_PER_MONTH = 52 / 12;
const DAYS_PER_WEEK = 5;

export function calculate(inputs: CalculatorInputs): CalculatorOutputs {
  const {
    employeeCount,
    hoursPerWeekPerEmployee,
    timeSavingValueMinutes,
    timeSavingUnit,
    wageMode,
    monthlyGross,
    hourlyWage,
  } = inputs;

  // Baseline: total hours per month without AI
  const totalHoursPerMonthNoAI = employeeCount * hoursPerWeekPerEmployee * WEEKS_PER_MONTH;

  // Total cost per month without AI
  let totalCostPerMonthNoAI: number;
  if (wageMode === 'monthly') {
    totalCostPerMonthNoAI = employeeCount * monthlyGross;
  } else {
    totalCostPerMonthNoAI = totalHoursPerMonthNoAI * hourlyWage;
  }

  // Saved minutes per employee per month
  let savedMinutesPerEmployee: number;
  const savingMinutes = Math.max(0, timeSavingValueMinutes);

  switch (timeSavingUnit) {
    case 'per_hour':
      savedMinutesPerEmployee = savingMinutes * hoursPerWeekPerEmployee * WEEKS_PER_MONTH;
      break;
    case 'per_day':
      savedMinutesPerEmployee = savingMinutes * DAYS_PER_WEEK * WEEKS_PER_MONTH;
      break;
    case 'per_week':
      savedMinutesPerEmployee = savingMinutes * WEEKS_PER_MONTH;
      break;
  }

  const savedMinutesTotal = employeeCount * savedMinutesPerEmployee;
  let savedHoursPerMonth = savedMinutesTotal / 60;

  // Cap: saved hours cannot exceed total hours
  savedHoursPerMonth = Math.min(savedHoursPerMonth, totalHoursPerMonthNoAI);
  savedHoursPerMonth = Math.max(savedHoursPerMonth, 0);

  // Saved cost
  let savedCostPerMonth: number;
  if (totalHoursPerMonthNoAI === 0) {
    savedCostPerMonth = 0;
  } else {
    savedCostPerMonth = totalCostPerMonthNoAI * (savedHoursPerMonth / totalHoursPerMonthNoAI);
  }
  savedCostPerMonth = Math.min(savedCostPerMonth, totalCostPerMonthNoAI);

  return {
    totalHoursPerMonthNoAI,
    totalCostPerMonthNoAI,
    savedHoursPerMonth,
    savedCostPerMonth,
  };
}

export function formatHours(hours: number): string {
  return `${hours.toFixed(1)} h`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function parseNumberOrFallback(input: string, fallback: number): number {
  const parsed = parseFloat(input);
  return Number.isNaN(parsed) ? fallback : parsed;
}
