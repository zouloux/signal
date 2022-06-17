import { ISignal, Signal } from "./signal";

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
		dispatch ( state ) {
			_state = state;
			return _signal.dispatch( state )
		},
	}
}