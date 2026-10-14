from typing import Literal
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="WaiverPath readiness API", version="0.1.0")

class Intake(BaseModel):
    amount: float = Field(gt=0)
    monthlyBenefit: float = Field(gt=0)
    daysSinceNotice: int = Field(ge=0)
    monthlyIncome: float = Field(ge=0)
    essentialExpenses: float = Field(ge=0)
    program: Literal["title2", "ssi"]
    fault: Literal["reported", "uncertain", "not_reported"]

@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}

@app.post("/readiness")
def readiness(item: Intake) -> dict:
    rate = 0.1 if item.program == "ssi" else 0.5
    withholding = round(item.monthlyBenefit * rate)
    gap = round(item.essentialExpenses - (item.monthlyIncome - withholding))
    urgency = "ACT NOW" if item.daysSinceNotice >= 25 else "THIS WEEK" if item.daysSinceNotice >= 14 else "PLAN NEXT STEP"
    waiver_note = "document lack of fault and hardship" if item.fault != "not_reported" else "get qualified review of the fault issue"
    return {
        "urgency": urgency,
        "form": "SSA-632-BK",
        "defaultRate": rate,
        "estimatedWithholding": withholding,
        "hardshipGap": gap,
        "routes": [
            {"title": "Request a waiver", "note": waiver_note},
            {"title": "Request a lower recovery rate", "form": "SSA-634"},
            {"title": "Reconsider the amount"},
        ],
        "disclaimer": "Educational prototype only; not legal advice or representation.",
    }
