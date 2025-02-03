# Next App Transition

This React hook help creating smooth transition between all pages on **Next 15+** with **App Router** ( Not compatible with legacy router ).
This package is about <picture style="display: inline-block"><source media="(prefers-color-scheme: dark)" srcset="./reports/total-dark.svg"><img src="./reports/total-light.svg"></picture>.
It contains only a hook, you'll have to code your own `PageTransition` component.

See the demo running [here on StackBlitz](https://stackblitz.com/~/github.com/zouloux/next-app-transition)

## Install

`npm i @zouloux/next-app-transition`

## Basic usage

Here is the minimal code needed to patch the Next router and hook for smooth transitions.

```tsx
"use client"
import { usePreventNextRouter } from "@zouloux/next-app-transition"

export function PageTransition () {
	async function animateTransition (state: boolean) {
		// ... animate here
	}
	usePreventNextRouter({
		// Called when router wants to change page
		// It can be triggered from a push-state event
		transitionHandler: async (state: boolean) => {
			// Code your async transition here with state.
		  	// If true, enable transition panel, if false, disable transition panel
		  	// Please note that router is locked while handler's promise is not complete
		  	// Ex :
		  	await animateTransition( state ) // .4s animation
		}
	})
	return <div>{/* transition elements */}</div>
}
```

## Usage with anchor global listener

Anchor global listener will listen all `<a>` elements on the page, and check if they point to a local
next URL. If so, it can trigger the animation.

```tsx
"use client"
import { usePreventNextRouter, useAnchorGlobalListener } from "@zouloux/next-app-transition"

export function PageTransition () {
	async function transitionHandler (state: boolean) {
		// ... animate here
	}
	// Export patched router push, which triggers animations when called
	const { routerPush } = usePreventNextRouter({ transitionHandler })
	// Listen for all <a> clicks to override default Next's behavior
	useAnchorGlobalListener({
		// User clicks on any internal and relative link
		relativeHandler: (event, href) => {
			// Prevent native browser navigation
			event.preventDefault()
			// Use patched routerPush to change page with custom transition
			routerPush(href)
		},
	})
	return <div>{/* transition elements */}</div>
}
```

> Check [PageTransition.tsx](./demo/components/PageTransition.tsx) source code in the demo


---
## TSP
This package has been created with [tsp](https://github.com/reflex-stack/tsp)
