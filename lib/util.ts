// Sort database documents by aligning them to the given array of IDs
export function sortDocs<T extends { id: U }, U>(docs: T[], model: U[]): T[] {
	let sorted: T[] = [];
	for (let id of model) {
		let doc = docs.find((d) => d.id === id);
		if (doc) sorted.push(doc);
	}
	return sorted;
}

export const BRAND_COLOR = "#00A79F";
