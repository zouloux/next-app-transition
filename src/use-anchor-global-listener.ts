import { useLayoutEffect } from "react"
import { getParentNodeOfTag, on } from "./utils/index.js"

// ----------------------------------------------------------------------------- USE ANCHOR GLOBAL LISTENER
// This hook allow catching all clicks on <a> tags throughout all the application
// This is not something limited to next, it can work in any React based application


type TAnchorGlobalListenerOptions = {
	// User clicks on any internal and relative link
	relativeHandler	?: (event: Event, href: string, target: Element) => void
	// User clicks on any internal hash link
	hashHandler			?: (event: Event, hash: string, target: Element) => void
	// React dependencies to update scope
	dependencies		?: any[]
}

export function useAnchorGlobalListener(options: TAnchorGlobalListenerOptions) {
	useLayoutEffect(() => {
		return on(document.documentElement, "click", (event: MouseEvent) => {
			// Do not block if user wants to open in a new tab
			if (event.metaKey || event.ctrlKey) return
			// Browse target until we found a link
			const target = getParentNodeOfTag(event.target as HTMLElement, "a")
			if (target == null) return
			// Do not intercept downloads
			if (target.hasAttribute("download")) return
			// Do not intercept links without href
			if (!target.hasAttribute("href") || target.getAttribute("href") === "")
				return
			// Do not intercept links with target
			if (target.hasAttribute("target") && target.getAttribute("target") !== "")
				return
			const href = target.getAttribute("href") ?? ""
			// Do not follow local anchors
			if (href.startsWith("#")) {
				options.hashHandler?.(event, href, target)
				return
			}
			// Not starting with slash ? Not a local relative link.
			if (href.indexOf("/") !== 0) return
			// Do not follow link with browser but follow it with router to keep page
			options.relativeHandler?.(event, href, target)
		})
	}, options.dependencies)
}
