import { Link } from "@/components/Link"

export function MainTemplate({ title }: { title: string }) {
	return (
		<div style={{ padding: 20 }}>
			<h1>{title}</h1>
			<p style={{ marginTop: 20 }}>
				Page transition demo for Next applications with App router
			</p>
			<nav style={{ marginTop: 40, display: "flex", gap: 12 }}>
				<Link href="/">Home page</Link>
				<Link href="/virtual-page-1">Virtual page 1</Link>
				<Link href="/virtual-page-2">Virtual page 2</Link>
				<Link href="/virtual-page-3">Virtual page 3</Link>
				<Link href="/virtual-page-4">Virtual page 4</Link>
			</nav>
		</div>
	)
}
