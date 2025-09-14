import type { CmsPage } from '../../types';

export function getContent(
    page: CmsPage,
    sectionSlug: string,
    blockSlug: string,
    fallbackString?: string
): string {
    try {
        const section = page.sections?.[sectionSlug];

        if (!section) {
            throw new Error(`Section '${sectionSlug}' not found in page.sections`);
        }

        const block = section.blocks?.[blockSlug];

        if (!block) {
            throw new Error(`Block '${blockSlug}' not found in section '${sectionSlug}'`);
        }

        const data = block.data as { content?: string };

        if (!data || typeof data.content !== 'string') {
            throw new Error(`Missing or invalid content in block '${blockSlug}'`);
        }

        return data.content;
    } catch (error) {
        console.error(`[getContent] ${error instanceof Error ? error.message : String(error)}`);
        return fallbackString ?? `[Missing content: ${sectionSlug}.${blockSlug}]`;
    }
}

