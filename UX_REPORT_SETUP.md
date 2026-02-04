# UX Report Integration Guide

## Overview

The Design Request App can now store and use UX reports from sources like Jurnii, user testing, analytics, etc. These reports are added to the knowledge base so CH can reference them when answering questions and making design recommendations.

## Adding UX Reports

### Method 1: Using the API Endpoint

You can add UX reports via the `/api/ux-report` endpoint:

```bash
POST /api/ux-report
Content-Type: application/json

{
  "manual": true,
  "reportData": {
    "id": "jurnii-001",
    "source": "Jurnii",
    "sourceUrl": "https://app.jurnii.io/user-reports/competitor/2c5eb20f-b28e-404c-a75f-515f22d9c004",
    "title": "UX Report - Site Improvements",
    "date": "2024-01-15",
    "findings": [
      {
        "issue": "Navigation clarity",
        "severity": "high",
        "description": "Users struggle to find key features in the navigation",
        "recommendation": "Improve navigation hierarchy and add clear labels",
        "affectedArea": "Navigation"
      },
      {
        "issue": "Button visibility",
        "severity": "medium",
        "description": "Primary CTAs are not prominent enough",
        "recommendation": "Increase button size and use higher contrast colors",
        "affectedArea": "Casino"
      }
    ],
    "summary": "Overall UX improvements needed for better user engagement",
    "priority": "high"
  }
}
```

### Method 2: Using CH Chat (Coming Soon)

You can ask CH to help extract and add UX report data:

```
"CH, I have a UX report from Jurnii. Can you help me add it to the knowledge base?"
```

Then paste the report findings and CH will help structure it.

### Method 3: Direct Code Addition

Add reports directly to `lib/agent/knowledgeBase.ts`:

```typescript
uxReports: [
  {
    id: 'jurnii-001',
    source: 'Jurnii',
    sourceUrl: 'https://app.jurnii.io/user-reports/competitor/...',
    title: 'UX Report - Site Improvements',
    date: '2024-01-15',
    findings: [
      {
        issue: 'Navigation clarity',
        severity: 'high',
        description: 'Users struggle to find key features',
        recommendation: 'Improve navigation hierarchy',
        affectedArea: 'Navigation'
      }
    ],
    summary: 'Overall UX improvements needed',
    priority: 'high'
  }
]
```

## Report Structure

Each UX report should have:

- **id**: Unique identifier (e.g., "jurnii-001")
- **source**: Where the report came from (e.g., "Jurnii", "User Testing", "Analytics")
- **sourceUrl**: Link to the original report (optional)
- **title**: Report title
- **date**: Date of the report (YYYY-MM-DD format)
- **findings**: Array of findings, each with:
  - **issue**: Brief title of the issue
  - **severity**: "critical", "high", "medium", or "low"
  - **description**: Detailed description of the issue
  - **recommendation**: Suggested solution (optional)
  - **affectedArea**: Which area is affected (optional: "Casino", "Sports", "Navigation", etc.)
- **summary**: Overall summary of the report (optional)
- **priority**: Overall priority: "high", "medium", or "low" (optional)

## How CH Uses UX Reports

Once added to the knowledge base, CH can:

- Reference UX findings when answering design questions
- Suggest improvements based on reported issues
- Recommend solutions from the report
- Prioritize design work based on severity
- Consider affected areas when making recommendations

## Example: Adding Jurnii Report

Since Jurnii reports require authentication, here's how to extract the data:

1. **Log into Jurnii** and view the report
2. **Copy the key findings** from the report
3. **Structure them** using the format above
4. **Add via API** or directly to the code

Example structure for a Jurnii report:

```json
{
  "id": "jurnii-competitor-001",
  "source": "Jurnii",
  "sourceUrl": "https://app.jurnii.io/user-reports/competitor/2c5eb20f-b28e-404c-a75f-515f22d9c004",
  "title": "Competitor UX Analysis - Site Improvements",
  "date": "2024-12-13",
  "findings": [
    {
      "issue": "User flow complexity",
      "severity": "high",
      "description": "Users take too many steps to complete key actions",
      "recommendation": "Simplify user flows and reduce friction points",
      "affectedArea": "All"
    }
  ],
  "summary": "Key UX improvements identified through competitor analysis",
  "priority": "high"
}
```

## API Endpoints

### POST /api/ux-report
Add a new UX report to the knowledge base.

**Request:**
```json
{
  "manual": true,
  "reportData": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "message": "UX report added to knowledge base",
  "reportId": "jurnii-001"
}
```

### GET /api/ux-report
Retrieve all UX reports.

**Response:**
```json
{
  "success": true,
  "reports": [...],
  "count": 5
}
```

## Next Steps

1. Extract data from the Jurnii report manually
2. Structure it using the format above
3. Add it via the API or code
4. CH will automatically have access to it in the knowledge base
5. Ask CH questions like "what UX improvements should we prioritize?" and it will reference the reports
