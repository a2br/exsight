"use client";

import { sections } from "@/lib/epfl";
import React, { useState } from "react";

import "@/app/register/style.css";
import { BRAND_COLOR } from "@/lib/util";

export const RegisterForm: React.FC = () => {
	let [gpa, setGpa] = useState(4.5);
	let [section, setSection] = useState("MT");
	let [fail, setFail] = useState(false);

	// Stupid hack for localization
	let [trailingDot, setTrailingDot] = useState(false);
	let displayedGpa = gpa.toString() + (trailingDot ? "." : "");
	if (isNaN(gpa)) displayedGpa = "";

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				// Send request
				const res = await fetch("/api/account", {
					method: "POST",
					body: JSON.stringify({ gpa, section, fail }),
				});
				const body = await res.json();
				const status = res.status;

				// Redirect to /
				if (status === 200) {
					window.location.href = "/";
				} else {
					alert("Error: " + body.error);
				}
			}}
		>
			{/* MaN Checkbox */}
			<label className="custom-checkbox">
				<input
					type="checkbox"
					checked={fail}
					onChange={(e) => {
						setFail(e.target.checked);
					}}
				/>
				<span className="checkbox-box"></span>
				<span className="checkbox-label">
					I failed my first attempt: I went through MàN / repeated 1st year
				</span>
			</label>
			{/* Ask for section, (unselectable BA3) & grade */}
			<div className="register-form">
				<select
					name="section"
					id="section"
					value={section}
					onChange={(e) => setSection(e.target.value)}
					required
				>
					{sections.map((s) => (
						<option key={s} value={s}>
							{s}-BA3
						</option>
					))}
				</select>
				{/* Numeric input for grade */}
				<input
					type="text"
					name="gpa"
					id="gpa"
					pattern="[0-9]+([\.|,][0-9]{1,2})?"
					inputMode="decimal"
					// step="any"
					// min="1"
					// max="6"
					value={displayedGpa}
					onChange={(e) => {
						let value = parseFloat(e.target.value.replace(",", "."));
						if (value < 1 || value > 6) return;
						if (e.target.value.endsWith(".") || e.target.value.endsWith(",")) {
							setTrailingDot(true);
						} else {
							setTrailingDot(false);
						}
						setGpa(value);
					}}
					required
				/>
				<button style={{ backgroundColor: BRAND_COLOR }} type="submit">
					&#8209;{">"}
				</button>
			</div>
		</form>
	);
};
