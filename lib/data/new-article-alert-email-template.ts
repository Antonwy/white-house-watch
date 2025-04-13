export function buildNewArticleAlertEmail(name: string | null, articles: { title: string; url: string }[]) {
  return `
    <h1>New articles alert, ${name || 'there'}!</h1>
    <p>We've found some new articles that might be of interest to you.</p>
    <ul>
      ${articles.map(article => `<li><a href="${article.url}" target="_blank">${article.title}</a></li>`).join('')}
    </ul>

    <p>Happy reading!</p>
    <p>Best regards,<br>Whitehouse Watch</p>
  `;
}
