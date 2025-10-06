"use client";

import Image, { ImageProps as NextImageProps } from "next/image";
import React, { ReactNode, useState } from "react";

import styles from "./coolImage.module.css";

export interface CoolImageProps {
	src: NextImageProps["src"];
	alt?: string;
	caption?: ReactNode;
	width: number;
	height: number;
	className?: string;
	style?: React.CSSProperties;
	loading?: "lazy" | "eager";
	onClick?: (
		e: React.MouseEvent<HTMLDivElement | HTMLImageElement, MouseEvent>,
	) => void;
	priority?: boolean;
	quality?: number;
	placeholder?: NextImageProps["placeholder"];
	blurDataURL?: string;
	sizes?: string;
}

export const CoolImage = ({
	src,
	alt = "",
	caption,
	width,
	height,
	className = "",
	style,
	loading = "lazy",
	onClick,
	priority = false,
	quality,
	placeholder,
	blurDataURL,
	sizes,
}: CoolImageProps) => {
	if (!Number.isFinite(width) || !Number.isFinite(height)) {
		throw new Error(
			"CoolImage: `width` and `height` props are required and must be numbers.",
		);
	}
	if (!src) {
		throw new Error("CoolImage: `src` is required.");
	}

	const [errored, setErrored] = useState(false);
	const [loaded, setLoaded] = useState(false);

	const interactive = !!onClick;
	const interactiveProps: React.HTMLAttributes<HTMLDivElement> = interactive
		? {
				tabIndex: 0,
				role: "button",
				onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						(e.currentTarget as HTMLElement).click();
					}
				},
			}
		: {};

	const wrapperId = React.useId();
	const captionId = caption ? `${wrapperId}-caption` : undefined;

	const wrapperClass = [
		styles.wrapper,
		interactive ? styles.wrapperInteractive : "",
		className,
	]
		.filter(Boolean)
		.join(" ");

	const wrapperStyle: React.CSSProperties = {
		...style,
		width: `${width}px`,
		maxWidth: "100%",
		aspectRatio: `${width} / ${height}`,
		display: "inline-block",
		boxSizing: "border-box",
	};

	return (
		<figure className={styles.figure}>
			<div
				id={wrapperId}
				className={wrapperClass}
				onClick={onClick}
				{...interactiveProps}
				style={wrapperStyle}
				data-loading={!loaded}
				data-errored={errored}
				aria-describedby={captionId}
				aria-label={alt || undefined}
			>
				{!errored ? (
					<Image
						src={src}
						alt={alt}
						width={width}
						height={height}
						loading={loading}
						priority={priority}
						quality={quality}
						placeholder={placeholder}
						blurDataURL={blurDataURL}
						sizes={sizes}
						className={styles.image}
						onLoadingComplete={() => setLoaded(true)}
						onError={() => setErrored(true)}
						style={{
							width: "100%",
							height: "100%",
							display: "block",
							objectFit: "contain",
						}}
					/>
				) : (
					<div
						className={styles.fallback}
						role="img"
						aria-label={alt || "Image unavailable"}
					>
						{alt || "Image unavailable"}
					</div>
				)}
			</div>

			{caption ? (
				<figcaption id={captionId} className={styles.caption}>
					{caption}
				</figcaption>
			) : null}
		</figure>
	);
};
