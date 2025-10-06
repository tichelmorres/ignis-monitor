"use client";

import LanguageSwitcher from "@/components/navigation/LanguageSwitcher";
import { useEffect, useState } from "react";
import styles from "./not-found.module.css";

export default function RootNotFound() {
	const [detectedLang, setDetectedLang] = useState<"en" | "ptBR">("ptBR");

	useEffect(() => {
		const browserLang = navigator.language.toLowerCase();
		if (browserLang.startsWith("en")) {
			setDetectedLang("en");
		}
	}, []);

	const translations = {
		en: {
			title: "Language Selection Required",
			subtitle:
				"Please select your preferred language to continue to the website.",
			whatYouCanDo: "To get started:",
			options: [
				"Choose your language using the selector below",
				"You'll be redirected to the appropriate language version",
				"Your preference will be saved for future visits",
			],
		},
		ptBR: {
			title: "Seleção de Idioma Necessária",
			subtitle:
				"Por favor, selecione seu idioma preferido para continuar para o site.",
			whatYouCanDo: "Para começar:",
			options: [
				"Escolha seu idioma usando o seletor abaixo",
				"Você será redirecionado para a versão no idioma apropriado",
				"Sua preferência será salva para visitas futuras",
			],
		},
	};

	const t = translations[detectedLang];

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
					<div className={styles.languageSwitcherContainer}>
						<LanguageSwitcher />
					</div>
				</footer>
			</div>
		</div>
	);
}
