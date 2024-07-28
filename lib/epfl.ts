export let sections = [
	"AR",
	"GC",
	"SIE",
	"IN",
	"SC",
	"CGC",
	"MA",
	"PH",
	"EL",
	"GM",
	"MT",
	"MX",
	"SV",
] as const;

export type Section = (typeof sections)[number];
