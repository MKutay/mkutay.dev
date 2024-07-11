import { MetadataRoute } from 'next';
import getPosts, { getPostsLength } from '@/app/lib/getPosts';
import { getListOfAllTags } from '@/app/lib/getListOfAllTags';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts({ });

  const postsLength = posts.length;

  let siteMap = [];

  posts.forEach((post) => {
    siteMap.push({
      url: `https://www.mkutay.dev/posts/${post.slug}`,
      lastModified: new Date(String(post.meta.date)),
    });
  });

  siteMap.push({
    url: 'https://www.mkutay.dev',
    lastModified: new Date(),
  });

  siteMap.push({
    url: 'https://www.mkutay.dev/guestbook',
    lastModified: new Date(),
  });

  siteMap.push({
    url: 'https://www.mkutay.dev/about',
    lastModified: new Date(),
  });

  for (let i = 1; i <= Math.ceil(postsLength / siteConfig.postNumPerPage); i++) {
    siteMap.push({
      url: `https://www.mkutay.dev/posts/page/${i}`,
      lastModified: new Date(),
    });
  }

  const tags = getListOfAllTags();
  tags.forEach((tag) => {
    const postsWithTagLength = getPostsLength(tag);
    for (let i = 1; i <= Math.ceil(postsWithTagLength / siteConfig.postNumPerPage); i++) {
      siteMap.push({
        url: `https://www.mkutay.dev/tags/${tag}/page/${i}`,
        lastModified: new Date(),
      });
    }
  });

  return siteMap;
}