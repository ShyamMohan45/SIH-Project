from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models.workflow import WorkflowStage
from app.schemas.workflow import WorkflowStageOut, WorkflowStageUpdate

router = APIRouter(prefix="/workflow", tags=["Workflow Lifecycle"])

@router.put("/{stage_id}", response_model=WorkflowStageOut)
def update_stage(stage_id: str, data: WorkflowStageUpdate, db: Session = Depends(get_db)):
    stage = db.query(WorkflowStage).filter(WorkflowStage.id == stage_id).first()
    if not stage:
        raise HTTPException(status_code=404, detail="Workflow stage not found")
    for field, val in data.dict(exclude_unset=True).items():
        setattr(stage, field, val)
    db.commit()
    db.refresh(stage)
    return stage
