import { buildNewArticleAlertEmail } from "@/lib/data/new-article-alert-email-template";
import { sendEmail } from "../lib/notifications/send-email";


const template = buildNewArticleAlertEmail("Anton", [
  { title: 'Article 1', url: 'https://www.google.com' },
  { title: 'Article 2', url: 'https://www.google.com' },
]);

await sendEmail('anton.wyrowski@gmail.com', 'New article alert', template);