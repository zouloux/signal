
// TODO v1.1 RC
// -> Better generic types that can leak from dispatch, without generic set at init
// -> Better generic types which respect type order for GHP

// ----------------------------------------------------------------------------- STRUCT

// GHP is Generic Type for Handler Parameters
// GHR is Generic Type for Handler Return

// Type of signal handler
export type TSignalHandler <GHP extends any[], GHR = void|any> = ( ...rest:GHP) => GHR

export interface ISignal <GHP extends any[] = any[], GHR = void|any>
{
	add: ( handler:TSignalHandler<GHP, GHR>, callAtInit?:boolean|GHP ) => () => void
	once: ( handler:TSignalHandler<GHP, GHR> ) => () => void
	remove: ( handler:TSignalHandler<GHP, GHR> ) => void
	dispatch: ( ...rest:GHP ) => GHR[]
	clear: () => void
	readonly listeners: TSignalHandler<GHP, GHR>[]
}

// ----------------------------------------------------------------------------- CLASSIC SIGNAL

export function Signal
	<GHP extends any[] = any[], GHR = void|any>		// Generics
	()												// Parameters
	:ISignal<GHP, GHR>								// Return
{
	// List of attached listeners
	let _listeners = []
	// Remove a listener by its reference
	const remove = ( handler:TSignalHandler<GHP, GHR> ) =>
		_listeners = _listeners.filter( l => l[0] !== handler )
	// Add a listener with once and call at init parameters
	function add ( handler:TSignalHandler<GHP, GHR>, once:boolean, callAtInit:boolean|GHP = false ) {
		// Add listener
		_listeners.push([ handler, once ])
		// Call at init with parameters if callAtInit is an array of parameters
		// Just call without parameters if callAtInit is true
		callAtInit && handler.apply( null, Array.isArray(callAtInit) ? callAtInit : null );
		// Return a handler which will remove this listener
		// Very handy with React hooks like useLayoutEffect
		return () => remove( handler )
	}
	// Return public API
	return {
		// Add and return a remove thunk
		add ( handler:TSignalHandler<GHP, GHR>, callAtInit:boolean|GHP = false ) {
			return add( handler, false, callAtInit )
		},
		// Add once and return a remove thunk
		once ( handler:TSignalHandler<GHP, GHR> ) {
			return add( handler, true )
		},
		remove,
		dispatch: ( ...rest ) => _listeners.map( listener => {
			// Remove listener if this is a once
			listener[1] && remove( listener[0] );
			// Execute with parameters
			return listener[0]( ...rest );
		}),
		clear () { _listeners = [] },
		get listeners () { return _listeners.map( l => l[0] ) }
	}
}