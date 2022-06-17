
# Signal

Thin and simple functional event system with strong typing. Inspired from Robert Penner's AS3 Signals.

### Concept

Classic events dispatcher systems are __string based__, which can be difficult to track across your application.

```typescript
document.addEventListener( "which one already ?" );
```

With Signal, every "event" is represented by an __entity__ with `add`, `remove` and `dispatch` methods.
<br>Messages can be dispatched and followed __more fluently__ thanks to its dot notation.

```typescript
const onReady = Signal()
onReady.add( state => {
	console.log( state.ready ) // true
})
onReady.dispatch({
	ready: true
})
```

Signal follow the [__composition over inheritance__](https://en.wikipedia.org/wiki/Composition_over_inheritance) concept of design patterns
to allow highly scalable projects and libraries.


### Remove

Signal handlers can be detached with the remove function, but you need to keep track of the handler's reference.

```tsx
function handler () {
	// Called once
}
signal.add( handler )
signal.dispatch()
// ...
signal.remove( handler ) // dettach listener
signal.dispatch()
```

For convenience and easier usage, when a signal is attached, a remove function is returned.
It allows fast removal of anonymous handlers without having to target it manually. 

```tsx
const removeListener = signal.add(() => {
	// Called once
})
signal.dispatch()
// ...
removeListener() // dettach listener
signal.dispatch()
```

Works well with react hooks :

```tsx
function ReactComponent ( props ) {
	useLayoutEffect(() => {
		// onData.add returns the remove function,
        // so the layoutEffect will remove when component will be destroyed
		return Model.onData.add( data => {
			// 
        })
    }, [])
	return <div></div>
}
```

# State Signal



```tsx
// A class or object which compose a Signal
class MyModel {
	// State type is boolean, generics is optionnal here because state is initialized in constructor
	onReady = StateSignal<[boolean]>( false )
    public data
    // A method which will dispatch the signal and change the state 
    async load () {
        this.data = await fetchData(); // ...
		this.onReady.dispatch( true )
    }
}
// Somewhere else :
const modelInstance = new MyModel();
function dataIsReady () {
	// Will be called when model is ready
	// Will be called once
	// Will be called directly when attached if model is already ready
}
modelInstance.onReady.state ? dataIsReady : modelInstance.onReady.add( )
const listener = modelInstance.onReady.add( isReady => {
	if ( isReady ) {
	    
        console.log( modelInstance.data )
        listener();
    }
})
```