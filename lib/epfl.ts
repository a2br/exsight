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

export const sectionColor = (section: Section): string => {
	switch (section) {
		case "AR":
		case "GC":
		case "SIE":
			return "#ea5e00";
		case "IN":
		case "SC":
			return "#1bb5b5";
		case "CGC":
		case "MA":
		case "PH":
			return "#007ba5";
		case "EL":
		case "GM":
		case "MT":
		case "MX":
			return "#8972d5";
		case "SV":
			return "#5fba01";
	}
};
