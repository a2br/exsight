import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient().$extends({
	result: {
		university: {
			overseas: {
				needs: {
					regionCode: true,
				},
				compute(data) {
					return data.regionCode !== "EUR";
				},
			},
		},
	},
});

export default prisma;
