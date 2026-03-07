import Link from "next/link";
import { css } from "@/styled-system/css";

export default function NotFound() {
	return (
		<div
			className={css({
				display: "flex",
				flexDir: "column",
				alignItems: "center",
				justifyContent: "center",
				minH: "60vh",
				textAlign: "center",
				gap: "1.5rem",
			})}
		>
			<h1
				className={css({
					fontSize: { base: "4rem", md: "6rem" },
					fontWeight: "900",
					color: "var(--theme)",
					lineHeight: 1,
				})}
			>
				404
			</h1>
			<h2
				className={css({
					fontSize: { base: "1.5rem", md: "2rem" },
					fontWeight: "700",
				})}
			>
				포스트를 찾을 수 없습니다
			</h2>
			<p
				className={css({
					color: "var(--muted)",
					maxW: "24rem",
					lineHeight: "1.6",
				})}
			>
				찾으시는 페이지가 존재하지 않거나, 주소가 변경되었을 수 있습니다.
				최근 최적화 작업으로 인해 예전 링크(말머리가 포함된 긴 주소)는 더 이상 동작하지 않습니다.
			</p>
			<Link
				href="/"
				className={css({
					mt: "1.5rem",
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					borderRadius: "9999px",
					border: "2px solid var(--line)",
					bg: "var(--theme)",
					color: "white",
					px: "1.5rem",
					py: "0.75rem",
					fontWeight: "700",
					boxShadow: "4px 4px 0 0 var(--line)",
					transition: "all 0.15s ease",
					_hover: {
						transform: "translate(-2px, -2px)",
						boxShadow: "6px 6px 0 0 var(--line)",
						bg: "var(--theme-soft)",
						color: "var(--foreground)",
					},
					_active: {
						transform: "translate(2px, 2px)",
						boxShadow: "0px 0px 0 0 var(--line)",
					},
				})}
			>
				홈으로 돌아가기
			</Link>
		</div>
	);
}
