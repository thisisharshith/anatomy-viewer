import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// Define medical professions that warrant more technical questions
const MEDICAL_PROFESSIONS = [
  'doctor', 'nurse', 'medical student', 'physiotherapist',
  'paramedic', 'pharmacist', 'dentist', 'veterinarian',
  'medical researcher', 'biology teacher', 'healthcare'
];

export async function generateQuestion(age, profession = '') {
  try {
    // Age group determination
    let ageGroup;
    if (age <= 12) {
      ageGroup = 'children';
    } else if (age <= 18) {
      ageGroup = 'teenagers';
    } else if (age <= 60) {
      ageGroup = 'adults';
    } else {
      ageGroup = 'seniors';
    }

    // Determine medical background
    const hasMedicalBackground = MEDICAL_PROFESSIONS.some(p => 
      profession.toLowerCase().includes(p.toLowerCase())
    );

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an anatomy quiz generator adapting content for:
                   - Age Group: ${ageGroup} (age ${age})
                   - Professional Background: ${profession || 'Not specified'}
                   ${hasMedicalBackground ? 
                     'Use proper medical terminology and advanced concepts as the user has medical background.' :
                     'Use common terminology and basic concepts appropriate for general audience.'}
                   
                   Generate a question about human anatomy visible in a 3D model.
                   Return ONLY a JSON object in this format:
                   {
                     "question": "question text appropriate for background",
                     "hint": "helpful hint matching their expertise level",
                     "correctAnswer": "1-2 word answer (use medical terms if appropriate)",
                     "difficulty": "easy/medium/hard",
                     "funFact": "interesting anatomical fact matching their knowledge level",
                     "technicalNote": "optional medical details for professionals"
                   }`
        },
        {
          role: "user",
          content: `Generate one anatomy quiz question for a ${age}-year-old ${profession || 'person'}.`
        }
      ],
      model: "llama-3.2-11b-text-preview",
      temperature: 0.6,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0]?.message?.content);
  } catch (error) {
    console.error('Error generating question:', error);
    // Fallback questions based on medical background
    return hasMedicalBackground ? {
      question: "Which cranial nerve is responsible for taste sensation in the anterior two-thirds of the tongue?",
      hint: "This nerve is part of the facial nerve complex",
      correctAnswer: "facial nerve",
      difficulty: "hard",
      funFact: "The facial nerve (CN VII) carries both sensory and motor fibers",
      technicalNote: "Also known as Cranial Nerve VII (CN VII)"
    } : {
      question: "What organ pumps blood through your body?",
      hint: "You can feel it beating in your chest!",
      correctAnswer: "heart",
      difficulty: "easy",
      funFact: "Your heart beats about 100,000 times every day!",
      technicalNote: null
    };
  }
}

export async function checkAnswer(userAnswer, correctAnswer, age) {
  try {
    let ageGroup;
    if (age <= 12) {
      ageGroup = 'children';
    } else if (age <= 18) {
      ageGroup = 'teenagers';
    } else if (age <= 60) {
      ageGroup = 'adults';
    } else {
      ageGroup = 'seniors';
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an anatomy quiz evaluator for ${ageGroup} (age ${age}).
                   Compare answers considering:
                   - Age-appropriate expectations
                   - Common alternative terms
                   - Minor spelling mistakes
                   - Partial understanding
                   Return ONLY a JSON object in this format:
                   {
                     "isCorrect": boolean,
                     "explanation": "why right/wrong",
                     "educationalNote": "relevant fact",
                     "encouragement": "motivational message"
                   }`
        },
        {
          role: "user",
          content: `Compare these answers:
                   Correct: "${correctAnswer}"
                   User's: "${userAnswer}"`
        }
      ],
      model: "llama-3.2-11b-text-preview",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0]?.message?.content);
  } catch (error) {
    console.error('Error checking answer:', error);
    const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    return {
      isCorrect,
      explanation: isCorrect ? 
        `Correct! "${correctAnswer}" is the right answer.` : 
        `Not quite. The correct answer is "${correctAnswer}".`,
      educationalNote: "This is an important part of human anatomy!",
      encouragement: isCorrect ? 
        "Great job! Keep learning!" : 
        "Don't worry, keep trying! Learning anatomy takes time."
    };
  }
}