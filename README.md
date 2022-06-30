
# Signal

[//]: # (TODO : Image)

Thin and simple functional event system with strong typing.
Signal size is __![less than 300b](./bits/signal.es2017.min.js.svg)__ with __no external dependencies__.
<br>Inspired from [Robert Penner](https://github.com/robertpenner)'s AS3 Signals.
<br>Source code in Typescript, compiled to ESM & CJS Javascript thanks to [TSBundle](https://github.com/zouloux/tsbundle).
Works in Node and Browser environments.

---
<p align="center">
	<strong>Signal</strong> ➡
	<a href="#concept">Concept</a>&nbsp;/&nbsp;
	<a href="#usage">Usage</a>&nbsp;/&nbsp;
	<a href="#naming-signals">Naming Signals</a>&nbsp;/&nbsp;
	<a href="#remove">Remove</a>
</p>
<p align="center">
	<strong>Going further</strong> ➡
	<a href="#state-signal">State Signal</a>&nbsp;/&nbsp;
	<a href="#observable">Observable</a>
	<a href="#unpkg">Unpkg</a>
</p>

---

### Concept

Classic event dispatcher systems are __string based__, which can be difficult to track across your application.

```typescript
document.addEventListener( "which one already ?", () => {} );
```

With Signal, every event is represented by an __entity__ with `add`, `remove` and `dispatch` methods.
<br>Messages can be dispatched and followed __more fluently__ thanks to its dot notation.

```typescript
const onMessage = Signal()
onMessage.add( message => {
	console.log( message ) // { from: "Michael", content: "Hello !" }
})
onMessage.dispatch({
	from: "Michael",
	content: "Hello !"
})
```

### Usage

Signal follow the [__composition over inheritance__](https://en.wikipedia.org/wiki/Composition_over_inheritance) concept of design patterns
to allow highly scalable projects and libraries. Ne need to extend EventDispatcher again.
Simple example of composition with several Signals :

```typescript
function createMessageSystem () { // No class, no inheritence, no pain
	return {
		// Two events -> two entities, no string used here
		onConnected: Signal<[ Boolean ]>(), // Optional, can pass type of arguments
		onMessage: Signal(), // No type here, so no check of passed object with TS

		connect () {
			// ...
			onConnected.dispatch( true );
		},
		sendMessage ( userName:string, content:string ) {
			// ...
			onMessage.dispatch( { from: userName, content } )
		}
	}
}
const messageSystem = createMessageSystem();
messageSystem.onConnected.once( state => {
	// Called once when connected
})
messageSystem.connect();
messageSystem.onMessage.add( message => {
	console.log( message )
})
messageSystem.sendMessage("Bernie", "Hey")
// ...
messageSystem.sendMessage("Bernie", "What'up ?")

```

### Naming Signals

Signal are object entities which can and should be named correctly.
It's better to name signal prefixed with __"on"__ and with usage of preterit if possible.

```
✅ onMessage
✅ onMessageReceived
🚫 message
🚫 messageReceived
🚫 receiveMessage
---
✅ onConnected
✅ onData
✅ onDataSent
✅ onDataReceived
```

### Remove

Signal handlers can be detached with the remove function, but you need to keep track of the handler's reference.

```tsx
function handler () {
	// Called once
}
onSignal.add( handler )
onSignal.dispatch()
// ...
onSignal.remove( handler ) // dettach listener
onSignal.dispatch()
```

For convenience and easier usage, when a signal is attached, a remove thunk is returned.
It allows fast removal of anonymous handlers without having to target it manually. 

```tsx
const removeListener = onSignal.add(() => {
	// Called once
})
onSignal.dispatch()
// ...
removeListener() // dettach listener without handler ref
onSignal.dispatch()
```

Works well with react hooks :

```tsx
function ReactComponent ( props ) {
	useLayoutEffect(() => {
		// onData.add returns the remove function,
		// so the layoutEffect will remove when component will be destroyed
		return Model.onData.add( data => {
			
		})
	}, [])
	return <div></div>
}
```

To clear all listeners. Useful to dispose a signal and allow garbage collection.

```tsx
onSignal.clear();
```


## State Signal

StateSignal is a kind of Signal which holds the last dispatched value.
A StateSignal can be initialized with a default value.

```tsx
// No need for generics here, state type is gathered from default value
const onStateSignal = StateSignal( 12 ) // 12 is the default value here
console.log(onStateSignal.state) // == 12

onStateSignal.add( value => {
	// Is dispatched twice.
	console.log( value )
	// 1st -> 12 (call at init)
	// 2nd -> 15 (dispatch)
}, true) // True here means "call at init" (will call handler when attached)

// Read and alter state
if ( onStateSignal.state === 12 )
	onStateSignal.dispatch( 15 ) // Change the state value
```


## Observable

Going further with observable

[//]: # (TODO OBSERVABLE DOC)

## Unpkg

Signal is available on [unpkg](https://unpkg.com/) CDN as :
- Only Signal : https://unpkg.com/@zouloux/signal@latest/dist/signal.es2017.min.js ![](./bits/signal.es2017.min.js.svg)
- State-Signal + Signal : https://unpkg.com/@zouloux/signal@latest/dist/state-signal.es2017.min.js
- Observable + Signal : https://unpkg.com/@zouloux/signal@latest/dist/observable.es2017.min.js
- Signal + State-Signal + Observable : https://unpkg.com/@zouloux/signal@latest/dist/index.es2017.min.js ![](./bits/index.es2017.min.js.svg)