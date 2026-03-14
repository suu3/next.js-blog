"use client";

import { motion } from "framer-motion";
import { css, cx } from "@/styled-system/css";

type Props = {
	text: string;
	className?: string;
};

const sparkles = [
	{
		id: "star-a",
		delay: 0.2,
		duration: 1.4,
		containerClassName: css({
			position: "absolute",
			top: "-0.35rem",
			left: "0.2rem",
			display: "block",
			h: "0.8rem",
			w: "0.8rem",
			willChange: "transform, opacity",
			zIndex: 2,
		}),
		colorClassName: css({ bg: "#ff4fd8" }),
		glowClassName: css({ filter: "drop-shadow(0 0 10px #ff4fd8)" }),
	},
	{
		id: "ring-a",
		delay: 1,
		duration: 1.2,
		containerClassName: css({
			position: "absolute",
			top: "-0.15rem",
			right: "1.45rem",
			display: "block",
			h: "0.7rem",
			w: "0.7rem",
			willChange: "transform, opacity",
			zIndex: 2,
		}),
		colorClassName: css({
			border: "2px solid #00dcff",
			boxShadow: "0 0 14px #00dcff",
		}),
	},
	{
		id: "star-b",
		delay: 1.8,
		duration: 1.5,
		containerClassName: css({
			position: "absolute",
			bottom: "-0.05rem",
			right: "0.15rem",
			display: "block",
			h: "0.95rem",
			w: "0.95rem",
			willChange: "transform, opacity",
			zIndex: 2,
		}),
		colorClassName: css({ bg: "#ffe44d" }),
		glowClassName: css({ filter: "drop-shadow(0 0 10px #ffe44d)" }),
	},
	{
		id: "dot-a",
		delay: 2.4,
		duration: 1.1,
		containerClassName: css({
			position: "absolute",
			top: "0.55rem",
			left: "1.55rem",
			display: "block",
			h: "0.35rem",
			w: "0.35rem",
			willChange: "transform, opacity",
			zIndex: 2,
		}),
		colorClassName: css({
			bg: "#39ff88",
			boxShadow: "0 0 14px #39ff88",
		}),
	},
];

export default function SplitText({ text, className }: Props) {
	return (
		<span
			className={cx(
				css({
					position: "relative",
					display: "inline-flex",
					alignItems: "center",
					py: "0.125rem",
				}),
				className,
			)}
		>
			<span
				aria-hidden
				className={css({
					position: "absolute",
					inset: 0,
					pointerEvents: "none",
					overflow: "visible",
				})}
			>
				{sparkles.map((sparkle) => (
					<motion.span
						key={sparkle.id}
						className={sparkle.containerClassName}
						initial={{ opacity: 0, scale: 0.2, rotate: -18 }}
						animate={{
							opacity: [0, 0, 1, 1, 0],
							scale: [0.2, 0.2, 1.25, 0.95, 0],
							rotate: [-18, -18, 12, 28, 36],
						}}
						transition={{
							duration: sparkle.duration,
							delay: sparkle.delay,
							repeat: Infinity,
							repeatDelay: 1.6,
							ease: "easeOut",
						}}
					>
						{sparkle.id.startsWith("ring") ? (
							<span
								className={cx(
									css({
										display: "block",
										h: "full",
										w: "full",
										borderRadius: "full",
									}),
									sparkle.colorClassName,
								)}
							/>
						) : sparkle.id.startsWith("dot") ? (
							<span
								className={cx(
									css({
										display: "block",
										h: "full",
										w: "full",
										borderRadius: "full",
									}),
									sparkle.colorClassName,
								)}
							/>
						) : (
							<span
								className={cx(
									css({
										position: "relative",
										display: "block",
										h: "full",
										w: "full",
									}),
									sparkle.glowClassName,
								)}
							>
								<span
									className={cx(
										css({
											position: "absolute",
											left: "50%",
											top: 0,
											h: "full",
											w: "2px",
											transform: "translateX(-50%)",
											borderRadius: "full",
										}),
										sparkle.colorClassName,
									)}
								/>
								<span
									className={cx(
										css({
											position: "absolute",
											left: 0,
											top: "50%",
											h: "2px",
											w: "full",
											transform: "translateY(-50%)",
											borderRadius: "full",
										}),
										sparkle.colorClassName,
									)}
								/>
								<span
									className={cx(
										css({
											position: "absolute",
											left: "50%",
											top: "50%",
											h: "full",
											w: "2px",
											transform: "translate(-50%, -50%) rotate(45deg)",
											transformOrigin: "center",
											borderRadius: "full",
										}),
										sparkle.colorClassName,
									)}
								/>
								<span
									className={cx(
										css({
											position: "absolute",
											left: "50%",
											top: "50%",
											h: "full",
											w: "2px",
											transform: "translate(-50%, -50%) rotate(-45deg)",
											transformOrigin: "center",
											borderRadius: "full",
										}),
										sparkle.colorClassName,
									)}
								/>
							</span>
						)}
					</motion.span>
				))}
			</span>
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
