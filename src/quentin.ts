(function () {
	function toArray<T>(value: ArrayLike<T>): T[] {
		return Array.prototype.slice.call(value);
	}

	function quickClone<T>(value: T): T {
		return JSON.parse(JSON.stringify(value));
	}

	type QuentinNode = Element & {
		dataset: DOMStringMap;
		classList: DOMTokenList;
		className: string;
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

	function addClass(
		collection: QuentinNode[],
		name: string,
	): QuentinCollection {
		for (const node of collection) {
			if (toArray(node.classList).indexOf(name) === -1) {
				node.className = toArray(node.classList).concat(name).join(" ");
			}
		}
		return wrapMethods(collection);
	}

	function removeClass(
		collection: QuentinNode[],
		name: string,
	): QuentinCollection {
		for (const node of collection) {
			const classes = toArray(node.classList);
			const index = classes.indexOf(name);
			if (index !== -1) {
				classes.splice(index, 1);
				node.className = classes.join(" ");
			}
		}
		return wrapMethods(collection);
	}

	function hasClass(collection: QuentinNode[], name: string): boolean {
		for (const node of collection) {
			if (toArray(node.classList).indexOf(name) !== -1) {
				return true;
			}
		}
		return false;
	}

	function toggleClass(
		collection: QuentinNode[],
		name: string,
	): QuentinCollection {
		if (hasClass(collection, name)) {
			return removeClass(collection, name);
		}
		return addClass(collection, name);
	}

	function find(
		collection: QuentinNode[],
		selector: string,
	): QuentinCollection {
		let results: QuentinNode[] = [];
		for (const node of collection) {
			results = results.concat(
				toArray(
					node.querySelectorAll(selector) as unknown as ArrayLike<QuentinNode>,
				),
			);
		}
		return wrapMethods(results);
	}

	function first(collection: QuentinNode[]): QuentinCollection {
		if (!collection.length) return wrapMethods([]);
		return wrapMethods(collection.slice(0, 1));
	}

	function last(collection: QuentinNode[]): QuentinCollection {
		if (!collection.length) return wrapMethods([]);
		return wrapMethods(collection.slice(-1));
	}

	function eq(collection: QuentinNode[], index: number): QuentinCollection {
		if (index < 0 || index >= collection.length) {
			return wrapMethods([]);
		}
		return wrapMethods([collection[index]]);
	}

	function data(collection: QuentinNode[], key?: string): unknown {
		const results: unknown[] = [];
		const full = key === undefined;

		for (const node of collection) {
			if (full) {
				if (Object.keys(node.dataset).length > 0) {
					results.push(quickClone(node.dataset));
				}
			} else if (Object.prototype.hasOwnProperty.call(node.dataset, key)) {
				results.push(node.dataset[key]);
			}
		}

		return results.length > 1 ? results : results[0];
	}

	function dataAll(collection: QuentinNode[], key?: string): unknown[] {
		const full = key === undefined;
		const results: unknown[] = [];

		for (const node of collection) {
			if (full) {
				if (Object.keys(node.dataset).length > 0) {
					results.push(quickClone(node.dataset));
				}
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
		if (!collection.length || !collection[0].parentNode) {
			return wrapMethods([]);
		}
		return wrapMethods(
			toArray(
				collection[0].parentNode.children as unknown as ArrayLike<QuentinNode>,
			),
		);
	}

	function parent(collection: QuentinNode[]): QuentinCollection {
		if (!collection.length || !collection[0].parentNode) {
			return wrapMethods([]);
		}
		return wrapMethods(
			toArray([collection[0].parentNode as unknown as QuentinNode]),
		);
	}

	function children(collection: QuentinNode[]): QuentinCollection {
		if (!collection.length) {
			return wrapMethods([]);
		}
		return wrapMethods(
			toArray(collection[0].children as unknown as ArrayLike<QuentinNode>),
		);
	}

	function wrapMethods(collection: QuentinNode[]): QuentinCollection {
		const typedCollection = collection as unknown as QuentinCollection;

		typedCollection.addClass = addClass.bind(null, collection);
		typedCollection.removeClass = removeClass.bind(null, collection);
		typedCollection.hasClass = hasClass.bind(null, collection);
		typedCollection.find = find.bind(null, collection);
		typedCollection.first = first.bind(null, collection);
		typedCollection.last = last.bind(null, collection);
		typedCollection.eq = eq.bind(null, collection);
		typedCollection.data = data.bind(null, collection);
		typedCollection.dataAll = dataAll.bind(null, collection);
		typedCollection.dataOne = dataOne.bind(null, collection);
		typedCollection.siblings = siblings.bind(null, collection);
		typedCollection.parent = parent.bind(null, collection);
		typedCollection.children = children.bind(null, collection);
		typedCollection.toggleClass = toggleClass.bind(null, collection);

		return typedCollection;
	}

	function q(selector: string): QuentinCollection {
		return wrapMethods(
			toArray(
				document.querySelectorAll(
					selector,
				) as unknown as ArrayLike<QuentinNode>,
			),
		);
	}

	(window as unknown as { q: (selector: string) => QuentinCollection }).q = q;
})();
