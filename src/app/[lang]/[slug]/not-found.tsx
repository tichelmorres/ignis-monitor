"use client";

import { ArrowLeftIcon } from "@/components/svg/ArrowLeftIcon";
import { HomeIcon } from "@/components/svg/HomeIcon";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "./not-found.module.css";

export default function PostNotFound() {
	const params = useParams();
	const router = useRouter();
	const lang = params.lang as string;

	const translations = {
		en: {
			title: "404: Post not found",
			subtitle:
				"Sorry, the post you are looking for does not exist or has been removed.",
			whatYouCanDo: "What you can do:",
			options: [
				"Check if the URL is correct",
				"Go back to the home page or previous page",
				"Explore other posts",
			],
			homePage: "Home page",
			goBack: "Go back",
		},
		ptBR: {
			title: "404: Post não encontrado",
			subtitle:
				"Desculpe, o post que você está procurando não existe ou foi removido.",
			whatYouCanDo: "O que você pode fazer:",
			options: [
				"Verificar se a URL está correta",
				"Voltar à página inicial ou anterior",
				"Explorar outros posts",
			],
			homePage: "Página inicial",
			goBack: "Voltar",
		},
	};

	const t =
		translations[lang as keyof typeof translations] || translations.ptBR;

	const handleGoBack = () => {
		router.back();
	};

	return (
		<div className={styles.post}>
			<div className={styles.postContainer}>
				<header className={styles.header}>
					<h1 className={styles.title}>{t.title}</h1>
					<p className={styles.subtitle}>{t.subtitle}</p>
				</header>

				<main className={styles.content}>
					<h2>{t.whatYouCanDo}</h2>
					<ul>
						{t.options.map((option, index) => (
							<li key={index}>{option}</li>
						))}
					</ul>
				</main>

				<footer className={styles.actions}>
					<Link href={`/${lang}`} className={styles.actionLink}>
						<HomeIcon className={styles.icon} />
						<span>{t.homePage}</span>
					</Link>
					<button onClick={handleGoBack} className={styles.actionButton}>
						<ArrowLeftIcon className={styles.icon} />
						<span>{t.goBack}</span>
					</button>
				</footer>
			</div>
		</div>
	);
}
