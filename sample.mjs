export const sample = {
  "now": 50,
  "events": [
    {
      "at": 10,
      "action": "grant",
      "subject": "student-1",
      "scope": "study",
      "expires": 100
    },
    {
      "at": 40,
      "action": "revoke",
      "subject": "student-2",
      "scope": "study"
    }
  ],
  "requests": [
    {
      "subject": "student-1",
      "scope": "study"
    },
    {
      "subject": "student-2",
      "scope": "study"
    }
  ]
};
