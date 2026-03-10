const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function makeNode({
	className = "",
	dataset = {},
	children = [],
	query = {},
} = {}) {
	const node = {
		className,
		dataset,
		children,
		parentNode: null,
		_query: query,
		querySelectorAll(selector) {
			return this._query[selector] || [];
		},
	};

	Object.defineProperty(node, "classList", {
		get() {
			if (!node.className.trim()) return [];
			return node.className.trim().split(/\s+/);
		},
	});

	for (const child of children) {
		child.parentNode = node;
	}

	return node;
}

function loadQ(selectorMap) {
	const context = {
		window: {},
		document: {
			querySelectorAll(selector) {
				return selectorMap[selector] || [];
			},
		},
	};

	vm.createContext(context);
	vm.runInContext(fs.readFileSync("quentin.js", "utf8"), context);
	return context.window.q;
}

test("class helpers: add/remove/has/toggle", () => {
	const a = makeNode({ className: "item active" });
	const b = makeNode({ className: "item" });
	const q = loadQ({ ".item": [a, b] });

	expect(q(".item").hasClass("active")).toBe(true);

	q(".item").removeClass("active");
	expect(a.className).toBe("item");

	q(".item").addClass("new");
	expect(a.className.includes("new")).toBe(true);
	expect(b.className.includes("new")).toBe(true);

	q(".item").toggleClass("new");
	expect(q(".item").hasClass("new")).toBe(false);
});

test("find/first/last/eq return expected nodes", () => {
	const li1 = makeNode({ className: "li one" });
	const li2 = makeNode({ className: "li two" });
	const ul = makeNode({ query: { li: [li1, li2] } });

	const q = loadQ({ ul: [ul] });
	const found = q("ul").find("li");

	expect(found.length).toBe(2);
	expect(found.first()[0]).toBe(li1);
	expect(found.last()[0]).toBe(li2);
	expect(found.eq(1)[0]).toBe(li2);
	expect(found.eq(99).length).toBe(0);
});

test("data(key) and data() shapes", () => {
	const a = makeNode({ dataset: { id: "1", label: "" } });
	const b = makeNode({ dataset: { id: "2" } });
	const q = loadQ({ ".row": [a, b] });

	assert.deepEqual(Array.from(q(".row").data("id")), ["1", "2"]);
	expect(q(".row").first().data("label")).toBe("");

	const all = Array.from(q(".row").data()).map((item) =>
		JSON.parse(JSON.stringify(item)),
	);
	expect(Array.isArray(all)).toBe(true);
	assert.deepEqual(all[0], { id: "1", label: "" });
	assert.deepEqual(all[1], { id: "2" });

	assert.deepEqual(Array.from(q(".row").dataAll("id")), ["1", "2"]);
	expect(q(".row").dataOne("id")).toBe("1");
});

test("siblings/parent/children are based on first match", () => {
	const c1 = makeNode({ className: "c1" });
	const c2 = makeNode({ className: "c2" });
	const c3 = makeNode({ className: "c3" });
	const parent = makeNode({ children: [c1, c2, c3] });

	const q = loadQ({ ".child": [c2], ".missing": [] });

	const siblings = q(".child").siblings();
	expect(siblings.length).toBe(3);
	expect(siblings[0]).toBe(c1);
	expect(siblings[1]).toBe(c2);
	expect(siblings[2]).toBe(c3);

	expect(q(".child").parent()[0]).toBe(parent);
	expect(q(".child").parent().children().length).toBe(3);

	expect(q(".missing").siblings().length).toBe(0);
	expect(q(".missing").parent().length).toBe(0);
	expect(q(".missing").children().length).toBe(0);
});
