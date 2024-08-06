import { Section } from "@/lib/epfl";
import React from "react";

export const DisplaySections: React.FC<{ sections: Section[] }> = ({
	sections,
}) => {
	const enac = sections.filter((s) => ["AR", "GC", "SIE"].includes(s));
	const ic = sections.filter((s) => ["IN", "SC"].includes(s));
	const sb = sections.filter((s) => ["CGC", "MA", "PH"].includes(s));
	const sti = sections.filter((s) => ["EL", "GM", "MT", "MX"].includes(s));
	const sv = sections.filter((s) => ["SV"].includes(s));
	return (
		<div
			style={{
				display: "flex",
				fontSize: "0.9em",
				gap: "3px",
				fontWeight: 600,
				margin: "1em 0",
			}}
		>
			{enac.length > 0 && <ColoredGroup color="#ea5e00" sections={enac} />}
			{ic.length > 0 && <ColoredGroup color="#1bb5b5" sections={ic} />}
			{sb.length > 0 && <ColoredGroup color="#007ba5" sections={sb} />}
			{sti.length > 0 && <ColoredGroup color="#8972d5" sections={sti} />}
			{sv.length > 0 && <ColoredGroup color="#5fba01" sections={sv} />}
		</div>
	);
};

const ColoredGroup: React.FC<{ color: string; sections: Section[] }> = ({
	color,
	sections,
}) => {
	return sections.map((s) => (
		<span
			style={{
				color: color,
			}}
		>
			{s}
		</span>
	));
};

// AR GC SIE: #ea5e00
// IN SC: #1bb5b5
// CGC MA PH: ##007ba5
// EL GM MT MX: #8972d5
// SV: #5fba01
