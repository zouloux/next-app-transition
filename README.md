# Next App Transition

This React hook help creating smooth transition between all pages on **Next 15+** with **App Router** ( Not compatible with legacy router ).
This package is about <picture style="display: inline-block"><source media="(prefers-color-scheme: dark)" srcset="./reports/total-dark.svg"><img src="./reports/total-light.svg"></picture>.
It contains only a hook, you'll have to code your own `PageTransition` component.

## Demo

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


## API and other options

```tsx
import {
  usePreventNextRouter,
  useAnchorGlobalListener,
  onNextRouterTransition
} from "@zouloux/next-app-transition"

// --- USE PREVENT NEXT ROUTER
// Listen for router changes ( push-state events ) and prevent them
const { routerPush, isRouterLocked } = usePreventNextRouter({
  // Locking handler for smooth transitions
  transitionHandler: async (state :boolean) => { /*...*/ },
  // If true, will trigger a full page refresh if the same href is in the push-state event
  reloadOnSameHref: true,
})
// --- ROUTER PUSH
// Trigger a page change to this href on the patched router returned by the hook
routerPush("/new-href")
routerPush("/new-href-with-scroll", { scroll: true })
// Check if router is locked
function anotherFunctionSomewhere () {
	if ( isRouterLocked() ) {
		// Router is locked prevent something related
	}
}

// --- TRANSITION STATE CHANGES
// Be notified when transition state changes
onNextRouterTransition.add( state => {
	// "opening" | "opened" | "closing" | "closed"
})
// The same but in a hook
useEffect(() => {
	// Here the emitter returns the remove function for React hooks
	return onNextRouterTransition.add( state => {
		// ...
	})
}, [dependency])

// --- ANCHOR GLOBAL LISTENER
useAnchorGlobalListener({
  // Called when an <a> link is clicked with a app related href
  relativeHandler: ( event: Event, href: string ) => {
    // Do not follow link with original Next router
    event.preventDefault()
    // Use patched routerPush to change page with custom transition
     routerPush(href)
  },
  hashHandler: ( event: Event, hash: string ) => {
    // Called when an hash link <a href="#hash"> is clicked,
	// same behavior but for hashes
  },
  // React dependencies for those handlers, default is []
  dependencies: [/*...*/]
})
```

## Build and work on the package

```
git clone https://github.com/zouloux/next-app-transition.git
```

##### To run the demo locally

```
npm run demo
```

> This will install npm package and start NextJS


---
## TSP
This package has been created with [tsp](https://github.com/reflex-stack/tsp)
