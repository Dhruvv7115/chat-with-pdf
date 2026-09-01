"use client";

import React, {
	useEffect,
	useRef,
	useState,
	useCallback,
	useMemo,
} from "react";

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
	squareSize?: number;
	gridGap?: number;
	flickerChance?: number;
	color?: string;
	width?: number;
	height?: number;
	className?: string;
	maxOpacity?: number;
	mobileText?: string;
	tabletText?: string;
	desktopText?: string;
}

export const FlickeringGrid = ({
	squareSize = 2,
	gridGap = 3,
	flickerChance = 0.1,
	color,
	width,
	height,
	className = "",
	maxOpacity = 0.15,
	mobileText = "ChatWithPDF",
	tabletText = "Chat with your PDFs",
	desktopText = "Ask questions. Get answers.",
	...props
}: FlickeringGridProps) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const textMaskRef = useRef<Uint8Array | null>(null);

	const [isInView, setIsInView] = useState(true);
	const [isDark, setIsDark] = useState(true);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	// Watch for theme class changes on <html>
	useEffect(() => {
		const updateTheme = () => {
			setIsDark(document.documentElement.classList.contains("dark"));
		};
		updateTheme();

		const observer = new MutationObserver(updateTheme);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => observer.disconnect();
	}, []);

	const activeColor = useMemo(() => {
		if (color) return color;
		// Use muted zinc/gray rather than extreme foreground/background values
		return isDark ? "#9CA3AF" : "#6B7280";
	}, [color, isDark]);

	const getResponsiveText = useCallback(() => {
		if (typeof window === "undefined") {
			return { text: desktopText, fontSize: 84, fontWeight: 700 };
		}
		if (window.innerWidth < 640) {
			return { text: mobileText, fontSize: 60, fontWeight: 600 };
		}
		if (window.innerWidth < 1024) {
			return { text: tabletText, fontSize: 72, fontWeight: 600 };
		}
		return { text: desktopText, fontSize: 84, fontWeight: 700 };
	}, [mobileText, tabletText, desktopText]);

	// Pre-rasterize the text mask once per resize
	const computeTextMask = useCallback(
		(
			cWidth: number,
			cHeight: number,
			cols: number,
			rows: number,
			dpr: number,
		) => {
			const offCanvas = document.createElement("canvas");
			offCanvas.width = cWidth;
			offCanvas.height = cHeight;
			const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });

			if (!offCtx) return;

			const { text, fontSize, fontWeight } = getResponsiveText();

			if (text) {
				offCtx.save();
				offCtx.scale(dpr, dpr);
				offCtx.fillStyle = "#ffffff";
				offCtx.font = `${fontWeight} ${fontSize}px Geist, -apple-system, BlinkMacSystemFont, sans-serif`;
				offCtx.textAlign = "center";
				offCtx.textBaseline = "middle";
				offCtx.fillText(text, cWidth / (2 * dpr), cHeight / (2 * dpr));
				offCtx.restore();
			}

			const mask = new Uint8Array(cols * rows);
			const step = squareSize + gridGap;

			for (let i = 0; i < cols; i++) {
				for (let r = 0; r < rows; r++) {
					const x = Math.floor(i * step * dpr);
					const y = Math.floor(r * step * dpr);
					const w = Math.max(1, Math.floor(squareSize * dpr));
					const h = Math.max(1, Math.floor(squareSize * dpr));

					const imgData = offCtx.getImageData(x, y, w, h).data;
					let isText = 0;
					for (let k = 0; k < imgData.length; k += 4) {
						if (imgData[k] > 20) {
							isText = 1;
							break;
						}
					}
					mask[i * rows + r] = isText;
				}
			}

			textMaskRef.current = mask;
		},
		[squareSize, gridGap, getResponsiveText],
	);

	const drawGrid = useCallback(
		(
			ctx: CanvasRenderingContext2D,
			cWidth: number,
			cHeight: number,
			cols: number,
			rows: number,
			squares: Float32Array,
			dpr: number,
		) => {
			ctx.clearRect(0, 0, cWidth, cHeight);
			ctx.fillStyle = activeColor;

			const mask = textMaskRef.current;
			const step = (squareSize + gridGap) * dpr;
			const size = squareSize * dpr;

			for (let i = 0; i < cols; i++) {
				for (let r = 0; r < rows; r++) {
					const idx = i * rows + r;
					const isText = mask ? mask[idx] === 1 : false;

					const baseVal = squares[idx];
					const rawAlpha = isText ? Math.min(1, 2.2 * baseVal + 0.15) : baseVal;

					const t = rows > 1 ? r / (rows - 1) : 1;
					const verticalGradient = t * t * (3 - 2 * t);
					const currentAlpha = isText ? rawAlpha : rawAlpha * verticalGradient;

					if (currentAlpha > 0.01) {
						ctx.globalAlpha = currentAlpha;
						ctx.fillRect(i * step, r * step, size, size);
					}
				}
			}

			ctx.globalAlpha = 1.0;
		},
		[activeColor, squareSize, gridGap],
	);

	const setupCanvas = useCallback(
		(canvas: HTMLCanvasElement, w: number, h: number) => {
			const dpr = window.devicePixelRatio || 1;
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(h * dpr);
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;

			const cols = Math.ceil(w / (squareSize + gridGap));
			const rows = Math.ceil(h / (squareSize + gridGap));
			const squares = new Float32Array(cols * rows);

			const minOpacity = 0.08;
			const range = maxOpacity - minOpacity;

			for (let i = 0; i < squares.length; i++) {
				// Start in a tight, calm band
				squares[i] = minOpacity + Math.random() * range;
			}

			computeTextMask(canvas.width, canvas.height, cols, rows, dpr);

			return { cols, rows, squares, dpr };
		},
		[squareSize, gridGap, maxOpacity, computeTextMask],
	);

	const updateSquares = useCallback(
		(squares: Float32Array, delta: number) => {
			// Narrow jitter delta per frame
			const flickerSpeed = flickerChance * delta * 2;
			const minOpacity = 0.08; // Base resting opacity (never drops to pure black/invisible)
			const maxRange = maxOpacity - minOpacity;

			for (let s = 0; s < squares.length; s++) {
				if (Math.random() < flickerSpeed) {
					// Small gentle nudge instead of a 0 -> 100% jump
					const current = squares[s];
					const step = (Math.random() - 0.5) * 0.05; // tiny +/- 0.025 variation
					squares[s] = Math.max(
						minOpacity,
						Math.min(maxOpacity, current + step),
					);
				}
			}
		},
		[flickerChance, maxOpacity],
	);

	useEffect(() => {
		let animId: number;
		let gridData: ReturnType<typeof setupCanvas> | undefined;

		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (!canvas || !container) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const handleResize = () => {
			const w = width || container.clientWidth || window.innerWidth;
			const h = height || container.clientHeight || 250;
			setDimensions({ width: w, height: h });
			gridData = setupCanvas(canvas, w, h);
		};

		handleResize();

		let lastTime = performance.now();
		const renderLoop = (time: number) => {
			if (!isInView || !gridData) return;

			const delta = (time - lastTime) / 1000;
			lastTime = time;

			updateSquares(gridData.squares, delta);
			drawGrid(
				ctx,
				canvas.width,
				canvas.height,
				gridData.cols,
				gridData.rows,
				gridData.squares,
				gridData.dpr,
			);

			animId = requestAnimationFrame(renderLoop);
		};

		const resizeObserver = new ResizeObserver(() => handleResize());
		resizeObserver.observe(container);

		const intersectionObserver = new IntersectionObserver(
			([entry]) => {
				setIsInView(entry.isIntersecting);
			},
			{ threshold: 0 },
		);
		intersectionObserver.observe(canvas);

		animId = requestAnimationFrame(renderLoop);

		return () => {
			cancelAnimationFrame(animId);
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
		};
	}, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

	return (
		<div
			ref={containerRef}
			className={`relative flex h-full w-full items-center justify-center ${className}`}
			{...props}
		>
			<canvas
				ref={canvasRef}
				className="pointer-events-none block"
				style={{
					width: dimensions.width || "100%",
					height: dimensions.height || 250,
				}}
			/>
		</div>
	);
};

export default FlickeringGrid;
