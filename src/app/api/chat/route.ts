import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const input = message.toLowerCase();
    let reply = "I'm not sure about that. Try asking 'What is Diff?' or 'How does the AI Score work?'";

    if (input.includes('hello') || input.includes('hi')) {
      reply = "Hello! I'm the Sunjay's Book AI. I can explain our math, like AI Scores and Differentials. What's on your mind?";
    } else if (input.includes('diff') || input.includes('differential')) {
      reply = "The 'Diff' (Differential) shows the gap between a player's history and their line. For example, if LeBron's line is 25 but his average is 28, his Diff is +3.0—making the 'Over' a high-value play.";
    } else if (input.includes('ai score') || input.includes('confidence')) {
      reply = "The AI Score (0-100%) is our master value metric. It combines the Market Gap, the L5 Trend, and the Matchup factor. Anything over 85% is a mathematically sharp play.";
    } else if (input.includes('parlay') || input.includes('optimizer')) {
      reply = "Use the Slip Optimizer at the top! It scans thousands of lines to find the 2-6 legs with the highest combined AI Confidence.";
    }

    return NextResponse.json({ reply });
  } catch (_error) {
    return NextResponse.json({ reply: "I'm having a quick sync issue. Try again in a second!" });
  }
}
