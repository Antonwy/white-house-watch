'use server';

import { eq } from 'drizzle-orm';
import db from '../db';
import { resourcesSchema } from '../schema';

export async function getResource(id: string) {
  return await db
    .select()
    .from(resourcesSchema)
    .where(eq(resourcesSchema.id, id))
    .limit(1)
    .then((rows) => rows.length > 0 ? rows[0] : null);
}