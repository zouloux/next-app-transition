import { useEffect, useLayoutEffect, useRef } from "react"
import { emitter, on } from "./utils/index.js"
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime.js"
import { usePathname, useRouter } from "next/navigation.js"

// ----------------------------------------------------------------------------- EMITTER
// Allows any part of the app to know the current state of transition
// onNextRouterTransition.add( state => { ... } )

// All types of transition step
// On closed, transition is not visible and app is running
// All other states should prevent interactions with the application
type TTransitionSteps = "opening" | "opened" | "closing" | "closed"

// Listen when transition is started or finished
export const onNextRouterTransition = emitter<[TTransitionSteps]>()


// ----------------------------------------------------------------------------- PREVENT NEXT ROUTER

const removeTrailingSlash = (str: string) =>
	str.lastIndexOf("/") === str.length - 1 ? str.slice(0, str.length - 1) : str

type TPopStateAction = "transition" | "next" | "prevent"

type TUsePreventNextRouterOptions = {
	transitionHandler: (state: boolean) => Promise<any>
	reloadOnSameHref?: boolean
	routerPushWhileLocked?: (href?: string) => void
	doTransitionOnPopstate?: (newHref:string, oldHref:string) => TPopStateAction
}

/**
 * Capture native popstate events and prevent them, before Next can handle them.
 * Handler is called and awaited to animate, then router is pushed with the waiting popstate.
 * @param options.transitionHandler With state of transition ( true = hide UI / false = show UI )
 * @param options.reloadOnSameHref If pushed href is the same as the current one, force a window reload
 * @param options.routerPushWhileLocked Called when router is pushed while transition is locked.
 * @param options.doTransitionOnPopstate Define and return prevent a page transition
 */
export function usePreventNextRouter(options: TUsePreventNextRouterOptions) {
	const { transitionHandler } = options
	const reloadOnSameHref = options.reloadOnSameHref ?? false

	const router = useRouter()
	const pathname = usePathname()

	const pathNameChangeHandler = useRef<() => void>(null)

	// Router changes have to be locked while
	const isLocked = useRef(false)

	const hasPendingRouterPush = useRef(false)

	const currentHash = useRef(
		typeof window === "undefined" ? null : location.hash,
	)
	const currentPathname = useRef(pathname) // directly from state

	const isRouterLocked = () => isLocked.current

	// When router's pathname changes, we unlock transitioning out
	useEffect(() => {
		if (pathNameChangeHandler.current) {
			pathNameChangeHandler.current()
			pathNameChangeHandler.current = null
		}
	}, [pathname])

	// Push safely a new router push, with the transition handler called
	// If router is locked ( already transitioning ),
	// therefore the push is not handled
	async function routerPush(
		href?: string,
		navigateOptions?: NavigateOptions,
	): Promise<boolean> {
		// Lock
		if (isLocked.current) {
			options.routerPushWhileLocked?.(href)
			hasPendingRouterPush.current = true
			return false
		}
		if (href && href.startsWith("#")) return false
		const reloadingSamePath =
			href && removeTrailingSlash(href) === removeTrailingSlash(pathname)
		// Same href and reload
		if (reloadingSamePath && reloadOnSameHref) {
			location.reload()
			return false
		}
		isLocked.current = true
		// Transition ( hide UI )
		onNextRouterTransition.dispatch("opening")
		await transitionHandler(true)
		onNextRouterTransition.dispatch("opened")
		// Send router push for Next
		if (!reloadingSamePath || reloadOnSameHref) {
			router.push(href ?? location.pathname, {
				scroll: false,
				...navigateOptions,
			})
			// Wait for the router's pathname to change to transition out
			pathNameChangeHandler.current?.()
			if (hasPendingRouterPush.current) {
				hasPendingRouterPush.current = false
			} else {
				await new Promise<void>(
					resolve => (pathNameChangeHandler.current = resolve),
				)
			}
		}
		// Unlock
		isLocked.current = false
		// Transition ( show UI )
		onNextRouterTransition.dispatch("closing")
		await transitionHandler(false)
		onNextRouterTransition.dispatch("closed")
		//
		return true
	}

	async function popStateCaptureHandler(event: PopStateEvent) {
		// Hash changed, do not play transition
		const newHash = location.hash
		if (newHash !== currentHash.current) return
		currentHash.current = newHash
		// Path changed, play transition
		const newPathname = location.pathname
		// console.log( newPathname, currentPathname.current, newPathname === currentPathname.current );
		if (newPathname === currentPathname.current) return
		currentPathname.current = newPathname
		// Get action to do on pop state from options or default behavior ( run custom transition )
		const action:TPopStateAction = (
			options.doTransitionOnPopstate?.(newPathname, currentPathname.current)
			?? "transition"
		)
		// Use native next transition
		if ( action === "next" )
			return;
		// Stop original route change
		if ( action === "prevent" || action === "transition" ) {
			event.preventDefault()
			event.stopPropagation()
			event.stopImmediatePropagation()
		}
		// Change route with transition
		if ( action === "transition" ) {
			await routerPush()
		}
	}

	useLayoutEffect(
		() => on(window, "popstate", popStateCaptureHandler, true),
		[], // cannot use pathname as dependency for obscure reason ( popstate does not work anymore )
	)

	return { isRouterLocked, routerPush }
}
