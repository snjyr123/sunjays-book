import { NextResponse } from 'next/server';

const KNOWLEDGE_BASE = `
Welcome to Sunjay's Book! I am your AI DFS Assistant.

KEY TERMS EXPLAINED:
1. DIFF (Differential): This is the "gap" between a player's recent performance average and their current line. A high positive diff means the player is trending significantly above their line (Strong Over).
2. AI SCORE: A weighted 0-100% confidence rating. It calculates Value by looking at Market Gaps (PrizePicks vs Underdog), Historical Trends, and Matchup Difficulty. 90%+ is a "Strong Buy."
3. MARKET ODDS: These are the implied betting odds (+100, -120, etc.) calculated by comparing our DFS lines to the sharpest sportsbooks in the world.
4. SLIP OPTIMIZER: Our tool at the top that builds the best 2-6 leg parlays using the math above.

Ask me about any of these terms or how to find today's best edges!
`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const input = message.toLowerCase();
    let reply = "I'm not sure about that. Try asking 'What is Diff?' or 'How does the AI Score work?'";

    if (input.includes('hello') || input.includes('hi')) {
      reply = "Hello! I'm the Sunjay's Book AI. I can explain our math, like AI Scores, Differentials, and Market Odds. What's on your mind?";
    } else if (input.includes('diff') || input.includes('differential')) {
      reply = "The 'Diff' (Differential) shows the gap between a player's history and their line. For example, if LeBron's line is 25 but his average is 28, his Diff is +3.0—making the 'Over' a high-value play.";
    } else if (input.includes('ai score') || input.includes('confidence')) {
      reply = "The AI Score (0-100%) is our master value metric. It combines the Market Gap, the L5 Trend, and the Matchup factor. Anything over 85% is a mathematically sharp play.";
    } else if (input.includes('odds') || input.includes('market')) {
      reply = "Market Odds (+100, -110, etc.) show you the 'true' price of a prop. We calculate this by looking at discrepancies between PrizePicks, Underdog, and sharp global sportsbooks.";
    } else if (input.includes('parlay') || input.includes('optimizer')) {
      reply = "Use the Slip Optimizer at the top! It scans thousands of lines to find the 2-6 legs with the highest combined AI Confidence.";
    }

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ reply: "I'm having a quick sync issue. Try again in a second!" });
  }
}
