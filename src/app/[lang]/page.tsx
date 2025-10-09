import LanguageSwitcher from "@/components/navigation/LanguageSwitcher";
import PageHeader from "@/components/navigation/PageHeader";
import ResearchNavigation from "@/components/navigation/ResearchNavigation";
import { getDictionary } from "@/dictionaries";
import { getPostsMetadata } from "@/utils/mdProcessor";
import { notFound } from "next/navigation";
import styles from "./page.module.css";

interface PageParams {
	lang: string;
}

const supportedLanguages = ["en", "ptBR"];

export default async function Home({
	params,
}: {
	params: Promise<PageParams>;
}) {
	const { lang } = await params;

	// Validate language parameter before proceeding
	// This is useful when the middleware fails for whatever reason
	if (!supportedLanguages.includes(lang)) {
		notFound();
	}

	const dict = await getDictionary(lang);
	const posts = getPostsMetadata(lang);

	return (
		<div className={styles.home}>
			<PageHeader />
			<LanguageSwitcher />

			<div className={styles.container}>
				<div className={styles.contentWrapper}>
					<main className={styles.mainContent}>
						<article className={styles.article}>
							{/* Introduction */}
							<section className={styles.abstract}>
								<h2 className={styles.sectionTitle}>
									{dict.page.introduction_title}
								</h2>
								<p className={styles.abstractText}>
									{dict.page.introduction_paragraph1}
								</p>
								<p className={styles.abstractText}>
									{dict.page.introduction_paragraph2}
								</p>
							</section>

							{/* Health Impacts */}
							<section className={styles.methodology}>
								<h2 className={styles.sectionTitle}>
									{dict.page.health_impacts_title}
								</h2>
								<p className={styles.contentText}>
									{dict.page.health_impacts_paragraph}
								</p>
								<ul className={styles.methodList}>
									{dict.page.health_impacts_list.map((item, index) => (
										<li key={index}>{item}</li>
									))}
								</ul>
							</section>

							{/* Trends */}
							<section className={styles.contributions}>
								<h2 className={styles.sectionTitle}>
									{dict.page.trends_title}
								</h2>
								<p className={styles.contentText}>
									{dict.page.trends_paragraph}
								</p>
								<div className={styles.contributionsList}>
									{dict.page.trends_contributions.map((contribution, index) => (
										<div key={index} className={styles.contribution}>
											<h3 className={styles.contributionTitle}>
												{contribution.title}
											</h3>
											<p className={styles.contributionText}>
												{contribution.text}
											</p>
										</div>
									))}
								</div>
							</section>

							{/* Climate Conditions */}
							<section className={styles.methodology}>
								<h2 className={styles.sectionTitle}>
									{dict.page.climate_conditions_title}
								</h2>
								<p className={styles.contentText}>
									{dict.page.climate_conditions_paragraph}
								</p>
								<ul className={styles.methodList}>
									{dict.page.climate_conditions_list.map((item, index) => (
										<li key={index}>{item}</li>
									))}
								</ul>
							</section>

							{/* Technology */}
							<section className={styles.contributions}>
								<h2 className={styles.sectionTitle}>
									{dict.page.technology_title}
								</h2>
								<p className={styles.contentText}>
									{dict.page.technology_paragraph}
								</p>
								<div className={styles.contributionsList}>
									{dict.page.technology_contributions.map(
										(contribution, index) => (
											<div key={index} className={styles.contribution}>
												<h3 className={styles.contributionTitle}>
													{contribution.title}
												</h3>
												<p className={styles.contributionText}>
													{contribution.text}
												</p>
											</div>
										),
									)}
								</div>
							</section>

							{/* Justification */}
							<section className={styles.methodology}>
								<h2 className={styles.sectionTitle}>
									{dict.page.justification_title}
								</h2>
								<p className={styles.contentText}>
									{dict.page.justification_paragraph}
								</p>
								<ul className={styles.methodList}>
									{dict.page.justification_list.map((item, index) => (
										<li key={index}>{item}</li>
									))}
								</ul>
							</section>

							{/* Practical Sense */}
							<section className={styles.contributions}>
								<h2 className={styles.sectionTitle}>
									{dict.page.practical_sense_title}
								</h2>
								<p className={styles.contentText}>
									{dict.page.practical_sense_paragraph}
								</p>
								<div className={styles.contributionsList}>
									{dict.page.practical_sense_contributions.map(
										(contribution, index) => (
											<div key={index} className={styles.contribution}>
												<h3 className={styles.contributionTitle}>
													{contribution.title}
												</h3>
												<p className={styles.contributionText}>
													{contribution.text}
												</p>
											</div>
										),
									)}
								</div>
							</section>
						</article>
					</main>

					{/* Side Navigation */}
					<ResearchNavigation posts={posts} currentLang={lang} />
				</div>
			</div>
		</div>
	);
}
