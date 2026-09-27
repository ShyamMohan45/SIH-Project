# N-LAMS: National Land Acquisition & Management System

> **SIH Problem Statement ID**: 26016  
> **Department**: Department of Land Resources (DoLR), Ministry of Rural Development  
> **Theme**: Smart Automation & Digital Governance  

N-LAMS is a unified national platform designed to digitize the complete land acquisition lifecycle under the **RFCTLARR Act (2013/2015)**. It integrates PARIVESH-style single-window proposal tracking, LAMSAPP-style cadastral GIS visualization and owner family tree mapping, and PS17 AI predictive delay analytics with Explainable AI (XAI).

---

## 🚀 Key Features

1. **PARIVESH Single-Window 11-Stage Workflow**:
   - Proposal Submission $\rightarrow$ Digital Scrutiny $\rightarrow$ Ministry Approval $\rightarrow$ GIS Survey $\rightarrow$ Gazette 3A/3D Notification $\rightarrow$ Hearing Objections $\rightarrow$ Award Declaration $\rightarrow$ Compensation Disbursement $\rightarrow$ R&R Progress $\rightarrow$ Physical Possession $\rightarrow$ Closure.

2. **LAMSAPP Cadastral GIS & Land Records**:
   - Interactive Leaflet map canvas with color-coded parcel status polygons.
   - Owner family tree visualizer and legal heir entitlement ledger.
   - RFCTLARR statutory land valuation calculator (multiplier factor + solatium).

3. **PS17 AI Predictive Intelligence & XAI**:
   - Machine Learning delay risk score gauge ($82\%$ High Risk).
   - SHAP-inspired feature contribution breakdown (Litigation, Backlog, Scrutiny delays).
   - Actionable escalation recommendations for Central/State decision makers.

4. **Multi-Tenant Role-Based Access Control (RBAC)**:
   - Central Admin (All India), State Admin (Gujarat), District Admin (Rajkot), Field Surveyor.

---

## 💻 Running the Application

### 1. Launch Frontend (React + Vite on Port 3008)
```bash
cd frontend
npm run dev
```
Open [http://localhost:3008](http://localhost:3008) in your browser.

### 2. Launch Backend (Python FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
API Documentation available at [http://localhost:8000/docs](http://localhost:8000/docs).
