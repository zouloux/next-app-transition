import { ReactNode } from "react"
import { PageTransition } from "@/components/PageTransition"
import MainLayout from "@/components/MainLayout"

export const metadata = {
	title: "Next App Router pages transitions",
	description: "A next library for smooth page transitions",
}

const globalStyles = `
	* {
		margin: 0;
		padding: 0;
	}
	html {
		background: #111;
		color: white;
	}
`

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<style>{globalStyles}</style>
			</head>
			<body>
				<MainLayout>{children}</MainLayout>
				<PageTransition />
			</body>
		</html>
	)
}
