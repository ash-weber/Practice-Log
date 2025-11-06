# Examples — Login and Protected Requests

This file contains curl and PowerShell examples to test the auth flow and protected endpoints.

1) Exchange Google ID token (credential) for a server JWT

Replace <GOOGLE_ID_TOKEN> with the ID token you get from the Google One Tap / Google OAuth client.

bash / curl:

```bash
curl -X POST http://localhost:8000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"credential":"<GOOGLE_ID_TOKEN>"}'
```

PowerShell:

```powershell
$body = @{ credential = '<GOOGLE_ID_TOKEN>' } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:8000/api/auth/google -Method Post -Body $body -ContentType 'application/json'
```

Response (example):

```json
{
  "token": "<SERVER_JWT>",
  "user": { "email": "user@example.com", "name": "User Name" }
}
```

2) Call protected GET /api/entries using returned token

curl:

```bash
curl -H "Authorization: Bearer <SERVER_JWT>" http://localhost:8000/api/entries
```

PowerShell:

```powershell
Invoke-RestMethod -Uri http://localhost:8000/api/entries -Headers @{ Authorization = "Bearer <SERVER_JWT>" }
```

3) Create a protected entry (POST /api/entries)

Example payload (replace with real values):

```json
{
  "userEmail": "user@example.com",
  "skills": ["React", "NodeJS"],
  "hoursSpent": "4",
  "startDate": "2025-11-05",
  "endDate": "2025-11-05",
  "practiceType": ["Hands-on Practice"],
  "verifierName": null,
  "resultsAchieved": ["Improved Productivity"],
  "notes": "Worked on a sample project"
}
```

curl:

```bash
curl -X POST http://localhost:8000/api/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <SERVER_JWT>" \
  -d '@entry.json'
```

Notes:
- The Google ID token (credential) should be obtained client-side from the Google sign-in flow.
- For stronger security, configure `GOOGLE_CLIENT_ID` in the server `.env` and the server will validate the audience on the ID token.
