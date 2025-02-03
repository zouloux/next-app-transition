import { ReactNode } from "react"

export function Link({
	href,
	children,
}: {
	href: string
	children: string | ReactNode
}) {
	return (
		<a
			href={href}
			style={{
				display: "inline-block",
				color: "white",
				whiteSpace: "nowrap",
				textDecoration: "none",
				border: "1px solid currentColor",
				borderRadius: "4px",
				padding: "4px 8px",
				height: "20px",
			}}
			children={children}
		/>
	)
}
