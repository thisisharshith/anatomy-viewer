import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getAnatomyInfo(partName, age) {
  try {
    const cleanPartName = partName.replace(/_/g, ' ').toLowerCase();
    
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
      model: "llama-3.2-11b-text-preview",
      temperature: 0.6,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || "Information not available.";
  } catch (error) {
    console.error('Error fetching anatomy info:', error);
    return "Unable to fetch information at this time.";
  }
}