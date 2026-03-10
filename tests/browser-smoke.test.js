/**
 * @jest-environment jsdom
 */

const fs = require("node:fs");

test("browser smoke: q() is attached and manipulates DOM", () => {
	document.body.innerHTML = `
		<ul>
			<li class="item first" data-id="1">one</li>
			<li class="item" data-id="2">two</li>
		</ul>
	`;

	window.eval(fs.readFileSync("quentin.js", "utf8"));

	expect(typeof window.q).toBe("function");

	const items = window.q(".item");
	items.addClass("active");

	expect(items.hasClass("active")).toBe(true);
	expect(items.eq(0)[0].className.includes("active")).toBe(true);
	expect(items.eq(99).length).toBe(0);
	expect(items.dataAll("id")).toEqual(["1", "2"]);
});
