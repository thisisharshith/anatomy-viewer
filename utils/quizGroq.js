// Import Groq SDK for chat-based API interactions
import Groq from 'groq-sdk';

// Initialize Groq SDK instance with the API key and allow browser usage
const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, // Retrieve the API key from environment variables
  dangerouslyAllowBrowser: true // Allows use of the API in a browser environment
});

// Define a list of medical professions that require more technical anatomy questions
const MEDICAL_PROFESSIONS = [
  'doctor', 'nurse', 'medical student', 'physiotherapist',
  'paramedic', 'pharmacist', 'dentist', 'veterinarian',
  'medical researcher', 'biology teacher', 'healthcare'
];

// Function to generate an anatomy quiz question based on user's age and profession
export async function generateQuestion(age, profession = '') {
  try {
    // Determine the user's age group based on their age
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

    // Check if the user has a medical background based on the profession
    const hasMedicalBackground = MEDICAL_PROFESSIONS.some(p => 
      profession.toLowerCase().includes(p.toLowerCase())
    );

    // Generate a question via Groq's chat API, tailoring content to the user's age and background
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system", // Provide system instructions to Groq
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
          role: "user", // Request for the question from the user perspective
          content: `Generate one anatomy quiz question for a ${age}-year-old ${profession || 'person'}.`
        }
      ],
      model: "llama-3.2-11b-text-preview", // Model used for generating the response
      temperature: 0.6, // Adjust the creativity of the response
      response_format: { type: "json_object" } // Request response in a structured JSON format
    });

    // Return the generated question and related information
    return JSON.parse(completion.choices[0]?.message?.content);
  } catch (error) {
    console.error('Error generating question:', error);
    // Return fallback question if an error occurs, based on the user's medical background
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

// Function to check the user's answer and compare it with the correct answer
export async function checkAnswer(userAnswer, correctAnswer, age) {
  try {
    // Determine the user's age group for appropriate response
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

    // Use Groq's chat API to compare the answers and provide feedback
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system", // Provide instructions for answer evaluation
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
          role: "user", // User query asking for answer evaluation
          content: `Compare these answers:
                   Correct: "${correctAnswer}"
                   User's: "${userAnswer}"`
        }
      ],
      model: "llama-3.2-11b-text-preview", // Model used for generating the response
      temperature: 0.3, // Lower temperature for more structured responses
      response_format: { type: "json_object" } // Request response in a structured JSON format
    });

    // Return the answer evaluation
    return JSON.parse(completion.choices[0]?.message?.content);
  } catch (error) {
    console.error('Error checking answer:', error);
    // Provide a fallback evaluation in case of an error
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