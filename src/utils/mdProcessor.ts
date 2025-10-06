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

const postDirectories: Record<string, string> = {
	en: "posts-en",
	ptBR: "posts-ptBR",
};

function getPostsDirectory(lang: string): string {
	const directory = postDirectories[lang];
	if (!directory) {
		throw new Error(`Unsupported language: ${lang}`);
	}
	return path.join(process.cwd(), directory);
}

const fileCache: Record<string, string[]> = {};

function getPostFiles(lang: string): string[] {
	if (!fileCache[lang]) {
		const postsDirectory = getPostsDirectory(lang);
		try {
			fileCache[lang] = fs
				.readdirSync(postsDirectory)
				.filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));
		} catch (error) {
			console.error(`Error reading directory for language ${lang}:`, error);
			fileCache[lang] = [];
		}
	}
	return fileCache[lang];
}

function findPostFile(lang: string, urlSlug: string): string | null {
	const files = getPostFiles(lang);

	for (const filename of files) {
		const fileSlug = slugify(filename.replace(/\.(mdx|md)$/, ""));
		if (fileSlug === urlSlug) {
			return filename;
		}
	}

	return null;
}

export async function getPostData(
	lang: string,
	urlSlug: string,
): Promise<Post> {
	const filename = findPostFile(lang, urlSlug);

	if (!filename) {
		notFound();
	}

	try {
		const postsDirectory = getPostsDirectory(lang);
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
		console.error(
			`Error processing post "${urlSlug}" for language "${lang}":`,
			error,
		);
		notFound();
	}
}

export function getPostsMetadata(lang: string): PostMetadata[] {
	const files = getPostFiles(lang);

	return files.map((filename) => {
		const urlSlug = slugify(filename.replace(/\.(mdx|md)$/, ""));
		const postsDirectory = getPostsDirectory(lang);
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
