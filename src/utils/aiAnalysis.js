const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export async function analyzeIssue(title, description) {
  const prompt = `You are an AI assistant for a community issue reporting platform.
Analyze this issue and respond ONLY in JSON format with no extra text:

Title: "${title}"
Description: "${description}"

Respond with exactly this JSON:
{
  "category": "one of: pothole, streetlight, water, waste, road, park",
  "severity": "one of: low, medium, high, critical",
  "severityScore": "number from 1-10",
  "reason": "one sentence explanation",
  "suggestedAction": "one sentence recommended action"
}`;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await res.json();
    const text = data.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    return {
      category: 'road',
      severity: 'medium',
      severityScore: 5,
      reason: 'Could not analyze automatically.',
      suggestedAction: 'Please review manually.'
    };
  }
}