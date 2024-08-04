import { auth } from "@/auth";
import React, { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

// Takes one additional argument, "title"
const FormText: React.FC<Props> = async ({ children }) => {
	return (
		<p
			style={{
				fontSize: "1em",
				marginBottom: "1em",
			}}
		>
			{children}
		</p>
	);
};

export default FormText;
