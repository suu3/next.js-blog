"use client";

import { motion } from "framer-motion";
import { css, cx } from "@/styled-system/css";

type Props = {
	text: string;
	className?: string;
};

export default function SplitText({ text, className }: Props) {
	return (
		<span
			className={cx(
				css({ display: "inline-flex", alignItems: "center", py: "0.125rem" }),
				className,
			)}
		>
			{text.split("").map((char, index) => (
				<span
					key={`${char}-${index}`}
					className={css({ display: "inline-flex", alignItems: "center" })}
				>
					<span
						className={css({
							display: "inline-block",
							overflow: "hidden",
							color: "var(--text)",
							fontFamily: "var(--y2k-display)",
							fontWeight: "900",
							lineHeight: "1.1",
							pb: "0.08em",
						})}
					>
						<motion.span
							custom={index}
							initial={{ y: "100%" }}
							animate={{
								y: 0,
								transition: {
									delay: index * 0.1,
								},
							}}
							className={css({
								display: "inline-block",
								willChange: "transform",
								ml: char === " " ? "0.25rem" : "0",
							})}
						>
							{char}
						</motion.span>
					</span>
				</span>
			))}
		</span>
	);
}
