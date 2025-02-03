"use client"

import { useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import {
	useAnchorGlobalListener,
	usePreventNextRouter,
} from "@zouloux/next-app-transition"

export function PageTransition({}: {}) {
	const $root = useRef<HTMLDivElement>(null)
	const $panel = useRef<HTMLDivElement>(null)

	const [isVisible, setIsVisible] = useState(false)

	// Animate panel state
	async function animatePanel(state: boolean, duration = 1) {
		// Show the transition element only if we have a duration
		if (duration !== 0) {
			setIsVisible(true)
		}
		//
		if (state) {
			gsap.set($panel.current, { y: "100%" })
		}
		await gsap.to($panel.current, {
			duration: duration * 0.72,
			ease: state ? "power4.in" : "power4.out",
			delay: state ? 0 : duration * 0.06,
			overwrite: true,
			y: state ? 0 : "-100%",
		})
		setIsVisible(state)
	}

	// Init default panel state
	useLayoutEffect(() => {
		animatePanel(false, 0)
	}, [])

	// Prevent next router, and animate panel when changing page
	// A patched routerPush function is returned to trigger page changes
	//	with the transition
	const { routerPush } = usePreventNextRouter({
		// Called when router wants to change page
		// It can be triggered from a push-state
		transitionHandler: async (state: boolean) => await animatePanel(state),
		reloadOnSameHref: true,
	})

	// Listen for all <a href> clicks to override default Next's behavior
	useAnchorGlobalListener({
		// User clicks on any internal and relative link
		relativeHandler(event, href) {
			// Prevent native browser navigation
			event.preventDefault()
			// Use patched routerPush to change page with custom transition
			routerPush(href)
		},
	})

	return (
		<div
			ref={$root}
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 99,
				display: isVisible ? "block" : "none",
				cursor: "progress",
			}}
		>
			<div
				ref={$panel}
				style={{ position: "absolute", inset: 0, background: "#333" }}
			/>
		</div>
	)
}
