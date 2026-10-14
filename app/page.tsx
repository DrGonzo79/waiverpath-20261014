"use client";

import {useMemo, useState} from "react";
import fixtures from "../data/demo_cases.json";
import {assessReadiness, type Fault, type Intake, type Program, type Readiness} from "../lib/readiness";

const cases = fixtures as (Intake & {id: string; label: string})[];
const money = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", maximumFractionDigits: 0});

export default function Home() {
  const [input, setInput] = useState<Intake>({...cases[0]});
  const [selected, setSelected] = useState(cases[0].id);
  const [result, setResult] = useState<Readiness | null>(null);
  const [status, setStatus] = useState<"idle"|"loading"|"error">("idle");
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState<number[]>([]);
  const [failNext, setFailNext] = useState(false);
  const progress = useMemo(() => result ? Math.round(completed.length / result.checklist.length * 100) : 0, [completed, result]);

  function choose(id: string) {const item = cases.find(c => c.id === id)!; setSelected(id); setInput({...item}); setResult(null); setCompleted([]); setStatus("idle");}
  function update<K extends keyof Intake>(key: K, value: Intake[K]) {setSelected("custom"); setInput(prev => ({...prev, [key]: value})); setResult(null);}
  function run() {
    setStatus("loading"); setMessage(""); setResult(null); setCompleted([]);
    window.setTimeout(() => {
      if (failNext) {setStatus("error"); setMessage("The simulated readiness service did not respond. No information was saved."); setFailNext(false); return;}
      try {setResult(assessReadiness(input)); setStatus("idle");}
      catch (error) {setStatus("error"); setMessage(error instanceof Error ? error.message : "Check the values and try again.");}
    }, 400);
  }
  function toggle(index: number) {setCompleted(items => items.includes(index) ? items.filter(x => x !== index) : [...items, index]);}

  return <main>
    <header><a href="#top" className="brand"><span>W</span>WaiverPath</a><div className="demo">FICTIONAL DEMO · NO DATA SAVED</div><a href="#method">Safety & method</a></header>
    <section className="hero" id="top"><div><p className="eyebrow">OVERPAYMENT READINESS / FAMILY DESK</p><h1>Turn the panic letter<br/>into a next-step plan.</h1></div><p>Estimate withholding pressure, compare three response routes, and leave with an evidence checklist. Educational decision support—not legal representation.</p></section>

    <section className="workspace">
      <aside>
        <p className="section-title">DEMO HOUSEHOLDS</p>
        {cases.map((item, i) => <button className={`case ${selected === item.id ? "active" : ""}`} key={item.id} onClick={() => choose(item.id)} aria-pressed={selected === item.id}><span>0{i+1}</span><b>{item.label}</b><i>→</i></button>)}
        <div className="trust"><b>PRIVACY BY DEFAULT</b><p>This prototype runs locally in your browser. Do not enter names, SSNs, claim numbers, or medical records.</p></div>
      </aside>
      <div className="intake">
        <div className="panel-head"><div><p className="eyebrow">READINESS CHECK</p><h2>What does the notice put at risk?</h2></div><label className="failure"><input type="checkbox" checked={failNext} onChange={e => setFailNext(e.target.checked)}/> Simulate failure</label></div>
        <div className="form-grid">
          <label>Overpayment amount<span>$<input aria-label="Overpayment amount" type="number" min="1" value={input.amount} onChange={e => update("amount", Number(e.target.value))}/></span></label>
          <label>Monthly benefit<span>$<input aria-label="Monthly benefit" type="number" min="1" value={input.monthlyBenefit} onChange={e => update("monthlyBenefit", Number(e.target.value))}/></span></label>
          <label>Days since notice<input aria-label="Days since notice" type="number" min="0" value={input.daysSinceNotice} onChange={e => update("daysSinceNotice", Number(e.target.value))}/></label>
          <label>Program<select aria-label="Program" value={input.program} onChange={e => update("program", e.target.value as Program)}><option value="title2">Retirement / SSDI / survivors</option><option value="ssi">SSI</option></select></label>
          <label>Monthly household income<span>$<input aria-label="Monthly household income" type="number" min="0" value={input.monthlyIncome} onChange={e => update("monthlyIncome", Number(e.target.value))}/></span></label>
          <label>Essential monthly expenses<span>$<input aria-label="Essential monthly expenses" type="number" min="0" value={input.essentialExpenses} onChange={e => update("essentialExpenses", Number(e.target.value))}/></span></label>
          <label className="wide">Was the change reported to SSA?<select aria-label="Reporting history" value={input.fault} onChange={e => update("fault", e.target.value as Fault)}><option value="reported">Yes, and records exist</option><option value="uncertain">Unsure / partial records</option><option value="not_reported">No or not yet</option></select></label>
        </div>
        <button className="primary" onClick={run} disabled={status === "loading"}>{status === "loading" ? "Building the plan…" : "Build my readiness plan"}</button>
        {status === "error" && <div className="error" role="alert"><b>PLAN NOT CREATED</b><p>{message}</p><button onClick={run}>Try again</button></div>}
      </div>
    </section>

    {!result && status !== "error" && <section className={`empty ${status === "loading" ? "loading" : ""}`} aria-live="polite"><span>{status === "loading" ? "•••" : "↳"}</span><div><h2>{status === "loading" ? "Checking timing and cash pressure" : "Your plan will appear here"}</h2><p>{status === "loading" ? "Applying transparent rules to the fictional inputs." : "Choose a demo household or adjust the numbers. No result is a guarantee of eligibility or outcome."}</p></div></section>}

    {result && <section className="results" data-testid="results" aria-live="polite">
      <div className="result-top"><div><p className="eyebrow">TIMING SIGNAL</p><h2>{result.urgency}</h2><p>Confirm the exact deadline printed on the notice. This demo does not calculate legal deadlines.</p></div><div className="impact"><span>EST. DEFAULT MONTHLY WITHHOLDING</span><strong>{money.format(result.estimatedWithholding)}</strong><small>{Math.round(result.defaultRate*100)}% demo policy assumption</small></div><div className={`gap ${result.hardshipGap > 0 ? "danger" : ""}`}><span>ESSENTIAL-EXPENSE GAP</span><strong>{result.hardshipGap > 0 ? "+" : ""}{money.format(result.hardshipGap)}</strong><small>{result.hardshipGap > 0 ? "Potential hardship signal" : "No modeled monthly shortfall"}</small></div></div>
      <div className="routes"><p className="section-title">THREE ROUTES TO REVIEW</p>{result.routes.map((route, i) => <article key={route.title}><span>0{i+1}</span><div><b>{route.title}</b><p>{route.detail}</p></div><em>{route.fit}</em></article>)}</div>
      <div className="checklist"><div><p className="section-title">EVIDENCE PACK</p><h3>Build the record before the call.</h3><p>Tap items as you gather them. Progress is demo-only and resets on refresh.</p><div className="bar"><i style={{width: `${progress}%`}}/></div><b>{progress}% ready</b></div><ul>{result.checklist.map((item, i) => <li key={item}><label><input type="checkbox" checked={completed.includes(i)} onChange={() => toggle(i)}/><span>{item}</span></label></li>)}</ul></div>
      <p className="disclaimer">{result.disclaimer}</p>
    </section>}
    <section className="method" id="method"><p className="eyebrow">METHOD / SAFETY BOUNDARY</p><h2>A triage aid, deliberately short of representation.</h2><div><p>The rules engine uses notice age, program type, modeled withholding, reported-change history, and household cash flow. It does not diagnose eligibility, submit forms, contact SSA, or interpret state unauthorized-practice rules.</p><p>Production requires current policy review, jurisdictional counsel, secure document handling, explicit consent, audit logs, human escalation, and accredited-representative boundaries.</p></div></section>
    <footer><span>WAIVERPATH / CONCEPT PROTOTYPE</span><span>Source idea: IdeaBrowser · Oct 14, 2026</span></footer>
  </main>;
}
