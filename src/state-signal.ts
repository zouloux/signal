import { ISignal, Signal, TSignalHandler } from "./signal";

// ----------------------------------------------------------------------------- STRUCT

export interface IStateSignal <GHP extends any = any, GHR = void|any> extends ISignal<[GHP], GHR>
{
	dispatch: ( state:GHP ) => GHR[]
	readonly state:GHP
}

// ----------------------------------------------------------------------------- STATE SIGNAL

export function StateSignal
	<GHP extends any = any[], GHR = void|any>				// Generics
	( _state:GHP = null, _signal = Signal<[GHP], GHR>() )	// Parameters
	:IStateSignal<GHP, GHR>									// Return
{
	return {
		..._signal,
		get state () { return _state },
		// Add and return a remove thunk
		add ( handler:TSignalHandler<[GHP], GHR>, callAtInit:boolean = false ) {
			// Call at init will dispatch current state and not a configurable array of props
			return _signal.add( handler, callAtInit === true ? [ _state ] as any : false )
		},
		// Add once and return a remove thunk
		once ( handler:TSignalHandler<[GHP], GHR> ) {
			return _signal.once( handler )
		},
		dispatch ( state ) {
			_state = state;
			return _signal.dispatch( state )
		},
		// Remove listeners and stored state
		clear () {
			_signal.clear();
			_state = null;
		}
	}
}