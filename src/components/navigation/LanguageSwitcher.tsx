"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./languageSwitcher.module.css";

interface Language {
	code: string;
	name: string;
	flag: string;
}

const languages: Language[] = [
	{ code: "en", name: "English", flag: "🇺🇸" },
	{ code: "ptBR", name: "Português", flag: "🇧🇷" },
];

export default function LanguageSwitcher() {
	const router = useRouter();
	const pathname = usePathname();
	const [currentLang, setCurrentLang] = useState<string>("");

	useEffect(() => {
		const pathSegments = pathname.split("/").filter(Boolean);
		if (
			pathSegments.length > 0 &&
			languages.some((lang) => lang.code === pathSegments[0])
		) {
			setCurrentLang(pathSegments[0]);
		} else {
			setCurrentLang("ptBR");
		}
	}, [pathname]);

	const switchLanguage = async (newLocale: string) => {
		if (!pathname) return;

		document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; sameSite=lax`;

		console.log("LanguageSwitcher: Set cookie to", newLocale);

		const pathSegments = pathname.split("/").filter(Boolean);
		const hasExistingLang = languages.some(
			(lang) => lang.code === pathSegments[0],
		);

		let newPathname: string;

		if (hasExistingLang) {
			pathSegments[0] = newLocale;
			newPathname = "/" + pathSegments.join("/");
		} else {
			newPathname = `/${newLocale}${pathname}`;
		}

		router.push(newPathname);
	};

	return (
		<div className={styles.languageSwitcher}>
			{languages.map((language) => (
				<button
					key={language.code}
					onClick={() => switchLanguage(language.code)}
					className={`${styles.languageButton} ${currentLang === language.code ? styles.active : ""}`}
					aria-label={`Switch to ${language.name}`}
					type="button"
				>
					<span className={styles.flag}>{language.flag}</span>
					<span className={styles.name}>{language.name}</span>
				</button>
			))}
		</div>
	);
}
