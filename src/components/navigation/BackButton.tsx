"use client";

import { ArrowLeftIcon } from "@/components/svg/ArrowLeftIcon";
import { useRouter } from "next/navigation";
import styles from "./backButton.module.css";

interface BackButtonProps {
	href?: string;
	className?: string;
}

export default function BackButton({ href, className = "" }: BackButtonProps) {
	const router = useRouter();

	const handleClick = () => {
		if (href) {
			router.push(href);
		} else {
			router.back();
		}
	};

	return (
		<button
			onClick={handleClick}
			className={`${styles.backButton} ${className}`}
			aria-label="Go back"
			type="button"
		>
			<ArrowLeftIcon className={styles.icon} />
		</button>
	);
}
