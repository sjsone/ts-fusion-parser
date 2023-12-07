import test from "ava";
import { P, parseEel } from "../testHelper.mjs";
import { ObjectNode } from "../../out/dsl/eel/nodes/ObjectNode.js";
import { ObjectPathNode } from "../../out/dsl/eel/nodes/ObjectPathNode.js";
import { ObjectFunctionPathNode } from "../../out/dsl/eel/nodes/ObjectFunctionPathNode.js";
import { ObjectOffsetAccessPathNode } from "../../out/dsl/eel/nodes/ObjectOffsetAccessPathNode.js";
import { LiteralStringNode } from "../../out/dsl/eel/nodes/LiteralStringNode.js";
import { LiteralNumberNode } from "../../out/dsl/eel/nodes/LiteralNumberNode.js";
import { TernaryOperationNode } from "../../out/dsl/eel/nodes/TernaryOperationNode.js";
import { LiteralBooleanNode } from "../../out/dsl/eel/nodes/LiteralBooleanNode.js";
import { LiteralNullNode } from "../../out/dsl/eel/nodes/LiteralNullNode.js";
import { LiteralArrayNode } from "../../out/dsl/eel/nodes/LiteralArrayNode.js";
import { LiteralObjectNode } from "../../out/dsl/eel/nodes/LiteralObjectNode.js";
import { LiteralObjectEntryNode } from "../../out/dsl/eel/nodes/LiteralObjectEntryNode.js";
import { CallbackNode } from "../../out/dsl/eel/nodes/CallbackNode.js";
import { OperationNode } from "../../out/dsl/eel/nodes/OperationNode.js";

test('EEL: Literal string double quotes', t => {
	const parsed = parseEel(`"str"`)
	t.deepEqual(parsed, new LiteralStringNode(`"str"`, P(0, 5)))
	t.is(parsed["quotationType"], `"`, "quotation Type is wrong")
})

test('EEL: Literal string single quotes', t => {
	const parsed = parseEel(`'str'`)
	t.deepEqual(parsed, new LiteralStringNode(`'str'`, P(0, 5)))
	t.is(parsed["quotationType"], `'`, "quotation Type is wrong")
})

test('EEL: Literal number', t => {
	const parsed = parseEel(`1`)
	t.deepEqual(parsed, new LiteralNumberNode(`1`, P(0, 1)))
})

test('EEL: Literal null', t => {
	const parsed = parseEel(`null`)
	t.deepEqual(parsed, new LiteralNullNode(`null`, P(0, 4)))
})

test('EEL: Literal boolean true', t => {
	const parsed = parseEel(`true`)
	t.deepEqual(parsed, new LiteralBooleanNode(`true`, P(0, 4)))
})

test('EEL: Literal boolean false', t => {
	const parsed = parseEel(`false`)
	t.deepEqual(parsed, new LiteralBooleanNode(`false`, P(0, 5)))
})

test('EEL: Literal array simple', t => {
	const parsed = parseEel(`[1,2,3]`)
	t.deepEqual(parsed, new LiteralArrayNode([
		new LiteralNumberNode('1', P(1, 2)),
		new LiteralNumberNode('2', P(3, 4)),
		new LiteralNumberNode('3', P(5, 6)),
	], P(0, 7)))
})

test('EEL: Literal array complex', t => {
	const parsed = parseEel(`[1,[2,[3,[4]]]]`)
	t.deepEqual(parsed, new LiteralArrayNode([
		new LiteralNumberNode('1', P(1, 2)),
		new LiteralArrayNode([
			new LiteralNumberNode('2', P(4, 5)),
			new LiteralArrayNode([
				new LiteralNumberNode('3', P(7, 8)),
				new LiteralArrayNode([
					new LiteralNumberNode('4', P(10, 11)),
				], P(9, 12))
			], P(6, 13))
		], P(3, 14))
	], P(0, 15)))
})

test('EEL: Literal object simple', t => {
	const parsed = parseEel(`{'a': 'AAA', 'b': 'BBB'}`)
	t.deepEqual(parsed, new LiteralObjectNode([
		new LiteralObjectEntryNode(
			new LiteralStringNode("'a'", P(1, 4)),
			new LiteralStringNode("'AAA'", P(6, 11)),
			P(1, 11)
		),
		new LiteralObjectEntryNode(
			new LiteralStringNode("'b'", P(13, 16)),
			new LiteralStringNode("'BBB'", P(18, 23)),
			P(13, 23)
		),
	], P(0, 24)))
})

test('EEL: Literal object complex', t => {
	const parsed = parseEel(`{'a': 'AAA', 'b': {'c': 'CCC'}}`)
	t.deepEqual(parsed, new LiteralObjectNode([
		new LiteralObjectEntryNode(
			new LiteralStringNode("'a'", P(1, 4)),
			new LiteralStringNode("'AAA'", P(6, 11)),
			P(1, 11)
		),
		new LiteralObjectEntryNode(
			new LiteralStringNode("'b'", P(13, 16)),
			new LiteralObjectNode([
				new LiteralObjectEntryNode(
					new LiteralStringNode("'c'", P(19, 22)),
					new LiteralStringNode("'CCC'", P(24, 29)),
					P(19, 29)
				)
			], P(18, 30)),
			P(13, 30)
		),
	], P(0, 31)))
})



test('EEL: Throw on empty EEL', t => {
	try {
		parseEel("")
		t.fail('-> Did not throw on empty EEL')
	} catch (error) {
		t.pass()
	}
})

test('EEL: simple object', t => {
	const parsed = parseEel("props")
	t.deepEqual(parsed, new ObjectNode([new ObjectPathNode('props', P(0, 5))], P(0, 5)))
})

test('EEL: object with three path nodes', t => {
	const parsed = parseEel('one.two.three')
	t.deepEqual(parsed, new ObjectNode([
		new ObjectPathNode('one', P(0, 3)),
		new ObjectPathNode('two', P(4, 7)),
		new ObjectPathNode('three', P(8, 13))
	], P(0, 13)))
})

test('EEL: complex object with function and array offset', t => {
	const parsed = parseEel('one.two.func(1)["protected"].four')
	t.deepEqual(parsed, new ObjectNode([
		new ObjectPathNode('one', P(0, 3)),
		new ObjectPathNode('two', P(4, 7)),
		new ObjectFunctionPathNode(
			'func',
			[new LiteralNumberNode('1', P(13, 14))],
			P(8, 15),
			undefined,
			new ObjectOffsetAccessPathNode(
				new LiteralStringNode('"protected"', P(16, 27)),
				P(15, 28)
			)
		),
		new ObjectPathNode('four', P(29, 33)),
	], P(0, 33)))
})

test('EEL: simple callback', t => {
	const eel = `test.run(a => a + '_b')`
	const parsed = parseEel(eel)
	t.deepEqual(parsed, new ObjectNode([
		new ObjectPathNode('test', P(0, 4)),
		new ObjectFunctionPathNode('run', [
			new CallbackNode("a =>", new OperationNode(
				new ObjectNode([new ObjectPathNode('a', P(14, 15))], P(14, 16)),
				'+',
				new LiteralStringNode(`'_b'`, P(18, 22)),
				P(16, 22)
			), P(9, 22))
		], P(5, 23))
	], P(0, 23)))
})

test('EEL: simple ternary', t => {
	const parsed = parseEel(`true ? "true" : "false"`)
	t.deepEqual(parsed, new TernaryOperationNode(
		new LiteralBooleanNode('true', P(0, 4)),
		new LiteralStringNode(`"true"`, P(7, 13)),
		new LiteralStringNode(`"false"`, P(16, 23)),
		P(5, 23)
	))
})