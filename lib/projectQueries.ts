import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';

export function getProjectFiles() {
  const postFiles = fs.readdirSync(path.join(process.cwd(), 'content/projects'), 'utf-8');
  return postFiles;
}

export function getProps(pathTo: string, slug: string) {
  let markdownFile;
  try {
    markdownFile = fs.readFileSync(path.join(process.cwd(), path.join(pathTo, slug + '.mdx')), 'utf-8');
  } catch(error) {
    notFound();
  }

  const { data: frontMatter, content } = matter(markdownFile);

  return {
    meta: frontMatter,
    slug: slug,
    content: content,
  };
}

export function getProjects({
  startInd,
  endInd,
  tag,
}: {
  startInd?: number,
  endInd?: number,
  tag?: string
}) { // half-open interval, ie. [startInd, endInd)
  startInd = startInd ?? 0;
  endInd = endInd ?? 100000;

  const postFiles = getProjectFiles();

  let posts: {
    slug: string,
    content: string,
    meta: { [key: string]: any },
  }[] = [];
  
  postFiles.forEach((filename) => {
    const slug = filename.replace('.mdx', '');
    const props = getProps('content/projects', slug);

    if (typeof tag == 'undefined') {
      posts.push(props);
    } else if (props.meta.tags.includes(tag)) {
      posts.push(props);
    }
  });

  posts.sort((a, b) => (
    new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  ));

  return posts.slice(startInd, endInd);
}

export function getProjectsLength(tag?: string) {
  if (typeof tag == 'undefined') {
    return getProjectFiles().length;
  }
  return getProjects({ tag }).length;
}

export function getListOfAllTags() {
  const posts = getProjects({  });
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.meta.tags.forEach((tag: string) => {
      tags.add(tag);
    });
  });

  return Array.from(tags);
}