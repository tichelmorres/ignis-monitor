import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const locales = ["en", "ptBR"];
const defaultLocale = "ptBR";

function getLocale(request: NextRequest): string {
	const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
	if (cookieLocale && locales.includes(cookieLocale)) {
		return cookieLocale;
	}

	const acceptLanguage = request.headers.get("accept-language");
	if (acceptLanguage) {
		const languages = acceptLanguage
			.split(",")
			.map((lang) => {
				const [code, quality] = lang.trim().split(";");
				return {
					code: code.split("-")[0],
					quality: quality ? parseFloat(quality.split("=")[1]) : 1.0,
				};
			})
			.sort((a, b) => b.quality - a.quality);

		for (const lang of languages) {
			if (locales.includes(lang.code)) {
				return lang.code;
			}
			if (lang.code === "pt" && locales.includes("ptBR")) {
				return "ptBR";
			}
			if (lang.code === "en" && locales.includes("en")) {
				return "en";
			}
		}
	}

	return defaultLocale;
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (pathname === "/") {
		const preferredLocale = request.cookies.get("NEXT_LOCALE")?.value;
		const locale =
			preferredLocale && locales.includes(preferredLocale)
				? preferredLocale
				: getLocale(request);

		const redirectUrl = new URL(`/${locale}`, request.url);
		const response = NextResponse.redirect(redirectUrl);

		const currentCookie = request.cookies.get("NEXT_LOCALE")?.value;
		if (!currentCookie || currentCookie !== locale) {
			response.cookies.set("NEXT_LOCALE", locale, {
				path: "/",
				maxAge: 365 * 24 * 60 * 60,
				sameSite: "lax",
			});
		}

		return response;
	}

	const pathnameHasLocale = locales.some(
		(locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
	);

	if (pathnameHasLocale) {
		const currentLocale = pathname.split("/")[1];
		const response = NextResponse.next();

		const currentCookie = request.cookies.get("NEXT_LOCALE")?.value;
		if (currentCookie !== currentLocale) {
			response.cookies.set("NEXT_LOCALE", currentLocale, {
				path: "/",
				maxAge: 365 * 24 * 60 * 60,
				sameSite: "lax",
			});
		}

		return response;
	}

	const locale = getLocale(request);
	const redirectUrl = new URL(`/${locale}${pathname}`, request.url);
	const response = NextResponse.redirect(redirectUrl);

	response.cookies.set("NEXT_LOCALE", locale, {
		path: "/",
		maxAge: 365 * 24 * 60 * 60,
		sameSite: "lax",
	});

	return response;
}

export const config = {
	matcher: [
		"/((?!_next|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
