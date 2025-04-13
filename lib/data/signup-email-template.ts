export function buildSignupEmailTemplate(name: string | null, topics: string[]) {
  return `
    <h1>Thanks for signing up, ${name || 'there'}!</h1>
    <p>We're excited to have you on board.</p>
    <p>Based on your selections, we'll keep you updated on:</p>
    <ul>
      ${topics.map(topic => `<li>${topic}</li>`).join('')}
    </ul>

    <p>Thank you for signing up!</p>
  `;
}
