
# Signal

Thin and simple functional event system with strong typing. Inspired from Robert Penner's AS3 Signals.

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

### Naming things

It's better to name signal prefixed with "on" and with usage of preterit if possible.

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

To clear all listeners. Useful to dispose a signal (can be garbage collected) :

```tsx
onSignal.clear();
```


# State Signal

StateSignal is a Signal addon which holds the last dispatched value.
A StateSignal can be initialized with a default value.

```tsx
const onStateSignal = StateSignal( 12 ) // 12 is the default value here

onStateSignal.add( value => {
	// Is dispatched twice.
	// 1st -> 12
	// 2nd -> 15
	console.log( value )
}, true) // True here means call at init (will call handler when attached)

// Can read state without having to add
if ( onStateSignal.state === 12 )
	onStateSignal.dispatch( 15 ) // Change the state value

```


[//]: # (```tsx)

[//]: # (// A class or object which compose a Signal)

[//]: # (class MyModel {)

[//]: # (	// State type is boolean, generics is optionnal here because state is initialized in constructor)

[//]: # (	onReady = StateSignal<[boolean]>&#40; false &#41;)

[//]: # (    public data)

[//]: # (    // A method which will dispatch the signal and change the state )

[//]: # (    async load &#40;&#41; {)

[//]: # (        this.data = await fetchData&#40;&#41;; // ...)

[//]: # (		this.onReady.dispatch&#40; true &#41;)

[//]: # (    })

[//]: # (})

[//]: # (// Somewhere else :)

[//]: # (const modelInstance = new MyModel&#40;&#41;;)

[//]: # (function dataIsReady &#40;&#41; {)

[//]: # (	// Will be called when model is ready)

[//]: # (	// Will be called once)

[//]: # (	// Will be called directly when attached if model is already ready)

[//]: # (})

[//]: # (modelInstance.onReady.state ? dataIsReady : modelInstance.onReady.add&#40; &#41;)

[//]: # (const listener = modelInstance.onReady.add&#40; isReady => {)

[//]: # (	if &#40; isReady &#41; {)

[//]: # (	    )
[//]: # (        console.log&#40; modelInstance.data &#41;)

[//]: # (        listener&#40;&#41;;)

[//]: # (    })

[//]: # (}&#41;)

[//]: # (```)
