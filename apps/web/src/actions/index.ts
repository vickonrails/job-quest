'use server';

import { revalidateTag } from 'next/cache';

export async function invalidateCacheAction(tags: string[]) {
    return Promise.all(tags.map((tag) => revalidateTag(tag)));
}
