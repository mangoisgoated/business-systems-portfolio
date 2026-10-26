# Business Systems Portfolio

Case studies by Marco Martinez: business operations, systems analysis, and workflow automation.

| Case study | Focus | Status |
|---|---|---|
| [1. Sales Follow-Up CRM](case-studies/01-insurance-follow-up-crm.md) | Workflow design and automation | In daily use; presented to agency leadership |
| [2. Commission Analysis and Tracker](case-studies/02-commission-analysis.md) | Compensation analysis and policy impact | Findings presented to leadership |
| [3. CoreOps CRM](case-studies/03-coreops-crm.md) | Lead generation and automation architecture | In production |
| [4. Fitness RPG: Design Prototype](case-studies/04-fitness-rpg.md) | Requirements to data model | Design Prototype |

## How to read these

Every case study has the same shape: executive summary, business problem, requirements, solution and diagram, verified capabilities, my role, results, lessons.

Status labels are literal. "Verified" means I checked it against the real system. "Designed" means it exists on paper only.

## Confidentiality

Two projects relate to an insurance agency. They appear as high-level case studies with fictional data and original charts. This repository contains no employer source code, customer data, compensation figures, or internal documents. The CoreOps source repository is private.

Contact: [marcozuniga123@gmail.com](mailto:marcozuniga123@gmail.com) | [GitHub](https://github.com/mangoisgoated)

## Regenerating the visuals

All diagrams are produced from `tools/build-assets.mjs` with fictional or self-owned numbers.

```bash
node tools/build-assets.mjs
```
