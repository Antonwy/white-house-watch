'use server';

import { buildSignupEmailTemplate } from "../data/signup-email-template";
import { insertNotifyMe } from "../db/actions/insert-notify-me";
import { nameFromEmail } from "../text-modifications/name-from-email";
import { sendEmail } from "./send-email";

export async function notifyMe(email: string, topics: string[]) {
  try {
    const possibleName = await nameFromEmail(email);

    const { success } = await insertNotifyMe({
      email,
      topics,
      possibleName,
    });

    if (!success) {
      throw new Error('Failed to insert notify me');
    }

    const template = buildSignupEmailTemplate(possibleName, topics);

    await sendEmail(email, 'Whitehouse Watch - Thanks for signing up', template);

    return { success };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
