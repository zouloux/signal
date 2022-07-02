//import { createStateObservable } from "../dist/observable.es2020.mjs"
// const {createStateObservable} = require("../dist/index.es2017.min.cjs")
const {createStateObservable} = require("../dist/observable.es2017.cjs")

const state = createStateObservable( 0 )
state.onChanged.add( e => {
	console.log(e)
})
console.log(state.value)
state.set( 12 )
console.log(state.value)

