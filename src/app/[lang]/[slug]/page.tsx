import BackButton from "@/components/navigation/BackButton";
import PageHeader from "@/components/navigation/PageHeader";
import ResearchNavigation from "@/components/navigation/ResearchNavigation";
import { getPostData, getPostsMetadata } from "@/utils/mdProcessor";
import styles from "./post.module.css";

interface PostParams {
	lang: string;
	slug: string;
}

export default async function Post({
	params,
}: {
	params: Promise<PostParams>;
}) {
	const { lang, slug } = await params;
	const post = await getPostData(lang, slug);
	const posts = getPostsMetadata(lang);

	return (
		<div className={styles.post}>
			<PageHeader />

			<div className={styles.postContainer}>
				<div className={styles.contentWrapper}>
					{/* Back button */}
					<div className={styles.backButtonContainer}>
						<BackButton href={`/${lang}`} />
					</div>

					{/* Left Column - Main Content */}
					<main className={styles.mainContent}>
						<article className={styles.article}>
							<header className={styles.header}>
								{post.topic && <div className={styles.topic}>{post.topic}</div>}
								<h1 className={styles.title}>{post.title}</h1>
							</header>

							<div className={styles.content}>{post.content}</div>
						</article>
					</main>

					{/* Right Column - Navigation */}
					<ResearchNavigation
						posts={posts}
						currentSlug={slug}
						currentLang={lang}
					/>
				</div>
			</div>
		</div>
	);
}
