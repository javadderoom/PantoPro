import { CategoryId, Difficulty, Word } from "../types";
import { staticWordsData } from "../staticWords";

// Declare Puter global type (injected via script tag in index.html)
declare const puter: any;

// Type casting the imported data to ensure it matches the Word structure
const STATIC_WORDS = staticWordsData as unknown as Word[];

export const generateWord = async (
  category: CategoryId,
  difficulty: Difficulty,
  isAdult: boolean = false,
  excludeWords: string[] = []
): Promise<Word> => {
  
  // Check if Puter is loaded
  if (typeof puter === 'undefined') {
    console.warn("Puter.js not loaded, falling back to static data.");
    return getRandomStaticWord(category, difficulty, isAdult, excludeWords);
  }

  try {
    // We only pass the last 50 words to avoid context limit issues
    const forbiddenList = excludeWords.slice(-50).join(', ');

    // Since Puter.ai.chat doesn't support strict 'responseSchema' objects like the GenAI SDK,
    // we must be very explicit in the prompt to get pure JSON.
    const systemInstruction = `Act as a Pantomime Game Generator for a Persian Party Game.
Task: Generate a single Persian (Farsi) word or phrase.
Category: ${category}
Difficulty: ${difficulty === 10 ? 'Proverb' : (difficulty === 3 ? 'Hard' : 'Easy')}
Mode: ${isAdult ? 'ADULT ONLY (+18)' : 'Family Friendly'}

${isAdult ? `
CRITICAL INSTRUCTION FOR ADULT MODE:
1. Tone & Style:
The phrases MUST be "spicy", "cheeky", and "suggestive". Use double-entendre and nightlife-related slang.
Focus on "Funny-Awkward" rather than just "Dirty". It should be embarrassing but hilarious to act out in a Persian party.
2. Structure (The 3-Word Rule):
CRITICAL: Each phrase MUST be between 2 to 4 words maximum  except for proverbs.
Use the "Verb + Taboo Object/Context" formula for high visual playability.
Avoid long sentences. If it's too long, simplify it (e.g., instead of "Getting caught by parents while dating", use "لو رفتن وسط قرار").
3. Iranian Cultural Context:
Focus on Iranian Taboos: (e.g., Khastegary awkwardness, "Shab-e-Jomeh" jokes, "Ghasht-e-Ershad" encounters, "Mehmooni" secrets).
Use local slang that implies something "naughty" without being purely clinical or offensive.
4. The 'Taboo' Twist:
Every phrase should have a "twist".
Boring: "Dating" -> Spicy: "لاس زدن با رفیقِ اکس"
Boring: "Drinking" -> Spicy: "مستی و سکس‌چت اشتباهی"` : `
INSTRUCTION FOR FAMILY MODE:
- The word must be safe for children and families.
- Culturally relevant to Iran.
`}

Constraints:
1. Language: Persian (Farsi) only.
2. Do NOT use these words: [${forbiddenList}].
Required JSON Format:
  { "text": "YOUR_WORD_HERE" }
       `;

    // Call Puter AI
    const response = await puter.ai.chat(systemInstruction,
      { model: 'gemini-3-flash-preview'}
    );
    
    // Parse Response
    // Puter might return a string or an object with message content depending on the version/model
    let content = typeof response === 'string' ? response : response?.message?.content || "";
    
    // Clean up potential Markdown code blocks if the AI ignores instructions
    content = content.replace(/```json/g, '').replace(/```/g, '').trim();

    const json = JSON.parse(content);

    if (json.text) {
      // Basic client-side check just in case AI ignores instruction
      if (excludeWords.includes(json.text)) {
          console.warn("AI returned a duplicate word, retrying static fallback");
          return getRandomStaticWord(category, difficulty, isAdult, excludeWords);
      }

      return {
        text: json.text,
        category,
        difficulty,
        isAdult
      };
    }
    throw new Error("Invalid AI response structure");
  } catch (error) {
    console.error("AI Generation failed, falling back to static data", error);
    return getRandomStaticWord(category, difficulty, isAdult, excludeWords);
  }
};

const getRandomStaticWord = (
    category: CategoryId, 
    difficulty: Difficulty, 
    isAdult: boolean, 
    excludeWords: string[] = []
): Word => {
  let candidates = STATIC_WORDS.filter(
    w => w.category === category && w.difficulty === difficulty && !!w.isAdult === isAdult
  );

  // Filter out used words
  const availableCandidates = candidates.filter(w => !excludeWords.includes(w.text));

  // If we have unused words, use them. 
  // If we ran out of unique static words, fallback to the full list (duplicates allowed vs crashing).
  if (availableCandidates.length > 0) {
      candidates = availableCandidates;
  }

  if (candidates.length === 0) {
    // Fallback: try to find any word in category to avoid empty return, ignoring adult flag if strict match fails
    const backupCandidates = STATIC_WORDS.filter(w => w.category === category && w.difficulty === difficulty);
     if (backupCandidates.length === 0) {
        return { text: "داده‌ای موجود نیست", category, difficulty, isAdult };
     }
     return backupCandidates[Math.floor(Math.random() * backupCandidates.length)];
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
};