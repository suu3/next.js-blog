import { css } from "@/styled-system/css";

const accentBadgeClasses = [
	css({ backgroundColor: "#ff5a36", color: "white" }),
	css({ backgroundColor: "#39ff14", color: "#111111" }),
	css({ backgroundColor: "#ff2ea6", color: "white" }),
	css({ backgroundColor: "#1e6bff", color: "white" }),
	css({ backgroundColor: "#00e5ff", color: "#111111" }),
	css({ backgroundColor: "#ffe600", color: "#111111" }),
	css({ backgroundColor: "#8b5cf6", color: "white" }),
	css({ backgroundColor: "#ff7a00", color: "#111111" }),
	css({ backgroundColor: "#00ff85", color: "#111111" }),
	css({ backgroundColor: "#ff1744", color: "white" }),
	css({ backgroundColor: "#00b0ff", color: "#111111" }),
	css({ backgroundColor: "#ff00d4", color: "white" }),
];

export function getAccentBadgeClass(
	label: string,
	orderedLabels: readonly string[],
) {
	const uniqueLabels = Array.from(new Set(orderedLabels));
	const index = uniqueLabels.indexOf(label);
	return accentBadgeClasses[(index === -1 ? 0 : index) % accentBadgeClasses.length];
}
