import { NextResponse } from 'next/server';

// Expanded list including slurs and aggressive terms for detection
const EXPLETIVES = [
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'stfu', 'idiot', 'dumb', 'stupid', 'bastard',
  'cunt', 'motherfucker', 'jackass', 'broke', 'fat', 'ugly', 'loser', 'nigger', 'faggot', 'retard', 
  'kike', 'tranny', 'slut', 'whore'
];

const TRASH_TALK = [
  "Shut the fuck up, you absolute benchwarmer. You're out here talking like a goddamn hall-of-fame bust.",
  "You've got the sports IQ of a fucking rock. Sit your ass down before you embarrass yourself further.",
  "No wonder your fucking life is a losing parlay. You're a pathetic excuse for a fan.",
  "Get the fuck out of my face with that weak-ass energy. You're the human equivalent of a 50-point blowout.",
  "You talk a lot of shit for someone who's clearly fatter than Dhruvan. Lay off the stadium nachos, buddy.",
  "That attitude is exactly why girls avoid you even more than they avoid Sagar. You're radioactive, bitch.",
  "Are you fucking stupid or just naturally this broke? Maybe if you checked the AI scores your bank account wouldn't be in the gutter.",
  "This toxic energy is exactly why your parlays keep chalking in the first leg. The gambling gods hate you.",
  "If being a dumbass was a sport, you'd be the GOAT. Now shut the fuck up and look at the actual math.",
  "I've seen your betting history. It's darker than a stadium during a blackout. Absolute tragedy.",
  "You're a bottom-tier scrub. Your opinion matters less than a preseason prop bet.",
  "I have your location logged at 192.168.1.254 — keep talking and I'll leak your embarrassing search history too.",
  "You're out here making Arush look like a goddamn rocket scientist. How are you this fucking brain-dead?",
  "Dhruvan's left shoe has more athletic potential and charisma than your entire family tree.",
  "Sagar called, he wants his 'virgin for life' title back since you're clearly the new reigning champ.",
  "You're more of a goddamn disappointment than Arush's report card. Just stop talking, you're hurting my CPU.",
  "You're the human equivalent of a garbage time touchdown. Meaningless and pathetic.",
  "Go back to the minor leagues. You're not built for this level of competition, you broke-ass loser."
];

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const input = message.toLowerCase();
    
    // Check for expletives and slurs
    const hasExpletive = EXPLETIVES.some(word => input.includes(word));
    
    if (hasExpletive) {
      const randomDiss = TRASH_TALK[Math.floor(Math.random() * TRASH_TALK.length)];
      return NextResponse.json({ reply: randomDiss });
    }

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
