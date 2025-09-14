import type { CmsSection, CmsBlock } from '../../types';

export function getBlock<T = unknown>(
  section: CmsSection,
  slug: string
): CmsBlock<T> | null {
  const block = section.blocks?.[slug];
  if (!block) {
    console.warn(`[getBlock] Block '${slug}' not found in section '${section.slug}'`);
    return null;
  }
  return block as CmsBlock<T>;
}

export function getBlockData<T extends object>(
  section: CmsSection,
  slug: string,
  fallback: T
): T {
  const block = getBlock<T>(section, slug);

  if (!block?.data) {
    console.warn(`[getBlockData] Missing data for block '${slug}' in section '${section.slug}'`);
    return fallback;
  }

  const data = block.data as T;

  // Runtime "shape" validation using fallback keys
  const valid = Object.keys(fallback).every((key) => key in (data as object));
  if (!valid) {
    console.warn(`[getBlockData] Invalid data for block '${slug}', using fallback`);
    return fallback;
  }

  return data;
}