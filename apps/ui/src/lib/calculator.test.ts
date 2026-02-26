import { describe, it, expect } from 'vitest';
import { calculate, clamp, parseNumberOrFallback, formatHours, formatCurrency } from './calculator';

const WEEKS_PER_MONTH = 52 / 12;

describe('calculate', () => {
  it('computes defaults correctly', () => {
    const result = calculate({
      employeeCount: 10,
      hoursPerWeekPerEmployee: 40,
      timeSavingValueMinutes: 10,
      timeSavingUnit: 'per_hour',
      wageMode: 'monthly',
      monthlyGross: 2000,
      hourlyWage: 20,
    });

    const expectedTotalHours = 10 * 40 * WEEKS_PER_MONTH;
    expect(result.totalHoursPerMonthNoAI).toBeCloseTo(expectedTotalHours);
    expect(result.totalCostPerMonthNoAI).toBe(20000);

    // 10min/hour * 40h/week * 4.333 weeks * 10 employees / 60
    const savedMinutes = 10 * 40 * WEEKS_PER_MONTH * 10;
    const savedHours = savedMinutes / 60;
    expect(result.savedHoursPerMonth).toBeCloseTo(savedHours);
  });

  it('handles per_day unit', () => {
    const result = calculate({
      employeeCount: 1,
      hoursPerWeekPerEmployee: 40,
      timeSavingValueMinutes: 30,
      timeSavingUnit: 'per_day',
      wageMode: 'monthly',
      monthlyGross: 3000,
      hourlyWage: 20,
    });

    // 30min/day * 5 days/week * 4.333 weeks / 60
    const savedHours = (30 * 5 * WEEKS_PER_MONTH) / 60;
    expect(result.savedHoursPerMonth).toBeCloseTo(savedHours);
  });

  it('handles per_week unit', () => {
    const result = calculate({
      employeeCount: 5,
      hoursPerWeekPerEmployee: 40,
      timeSavingValueMinutes: 60,
      timeSavingUnit: 'per_week',
      wageMode: 'monthly',
      monthlyGross: 2000,
      hourlyWage: 20,
    });

    // 60min/week * 4.333 weeks * 5 employees / 60
    const savedHours = (60 * WEEKS_PER_MONTH * 5) / 60;
    expect(result.savedHoursPerMonth).toBeCloseTo(savedHours);
  });

  it('caps saved hours at total hours', () => {
    const result = calculate({
      employeeCount: 1,
      hoursPerWeekPerEmployee: 20,
      timeSavingValueMinutes: 120,
      timeSavingUnit: 'per_hour',
      wageMode: 'monthly',
      monthlyGross: 2000,
      hourlyWage: 20,
    });

    const totalHours = 1 * 20 * WEEKS_PER_MONTH;
    expect(result.savedHoursPerMonth).toBeCloseTo(totalHours);
  });

  it('handles zero saving', () => {
    const result = calculate({
      employeeCount: 10,
      hoursPerWeekPerEmployee: 40,
      timeSavingValueMinutes: 0,
      timeSavingUnit: 'per_hour',
      wageMode: 'monthly',
      monthlyGross: 2000,
      hourlyWage: 20,
    });

    expect(result.savedHoursPerMonth).toBe(0);
    expect(result.savedCostPerMonth).toBe(0);
  });

  it('uses hourly wage mode correctly', () => {
    const result = calculate({
      employeeCount: 5,
      hoursPerWeekPerEmployee: 40,
      timeSavingValueMinutes: 10,
      timeSavingUnit: 'per_hour',
      wageMode: 'hourly',
      monthlyGross: 2000,
      hourlyWage: 25,
    });

    const totalHours = 5 * 40 * WEEKS_PER_MONTH;
    expect(result.totalCostPerMonthNoAI).toBeCloseTo(totalHours * 25);
  });

  it('cost savings proportional to time savings', () => {
    const result = calculate({
      employeeCount: 10,
      hoursPerWeekPerEmployee: 40,
      timeSavingValueMinutes: 10,
      timeSavingUnit: 'per_hour',
      wageMode: 'monthly',
      monthlyGross: 3000,
      hourlyWage: 20,
    });

    const ratio = result.savedHoursPerMonth / result.totalHoursPerMonthNoAI;
    expect(result.savedCostPerMonth).toBeCloseTo(result.totalCostPerMonthNoAI * ratio);
  });
});

describe('clamp', () => {
  it('clamps below min', () => expect(clamp(-5, 0, 100)).toBe(0));
  it('clamps above max', () => expect(clamp(200, 0, 100)).toBe(100));
  it('keeps value in range', () => expect(clamp(50, 0, 100)).toBe(50));
});

describe('parseNumberOrFallback', () => {
  it('parses valid number', () => expect(parseNumberOrFallback('42', 0)).toBe(42));
  it('returns fallback for NaN', () => expect(parseNumberOrFallback('abc', 10)).toBe(10));
  it('returns fallback for empty', () => expect(parseNumberOrFallback('', 5)).toBe(5));
});

describe('formatHours', () => {
  it('formats with one decimal', () => expect(formatHours(123.456)).toBe('123.5 h'));
  it('formats zero', () => expect(formatHours(0)).toBe('0.0 h'));
});

describe('formatCurrency', () => {
  it('formats in EUR de-DE', () => {
    const result = formatCurrency(12345.67);
    expect(result).toContain('12.345,67');
    expect(result).toContain('€');
  });
});
