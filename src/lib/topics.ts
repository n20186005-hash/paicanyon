import { messagesFor, type Lang } from '../i18n/ui';

/**
 * Long-tail topic guides (2026-10 SEO pass).
 * Slugs are identical across locales so hreflang alternates and the sitemap can
 * pair /en/<slug>/ with /th/<slug>/ and /zh/<slug>/.
 */
export const TOPIC_KEYS = ['entranceFee', 'sunset', 'hiking', 'gettingThere'] as const;
export type TopicKey = (typeof TOPIC_KEYS)[number];

export const getTopic = (lang: Lang, slug: string) => {
  const topics = messagesFor(lang).topics;
  for (const key of TOPIC_KEYS) {
    const topic = topics[key];
    if (topic && topic.slug === slug) return { key, topic };
  }
  return null;
};
