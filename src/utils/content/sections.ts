import type { CmsSection, CmsPage } from '../../types';

export function getSection(
  page: CmsPage,
  slug: string
): CmsSection {
  const section = page.sections?.[slug];

  if (!section) {
    console.warn(`[getSection] Section '${slug}' not found in page '${page.id}'`);
    return {
      id: -1,
      page_id: page.id,
      title: slug,
      slug,
      order: 0,
      blocks: {},
      block_groups: {}
    };
  }

  return section;
}