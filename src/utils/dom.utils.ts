// ----–----–----–----–----–----–----–----–----–----–----–----–----–----–----–-- FAST EVENT LISTENER
type AllEventMap = WindowEventMap & HTMLElementEventMap

// Listen to an event and return its destructor.
// Allows 1 line event listening in React hooks
export function on<K extends keyof AllEventMap>(
	target: Window | Element,
	event: K,
	handler: (event: AllEventMap[K]) => any,
	capture: boolean = false,
) {
	const options = { capture }
	target.addEventListener(event, handler as EventListener, options)
	return () =>
		target.removeEventListener(event, handler as EventListener, options)
}

// ----–----–----–----–----–----–----–----–----–----–----–----–----–----–----–-- GET PARENT OF TAG

export function getParentNodeOfTag(element: Element, tag: string) {
	const root = document.body
	while (
		element != null &&
		element.tagName?.toLowerCase() !== tag &&
		element != root
	) {
		element = element.parentElement as Element
	}
	return element
}
