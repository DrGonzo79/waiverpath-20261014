export type Program = "title2" | "ssi";
export type Fault = "reported" | "uncertain" | "not_reported";
export type Intake = {amount: number; monthlyBenefit: number; daysSinceNotice: number; monthlyIncome: number; essentialExpenses: number; program: Program; fault: Fault};
export type Readiness = {urgency: "ACT NOW" | "THIS WEEK" | "PLAN NEXT STEP"; form: string; defaultRate: number; estimatedWithholding: number; hardshipGap: number; routes: {title: string; detail: string; fit: "primary" | "secondary"}[]; checklist: string[]; disclaimer: string};
export function assessReadiness(input: Intake): Readiness {
  if (![input.amount,input.monthlyBenefit,input.daysSinceNotice,input.monthlyIncome,input.essentialExpenses].every(Number.isFinite)) throw new Error("All numeric fields must be valid numbers.");
  if (input.amount <= 0 || input.monthlyBenefit <= 0 || input.monthlyIncome < 0 || input.essentialExpenses < 0 || input.daysSinceNotice < 0) throw new Error("Amounts and timing must be non-negative; debt and benefit must be above zero.");
  const defaultRate = input.program === "ssi" ? 0.1 : 0.5;
  const estimatedWithholding = Math.round(input.monthlyBenefit * defaultRate);
  const hardshipGap = Math.round(input.essentialExpenses - (input.monthlyIncome - estimatedWithholding));
  const urgency = input.daysSinceNotice >= 25 ? "ACT NOW" : input.daysSinceNotice >= 14 ? "THIS WEEK" : "PLAN NEXT STEP";
  const waiverFit = input.fault !== "not_reported";
  return {
    urgency, form: "SSA-632-BK", defaultRate, estimatedWithholding, hardshipGap,
    routes: [
      {title: "Request a waiver", detail: waiverFit ? "Your answers suggest documenting lack of fault and financial hardship may be worth reviewing." : "Your answers show a fault issue that needs qualified review before relying on a waiver.", fit: "primary"},
      {title: "Request a lower recovery rate", detail: "Ask SSA about Form SSA-634 if the default deduction would prevent essential expenses.", fit: hardshipGap > 0 ? "primary" : "secondary"},
      {title: "Reconsider the amount", detail: "Use reconsideration when the debt amount or the fact of overpayment appears wrong.", fit: "secondary"}
    ],
    checklist: ["Save every page of the notice and envelope", "Write down the notice date and response deadline", "Collect benefit, income, bank, housing, utility, food, and medical records", "Create a dated log of every SSA call and upload", "Confirm the current official form and process with SSA or a qualified representative"],
    disclaimer: "Educational prototype only. Not legal advice, representation, or an SSA filing service. Rules and deadlines vary; verify with SSA or a qualified advocate."
  };
}
