import { openai } from "../openai";

export async function nameFromEmail(email: string): Promise<string | null> {
  const prompt = `
    Given the email address "${email}", what is the most likely full name of the person associated with it?
    Consider common patterns like firstname.lastname, firstinitiallastname, etc.
    If you are reasonably confident, return only the full name.
    Everything after the @ symbol is the domain not the name.
    If you are unsure or the email format doesn't suggest a name (e.g., info@, support@, noreply@), return the exact string "UNSURE".
    Examples:
    - "john.doe@example.com" -> "John Doe"
    - "jdoe@example.com" -> "J Doe" (or potentially "John Doe" if model infers)
    - "support@example.com" -> "UNSURE"
    - "randomstring123@example.com" -> "UNSURE"
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 50,
    });

    const result = response.choices[0]?.message?.content?.trim();

    if (result && result !== "UNSURE") {
      return result;
    } else {
      console.log(`AI model was unsure about the name for email: ${email}`);
      return null;
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return null;
  }
}
