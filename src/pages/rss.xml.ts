import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const today = new Date().toISOString().slice(0, 10);
  const posts = (await getCollection('blog', ({ data }) => !data.draft && data.date.slice(0, 10) <= today))
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  return rss({
    title: '깃냥이.DEV',
    description: '깃냥이의 개발 블로그',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.date),
      link: `/blog/${post.id}`,
    })),
  });
}
