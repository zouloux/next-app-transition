"use client"

import { ReactNode, useLayoutEffect, useState } from "react"
import { onNextRouterTransition } from "@zouloux/next-app-transition"

export default function MainLayout({
	children,
}: {
	children: ReactNode | ReactNode[]
}) {
	// Lock content interactivity when transitioning
	const [isTransitionLocked, setIsTransitionLocked] = useState(false)
	useLayoutEffect(
		() =>
			onNextRouterTransition.add(state => {
				setIsTransitionLocked(state !== "closed")
			}),
		[],
	)
	return <div inert={isTransitionLocked}>{children}</div>
}
