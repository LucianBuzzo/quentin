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

	type QuentinCollection = QuentinNode[] & { [key: string]: any };

	function addClass(
		collection: QuentinNode[],
		name: string,
	): QuentinCollection {
		collection.forEach((node) => {
			if (toArray(node.classList).indexOf(name) === -1) {
				node.className = toArray(node.classList).concat(name).join(" ");
			}
		});
		return wrapMethods(collection);
	}

	function removeClass(
		collection: QuentinNode[],
		name: string,
	): QuentinCollection {
		collection.forEach((node) => {
			const classes = toArray(node.classList);
			const index = classes.indexOf(name);
			if (index !== -1) {
				classes.splice(index, 1);
				node.className = classes.join(" ");
			}
		});
		return wrapMethods(collection);
	}

	function hasClass(collection: QuentinNode[], name: string): boolean {
		let exists = false;
		for (let i = 0; i < collection.length; i += 1) {
			if (toArray(collection[i].classList).indexOf(name) !== -1) {
				exists = true;
				break;
			}
		}
		return exists;
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
		collection.forEach((node) => {
			results = results.concat(
				toArray(
					node.querySelectorAll(selector) as unknown as ArrayLike<QuentinNode>,
				),
			);
		});
		return wrapMethods(results);
	}

	function first(collection: QuentinNode[]): QuentinCollection {
		return wrapMethods(collection.slice(0, 1));
	}

	function last(collection: QuentinNode[]): QuentinCollection {
		return wrapMethods(collection.slice(-1));
	}

	function eq(collection: QuentinNode[], index: number): QuentinCollection {
		return wrapMethods([collection[index]]);
	}

	function data(collection: QuentinNode[], key?: string): unknown {
		const results: unknown[] = [];
		const full = key === undefined;

		collection.forEach((node) => {
			if (full) {
				if (Object.keys(node.dataset).length > 0) {
					results.push(quickClone(node.dataset));
				}
			} else if (Object.prototype.hasOwnProperty.call(node.dataset, key)) {
				results.push(node.dataset[key]);
			}
		});

		return results.length > 1 ? results : results[0];
	}

	function siblings(collection: QuentinNode[]): QuentinCollection {
		return wrapMethods(
			toArray(
				collection[0].parentNode.children as unknown as ArrayLike<QuentinNode>,
			),
		);
	}

	function parent(collection: QuentinNode[]): QuentinCollection {
		return wrapMethods(
			toArray([collection[0].parentNode as unknown as QuentinNode]),
		);
	}

	function children(collection: QuentinNode[]): QuentinCollection {
		return wrapMethods(
			toArray(collection[0].children as unknown as ArrayLike<QuentinNode>),
		);
	}

	function wrapMethods(collection: QuentinNode[]): QuentinCollection {
		const typedCollection = collection as QuentinCollection;

		typedCollection.addClass = addClass.bind(null, collection);
		typedCollection.removeClass = removeClass.bind(null, collection);
		typedCollection.hasClass = hasClass.bind(null, collection);
		(typedCollection as unknown as Record<string, unknown>).find = find.bind(
			null,
			collection,
		);
		typedCollection.first = first.bind(null, collection);
		typedCollection.last = last.bind(null, collection);
		typedCollection.eq = eq.bind(null, collection);
		typedCollection.data = data.bind(null, collection);
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
