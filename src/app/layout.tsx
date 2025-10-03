import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "I.G.N.I.S. - Sistema de detecção de incêndio",
	description:
		"Documentação de pesquisas sobre aplicação de visão computacional e aprendizado de máquina. Monitoramento remoto de focos de incêndio.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt">
			<body>
				<div className="content-wrapper">{children}</div>
			</body>
		</html>
	);
}
