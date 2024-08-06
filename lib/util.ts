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

export function stringToColor(inputString: string): string {
	// Hash function to convert string to a number
	let hash = 0;
	for (let i = 0; i < inputString.length; i++) {
		const char = inputString.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}

	// Generate vibrant colors across the full hue range
	const hue = Math.abs(hash) % 360; // Allows any hue from 0 to 360

	// Keep saturation and lightness in ranges that ensure the vibe is like the purple color
	const saturation = 50 + Math.abs(hash % 1); // Vibrant saturation, range 75-100%
	const lightness = 40 + Math.abs(hash % 20); // Ensures colors are neither too dark nor too light, range 40-80%

	// Return the HSL color string
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
