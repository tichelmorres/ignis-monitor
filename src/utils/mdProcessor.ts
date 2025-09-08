import MDXComponents from "@/components/posts/MDXComponents";
import fs from "fs";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import path from "path";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { Post, PostMetadata } from "../types/post";
import slugify from "./slugify";

const postsDirectory = path.join(process.cwd(), "posts");

let fileCache: string[] | null = null;

function getPostFiles(): string[] {
  if (!fileCache) {
    fileCache = fs
      .readdirSync(postsDirectory)
      .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
  }
  return fileCache;
}

function findPostFile(urlSlug: string): string | null {
  const files = getPostFiles();

  for (const filename of files) {
    const fileSlug = slugify(filename.replace(/\.(mdx|md)$/, ""));
    if (fileSlug === urlSlug) {
      return filename;
    }
  }

  return null;
}

export async function getPostData(urlSlug: string): Promise<Post> {
  const filename = findPostFile(urlSlug);

  if (!filename) {
    notFound();
  }

  try {
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data: frontmatter, content: rawContent } = matter(fileContents);

    const { content } = await compileMDX({
      source: rawContent,
      components: MDXComponents,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkBreaks],
          format: filename.endsWith(".mdx") ? "mdx" : "md",
        },
      },
    });

    const metadata: PostMetadata = {
      title: frontmatter.title,
      slug: urlSlug,
      topic: frontmatter.topic,
    };

    return {
      content,
      ...metadata,
    };
  } catch (error) {
    console.error(`Error processing post "${urlSlug}":`, error);
    notFound();
  }
}

export function getPostsMetadata(): PostMetadata[] {
  const files = getPostFiles();

  return files.map((filename) => {
    const urlSlug = slugify(filename.replace(/\.(mdx|md)$/, ""));
    const fullPath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data: frontmatter } = matter(fileContents);

    return {
      title: frontmatter.title,
      slug: urlSlug,
      topic: frontmatter.topic,
    };
  });
}
