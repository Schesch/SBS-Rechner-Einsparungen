import { useState, useMemo } from 'react';
import {
  calculate,
  formatHours,
  formatCurrency,
  clamp,
  parseNumberOrFallback,
  type TimeSavingUnit,
  type WageMode,
} from './lib/calculator';
import { SliderInput } from './components/SliderInput';
import { OutputCard } from './components/OutputCard';
import logo from '/sbs_business_school.jpg';
import './App.css';

function App() {
  const [employeeCount, setEmployeeCount] = useState(10);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [timeSavingMinutes, setTimeSavingMinutes] = useState(10);
  const [timeSavingUnit, setTimeSavingUnit] = useState<TimeSavingUnit>('per_hour');
  const [wageMode, setWageMode] = useState<WageMode>('monthly');
  const [monthlyGross, setMonthlyGross] = useState(2000);
  const [hourlyWage, setHourlyWage] = useState(20);

  const results = useMemo(
    () =>
      calculate({
        employeeCount,
        hoursPerWeekPerEmployee: hoursPerWeek,
        timeSavingValueMinutes: timeSavingMinutes,
        timeSavingUnit,
        wageMode,
        monthlyGross,
        hourlyWage,
      }),
    [employeeCount, hoursPerWeek, timeSavingMinutes, timeSavingUnit, wageMode, monthlyGross, hourlyWage]
  );

  return (
    <div className="app">
      <header className="header">
        <img src={logo} alt="Südtirol Business School" className="logo" />
        <h1>Berechnung der Einsparungen mit KI</h1>
      </header>

      <main className="main">
        <section className="inputs-section">
          <SliderInput
            label="Anzahl Mitarbeiter"
            value={employeeCount}
            min={1}
            max={500}
            step={1}
            onChange={setEmployeeCount}
            tooltip="Gesamtzahl der Mitarbeiter im Unternehmen"
          />

          <SliderInput
            label="Wochenstunden pro Mitarbeiter"
            value={hoursPerWeek}
            min={20}
            max={40}
            step={1}
            unit="h"
            onChange={setHoursPerWeek}
            tooltip="Arbeitsstunden pro Woche und Mitarbeiter"
          />

          <div className="input-group">
            <div className="input-label">
              <span>Zeitersparnis durch KI</span>
              <span className="tooltip-wrapper">
                <span className="tooltip-icon">i</span>
                <span className="tooltip-text">Zeitersparnis gilt pro Mitarbeiter in der gewählten Einheit</span>
              </span>
            </div>
            <div className="time-saving-row">
              <div className="number-input-wrapper">
                <input
                  type="number"
                  min={0}
                  max={240}
                  step={1}
                  value={timeSavingMinutes}
                  onChange={(e) => {
                    const v = parseNumberOrFallback(e.target.value, timeSavingMinutes);
                    setTimeSavingMinutes(clamp(v, 0, 240));
                  }}
                  onBlur={(e) => {
                    const v = parseNumberOrFallback(e.target.value, timeSavingMinutes);
                    setTimeSavingMinutes(clamp(v, 0, 240));
                  }}
                  className="number-input"
                />
                <span className="input-unit">Min.</span>
              </div>
              <select
                value={timeSavingUnit}
                onChange={(e) => setTimeSavingUnit(e.target.value as TimeSavingUnit)}
                className="select-input"
              >
                <option value="per_hour">pro Stunde</option>
                <option value="per_day">pro Tag</option>
                <option value="per_week">pro Woche</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <div className="input-label">
              <span>Lohnmodus</span>
              <span className="tooltip-wrapper">
                <span className="tooltip-icon">i</span>
                <span className="tooltip-text">
                  Monatsbrutto: festes Gehalt pro Monat. Stundenlohn: Kosten werden aus Arbeitsstunden berechnet.
                </span>
              </span>
            </div>
            <div className="wage-mode-toggle">
              <button
                className={`toggle-btn ${wageMode === 'monthly' ? 'toggle-btn--active' : ''}`}
                onClick={() => setWageMode('monthly')}
              >
                Monatsbrutto
              </button>
              <button
                className={`toggle-btn ${wageMode === 'hourly' ? 'toggle-btn--active' : ''}`}
                onClick={() => setWageMode('hourly')}
              >
                Stundenlohn
              </button>
            </div>
          </div>

          {wageMode === 'monthly' ? (
            <SliderInput
              label="Monatsbruttolohn pro Mitarbeiter"
              value={monthlyGross}
              min={1000}
              max={10000}
              step={100}
              unit="€"
              onChange={setMonthlyGross}
            />
          ) : (
            <SliderInput
              label="Stundenlohn pro Mitarbeiter"
              value={hourlyWage}
              min={10}
              max={200}
              step={1}
              unit="€"
              onChange={setHourlyWage}
            />
          )}
        </section>

        <section className="outputs-section">
          <div className="output-grid">
            <OutputCard
              title="Gesamte Arbeitszeit pro Monat ohne KI"
              value={formatHours(results.totalHoursPerMonthNoAI)}
            />
            <OutputCard
              title="Gesamtkosten pro Monat ohne KI"
              value={formatCurrency(results.totalCostPerMonthNoAI)}
            />
            <OutputCard
              title="Eingesparte Arbeitszeit pro Monat"
              value={formatHours(results.savedHoursPerMonth)}
              variant="highlight"
            />
            <OutputCard
              title="Eingesparte Kosten pro Monat"
              value={formatCurrency(results.savedCostPerMonth)}
              variant="highlight"
            />
          </div>
          <p className="footnote">
            Berechnungsgrundlage: 1 Monat = 4,33 Wochen (52 ÷ 12), 5 Arbeitstage pro Woche
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
