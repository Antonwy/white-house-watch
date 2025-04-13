'use server';

import db from "../db";
import { InsertNotifyMe, notifyMeSchema } from "../schema";

export async function insertNotifyMe(data: InsertNotifyMe) {  
  try {
    await db.insert(notifyMeSchema).values({
      email: data.email,
      topics: data.topics,
      possibleName: data.possibleName,
    }).onConflictDoUpdate({
      target: notifyMeSchema.email,
      set: {
        topics: data.topics,
        possibleName: data.possibleName,
      }
    });
  } catch (error) {
    console.error("Error inserting/updating notify me record:", error);
    throw error;
  }

  return { success: true };
}
