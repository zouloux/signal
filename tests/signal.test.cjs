
// FIXME : How to have typescript working here ?
// @ts-check
/** @typedef { import('../dist/signal.d.ts').Signal } Signal */
/** @type Signal */
const { Signal } = require("../dist/index.es2017.cjs")
const { test } = require("@solid-js/cli")

/**
 * TODO : CLI - Improve test lib
 * 	- Type it and assert handlers
 * 	- Have multiple assertions possible ( see "Should have arguments")
 * 	- Better console login, no more progress, show the shoulds
 */

test("Signal", async it => {
	await it('Should dispatch', async assert => {
		const signal = Signal()
		let dispatched = false
		signal.add(() => { dispatched = true })
		signal.dispatch()
		assert( dispatched )
		signal.clear();
	})
	await it('Should dispatch and remove', async assert => {
		const signal = Signal()
		let dispatchedCount = 0
		signal.dispatch()
		const remove = signal.add(() => { dispatchedCount ++ })
		signal.dispatch()
		signal.dispatch()
		remove()
		signal.dispatch()
		signal.dispatch()
		assert( dispatchedCount === 2 )
		signal.clear();
	})
	await it('Should have arguments', async assert => {
		const signal = Signal()
		// We know dispatch works here so we can assert into the handler without fear of infinite script
		signal.add( (a, b, c) => {
			assert( a === "test" && b === 5 && c === undefined )
			// assert( [a, b, c], '==', ['test', b, c] ) // FIXME
			signal.clear();
		})
		signal.dispatch("test", 5)
	})
	await it('Should clear', async assert => {
		const signal = Signal()
		let dispatchCount = 0
		signal.add( () => { dispatchCount ++ } )
		signal.dispatch()
		signal.clear();
		signal.dispatch()
		assert( dispatchCount === 1 )
	})
})
