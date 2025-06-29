interface CmsBlock {
    "id": number;
    "section_id": number;
    "type": string;
    "slug": string;
    "data": unknown;
}

type CmsBlocks<T = string> = Record<T, CmsBlock>;

type CmsBlockGroups<T = string, B = string> = Record<T, CmsBlocks<B>>;

interface CmsSection {
    "id": number;
    "page_id": number;
    "title": string;
    "slug": string;
    "order": number;
    "blocks": CmsBlocks;
    "block_groups": CmsBlockGroups;
}

type CmsSections<T = string> = Record<string, CmsSection>;

export interface CmsPage {
    "id": number;
    "user_id": number;
    "title": string;
    "description": string;
    "sections": CmsSections;
}