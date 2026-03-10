(function () {
	type QuentinNode = Element & {
		dataset: DOMStringMap;
		classList: DOMTokenList;
		parentNode: ParentNode & { children: HTMLCollection };
		children: HTMLCollection;
		querySelectorAll(selector: string): NodeListOf<Element>;
	};

	type QuentinCollectionMethods = {
		addClass(name: string): QuentinCollection;
		removeClass(name: string): QuentinCollection;
		hasClass(name: string): boolean;
		find(selector: string): QuentinCollection;
		first(): QuentinCollection;
		last(): QuentinCollection;
		eq(index: number): QuentinCollection;
		data(key?: string): unknown;
		dataAll(key?: string): unknown[];
		dataOne(key?: string): unknown;
		siblings(): QuentinCollection;
		parent(): QuentinCollection;
		children(): QuentinCollection;
		toggleClass(name: string): QuentinCollection;
	};

	type QuentinCollection = Omit<QuentinNode[], "find"> &
		QuentinCollectionMethods;

	const toArray = <T>(value: ArrayLike<T>): T[] =>
		Array.prototype.slice.call(value);

	const cloneDataset = (
		dataset: DOMStringMap,
	): Record<string, string | undefined> => ({
		...dataset,
	});

	function addClass(
		collection: QuentinNode[],
		name: string,
	): QuentinCollection {
		for (const node of collection) node.classList.add(name);
		return wrapMethods(collection);
	}

	function removeClass(
		collection: QuentinNode[],
		name: string,
	): QuentinCollection {
		for (const node of collection) node.classList.remove(name);
		return wrapMethods(collection);
	}

	function hasClass(collection: QuentinNode[], name: string): boolean {
		for (const node of collection)
			if (node.classList.contains(name)) return true;
		return false;
	}

	function toggleClass(
		collection: QuentinNode[],
		name: string,
	): QuentinCollection {
		return hasClass(collection, name)
			? removeClass(collection, name)
			: addClass(collection, name);
	}

	function find(
		collection: QuentinNode[],
		selector: string,
	): QuentinCollection {
		let results: QuentinNode[] = [];
		for (const node of collection) {
			results = results.concat(
				toArray(node.querySelectorAll(selector) as ArrayLike<QuentinNode>),
			);
		}
		return wrapMethods(results);
	}

	function first(collection: QuentinNode[]): QuentinCollection {
		return wrapMethods(collection.length ? collection.slice(0, 1) : []);
	}

	function last(collection: QuentinNode[]): QuentinCollection {
		return wrapMethods(collection.length ? collection.slice(-1) : []);
	}

	function eq(collection: QuentinNode[], index: number): QuentinCollection {
		return wrapMethods(
			index >= 0 && index < collection.length ? [collection[index]] : [],
		);
	}

	function data(collection: QuentinNode[], key?: string): unknown {
		const results = dataAll(collection, key);
		return results.length > 1 ? results : results[0];
	}

	function dataAll(collection: QuentinNode[], key?: string): unknown[] {
		const full = key === undefined;
		const results: unknown[] = [];
		for (const node of collection) {
			if (full) {
				if (Object.keys(node.dataset).length)
					results.push(cloneDataset(node.dataset));
			} else if (Object.prototype.hasOwnProperty.call(node.dataset, key)) {
				results.push(node.dataset[key]);
			}
		}
		return results;
	}

	function dataOne(collection: QuentinNode[], key?: string): unknown {
		return dataAll(collection, key)[0];
	}

	function siblings(collection: QuentinNode[]): QuentinCollection {
		if (!collection.length || !collection[0].parentNode) return wrapMethods([]);
		return wrapMethods(
			toArray(
				collection[0].parentNode.children as unknown as ArrayLike<QuentinNode>,
			),
		);
	}

	function parent(collection: QuentinNode[]): QuentinCollection {
		if (!collection.length || !collection[0].parentNode) return wrapMethods([]);
		return wrapMethods([collection[0].parentNode as unknown as QuentinNode]);
	}

	function children(collection: QuentinNode[]): QuentinCollection {
		if (!collection.length) return wrapMethods([]);
		return wrapMethods(
			toArray(collection[0].children as unknown as ArrayLike<QuentinNode>),
		);
	}

	function wrapMethods(collection: QuentinNode[]): QuentinCollection {
		const c = collection as unknown as QuentinCollection;
		c.addClass = addClass.bind(null, collection);
		c.removeClass = removeClass.bind(null, collection);
		c.hasClass = hasClass.bind(null, collection);
		c.find = find.bind(null, collection);
		c.first = first.bind(null, collection);
		c.last = last.bind(null, collection);
		c.eq = eq.bind(null, collection);
		c.data = data.bind(null, collection);
		c.dataAll = dataAll.bind(null, collection);
		c.dataOne = dataOne.bind(null, collection);
		c.siblings = siblings.bind(null, collection);
		c.parent = parent.bind(null, collection);
		c.children = children.bind(null, collection);
		c.toggleClass = toggleClass.bind(null, collection);
		return c;
	}

	function q(selector: string): QuentinCollection {
		return wrapMethods(
			toArray(document.querySelectorAll(selector) as ArrayLike<QuentinNode>),
		);
	}

	(window as unknown as { q: (selector: string) => QuentinCollection }).q = q;
})();
