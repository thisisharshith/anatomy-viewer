// Import the Groq SDK to interact with the Groq API
import Groq from 'groq-sdk';

// Initialize Groq with the API key and allow it to run in the browser
const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,  // API key from environment variables
  dangerouslyAllowBrowser: true  // Allow running in the browser (use cautiously)
});

// Fetch anatomy information based on part name and age
export async function getAnatomyInfo(partName, age) {
  try {
    // Clean up part name by replacing underscores with spaces and converting to lowercase
    const cleanPartName = partName.replace(/_/g, ' ').toLowerCase();
    
    // Determine the age group based on the given age
    let ageGroup;
    if (age <= 12) {
      ageGroup = 'children';  // Age group for children
    } else if (age <= 18) {
      ageGroup = 'teenagers';  // Age group for teenagers
    } else if (age <= 60) {
      ageGroup = 'adults';  // Age group for adults
    } else {
      ageGroup = 'seniors';  // Age group for seniors
    }

    // Create a chat completion request to get anatomy information from Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an anatomy expert who explains concepts appropriately based on age. 
                   Adjust your language and detail level to be suitable for ${ageGroup} (age ${age}).
                   Keep explanations clear, engaging, and age-appropriate.`
        },
        {
          role: "user",
          content: `Explain the ${cleanPartName} in human anatomy and its main functions in a way that's 
                   appropriate for someone who is ${age} years old. Include relevant details about health 
                   and maintenance if applicable.`
        }
      ],
      model: "llama-3.2-11b-text-preview",  // Specify the model for generating the response
      temperature: 0.6,  // Set the creativity of the response (0.6 is moderate)
      max_tokens: 1000,  // Limit the response to 1000 tokens (words/phrases)
    });

    // Return the response content or a fallback message if unavailable
    return completion.choices[0]?.message?.content || "Information not available.";
  } catch (error) {
    console.error('Error fetching anatomy info:', error);  // Log any error that occurs
    return "Unable to fetch information at this time.";  // Return a fallback error message
  }
}