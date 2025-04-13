import db from '@/lib/db/db';
import { articlesSchema, resourcesSchema } from '@/lib/db/schema';
import { formatContentMarkdown } from '@/lib/text-improvements/format-content-markdown';
import { eq } from 'drizzle-orm';

const articlesWithContent = await db
  .select({
    id: articlesSchema.id,
    title: articlesSchema.title,
    content: resourcesSchema.content,
    resourceId: articlesSchema.resourceId,
  })
  .from(articlesSchema)
  .innerJoin(resourcesSchema, eq(articlesSchema.resourceId, resourcesSchema.id));


const validArticles = articlesWithContent.filter(article => {
  if (!article.content) {
    console.log(`Skipping article ${article.id} due to missing content.`);
    return false;
  }
  if (!article.resourceId) {
    console.log(`Skipping article ${article.id} due to missing resourceId.`);
    return false;
  }
  return true;
});

const BATCH_SIZE = 5;

console.log(`Starting processing of ${validArticles.length} articles in batches of ${BATCH_SIZE}...`);

for (let i = 0; i < validArticles.length; i += BATCH_SIZE) {
  const batch = validArticles.slice(i, i + BATCH_SIZE);
  console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} with ${batch.length} articles...`);

  const processingPromises = batch.map(async (article) => {
    if (!article.content || !article.resourceId) return; 

    console.log(`  Processing article: ${article.id} - ${article.title}`);
    try {
      const formattedContent = await formatContentMarkdown(article.content);
      await db.update(resourcesSchema)
        .set({ content: formattedContent })
        .where(eq(resourcesSchema.id, article.resourceId));
      console.log(`  Successfully processed article: ${article.id}`);
    } catch (error) {
      console.error(`  Error processing article ${article.id}:`, error);
    }
  });

  try {
    await Promise.all(processingPromises);
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} completed.`);
  } catch (error) {
    console.error(`An error occurred during processing batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error);
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
}

console.log("All batches processed.");

// const content = `
// Presidential Actions																			Addressing Risks from Chris Krebs and Government Censorship																										Presidential Memoranda																April 9, 2025MEMORANDUM FOR THE HEADS OF EXECUTIVE DEPARTMENTS AND AGENCIESThe Federal Government has a constitutional duty and a moral responsibility to respect and promote the free speech rights of Americans. Yet in recent years, elitist leaders in Government have unlawfully censored speech and weaponized their undeserved influence to silence perceived political opponents and advance their preferred, and often erroneous, narrative about significant matters of public debate. These disgraceful actions have taken the form of coercive threats against the private sector — including major social media platforms — to suppress conservative or dissenting voices and distort public opinion. Much of this censorship took place during a Presidential election with the apparent purpose of undermining the free exchange of ideas and debate.Christopher Krebs, the former head of the Cybersecurity and Infrastructure Security Agency (CISA), is a significant bad-faith actor who weaponized and abused his Government authority. Krebs' misconduct involved the censorship of disfavored speech implicating the 2020 election and COVID-19 pandemic. CISA, under Krebs' leadership, suppressed conservative viewpoints under the guise of combatting supposed disinformation, and recruited and coerced major social media platforms to further its partisan mission. CISA covertly worked to blind the American public to the controversy surrounding Hunter Biden's laptop. Krebs, through CISA, promoted the censorship of election information, including known risks associated with certain voting practices. Similarly, Krebs, through CISA, falsely and baselessly denied that the 2020 election was rigged and stolen, including by inappropriately and categorically dismissing widespread election malfeasance and serious vulnerabilities with voting machines. Krebs skewed the bona fide debate about COVID-19 by attempting to discredit widely shared views that ran contrary to CISA's favored perspective.Abusive conduct of this sort both violates the First Amendment and erodes trust in Government, thus undermining the strength of our democracy itself. Those who engage in or support such conduct must not have continued access to our Nation's secrets. Accordingly, I hereby direct the heads of executive department and agencies (agencies) to immediately take steps consistent with existing law to revoke any active security clearance held by Christopher Krebs.I further direct the Attorney General, the Director of National Intelligence, and all other relevant agencies to immediately take all action as necessary and consistent with existing law to suspend any active security clearances held by individuals at entities associated with Krebs, including SentinelOne, pending a review of whether such clearances are consistent with the national interest.I further direct the Attorney General and the Secretary of Homeland Security, in consultation with any other agency head, to take all appropriate action to review Krebs' activities as a Government employee, including his leadership of CISA. This review should identify any instances where Krebs' conduct appears to have been contrary to suitability standards for Federal employees, involved the unauthorized dissemination of classified information, or contrary to the purposes and policies identified in Executive Order 14149 of January 20, 2025 (Restoring Freedom of Speech and Ending Federal Censorship). As part of that review, I direct a comprehensive evaluation of all of CISA's activities over the last 6 years, focusing specifically on any instances where CISA's conduct appears to have been contrary to the purposes and policies identified in Executive Order 14149. Upon completing these reviews, the Attorney General and the Secretary of Homeland Security shall prepare a joint report to be submitted to the President, through the Counsel to the President, with recommendations for appropriate remedial or preventative actions to be taken to fulfill the purposes and policies of Executive Order 14149.This memorandum is not intended to, and does not, create any right or benefit, substantive or procedural, enforceable at law or in equity by any party against the United States, its departments, agencies, or entities, its officers, employees, or agents, or any other person.
// `;

// const formattedContent = await formatContentMarkdown(content);
// console.log(formattedContent);
