
// ----–----–----–----–----–----–----–----–----–----–----–----–----–----–----–-- EMITTER

// Type of signal handler
export type TEmitterHandler<GHP extends any[], GHR = void | any> = (
	...rest: GHP
) => GHR

export interface IEmitter<GHP extends any[] = any[], GHR = void | any> {
	add: (handler: TEmitterHandler<GHP, GHR>, callAtInit?: GHP) => () => void
	remove: (handler: TEmitterHandler<GHP, GHR>) => void
	dispatch: (...rest: GHP) => GHR[]
	clear: () => void
	readonly listeners: TEmitterHandler<GHP, GHR>[]
}

export function emitter<
	GHP extends any[] = any[],
	GHR = void | any,
>(): IEmitter<GHP, GHR> {
	// List of all registered listeners
	let _listeners: TEmitterHandler<GHP, GHR>[] = []
	// Add / Remove
	function remove(handler: TEmitterHandler<GHP, GHR>) {
		_listeners = _listeners.filter(l => l !== handler)
	}
	function add(handler: TEmitterHandler<GHP, GHR>, callAtInit?: GHP) {
		_listeners.push(handler)
		callAtInit && handler.apply(null, callAtInit)
		return () => remove(handler)
	}
	// Public API
	return {
		add,
		remove,
		dispatch: (...rest) => _listeners.map(listener => listener(...rest)),
		clear() {
			_listeners = []
		},
		get listeners() {
			return _listeners
		},
	}
}
