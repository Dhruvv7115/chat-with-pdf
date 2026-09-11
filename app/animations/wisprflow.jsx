import { motion } from "motion/react";

export function Heading() {
	return (
		<h1 className="text-[96px] lg:text-[120px] font-eb tracking-tight text-[rgb(26,26,26)]">
			<span className="text-[#8a8a8a]">Don’t type, </span>
			just speak
		</h1>
	);
}

export function TopSection() {
	return (
		<section className="flex flex-col items-center justify-center mt-54">
			<Heading />
			<SubHeading />
			<DownloadButton />
			<p className="text-[rgba(26,26,26,0.7)] text-sm mt-4">
				Available on Mac, Windows, iPhone, and Android
			</p>
		</section>
	);
}

export function SubHeading() {
	return (
		<p className="text-[20px] text-wrap max-w-120 text-center font-medium tracking-tight text-[rgb(26,26,26)] mt-2">
			<span className="block">The voice-to-text AI that turns speech </span>
			<span>into clear, polished writing in every app.</span>
		</p>
	);
}

const downloadForMacObject = {
	download: ["D", "o", "w", "n", "l", "o", "a", "d", " "],
	for: ["f", "o", "r", " "],
	macOS: ["m", "a", "c", "O", "S"],
};

const waveHoverAnimationVariant = {
	initialState: {
		y: 0,
	},
	hoveredState: {
		y: [-4, 4, 0],
	},
};

function DownloadButton() {
	return (
		<motion.button
			whileHover="hoveredState"
			initial="initialState"
			className="rounded-xl bg-purple-200 flex items-center gap-2.5 justify-center border-2 border-black px-6 py-4 text-base font-semibold mt-6 hover:scale-95 transition-all duration-300"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="18.664"
				fill="currentColor"
				className="bi bi-apple"
				viewBox="0 0 16 16"
			>
				<path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
				<path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
			</svg>
			<div className="flex gap-1">
				<div>
					{downloadForMacObject.download.map((letter, index) => (
						<motion.span
							variants={waveHoverAnimationVariant}
							transition={{
								delay: index * 0.05,
								duration: 1,
								ease: "easeInOut",
							}}
							className="inline-block"
							key={String(index + letter)}
						>
							{letter}
						</motion.span>
					))}
				</div>
				<div>
					{downloadForMacObject.for.map((letter, index) => (
						<motion.span
							variants={waveHoverAnimationVariant}
							transition={{
								delay: (downloadForMacObject.download.length + index) * 0.05,
								duration: 1,
								ease: "anticipate",
							}}
							className="inline-block"
							key={String(index + letter)}
						>
							{letter}
						</motion.span>
					))}
				</div>
				<div>
					{downloadForMacObject.macOS.map((letter, index) => (
						<motion.span
							variants={waveHoverAnimationVariant}
							transition={{
								delay:
									(downloadForMacObject.download.length +
										downloadForMacObject.for.length +
										index) *
									0.05,
								duration: 1,
								ease: "easeInOut",
							}}
							className="inline-block"
							key={String(index + letter)}
						>
							{letter}
						</motion.span>
					))}
				</div>
			</div>
		</motion.button>
	);
}

const GRAPH_SIZE = 28;

export function VoiceVisualizer() {
	const bars = Array.from({ length: GRAPH_SIZE }, (_, index) => index);

	return (
		<div className="relative h-full w-full overflow-hidden">
			<motion.div
				className="flex h-full w-max items-center gap-0.75"
				animate={{ x: ["-50%", "0%"] }}
				transition={{ duration: 8, ease: "linear", repeat: Infinity }}
			>
				{[...bars, ...bars].map((index, key) => (
					<motion.span
						key={key}
						className="block w-0.75 shrink-0 rounded-full bg-black/50"
						animate={{
							height: ["20%", `${30 + (index % 8) * 7}%`, "50%", "10%"],
						}}
						transition={{
							duration: 0.3 + (index % 4) * 0.1,
							ease: "linear",
							repeat: Infinity,
							repeatType: "reverse",
							delay: index * 0.05,
						}}
					/>
				))}
			</motion.div>
		</div>
	);
}

export function LeftSVG() {
	return (
		<svg
			id="hero-svg"
			width="100%"
			className="-z-10"
			height="auto"
			viewBox="0 0 1048 594"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				id="curve1"
				d="M0.597656 50.924805C17.4612 143.2965 97.8522 293.141 284.508 353.548C440.828 399.056 583.839 294.067 500.618 184.7492C417.397 75.4309 238.217 282.098 499.258 441.668C551.913 477.802 817.468 561.26 1046.43 565.235"
				// stroke="red"
			></path>

			<text
				x="-5300"
				fill="#000"
				opacity={0.5}
			>
				<textPath
					id="marquee-text-hero1"
					href="#curve1"
					startOffset="40%"
					textAnchor="last"
				>
					Umm, hope your week has started well…I was talking to Cheyene earlier
					but reception was really bad and I think their going to handle the
					first part of the project, but I’m not totally sure. Also, I told the
					team the the new timeline should be ready by Friday, although it’s
					probably going to slip. There’s been a lot of back and forth and
					honestly the the whole thing’s been kind of chaotic, like nobody
					really knows what’s going on so can you check in with them and see if
					the notes from yesterday’s meeting were sent out, or if they’re still
					waiting. I think Cheyene mentioned it but didn’t confirm, and now I’m
					a little lost.
				</textPath>
				<animate
					id="marquee1-anim"
					attributeName="x"
					dur="35s"
					values="-3300; 0"
					repeatCount="indefinite"
				></animate>
			</text>
		</svg>
	);
}

export function RightSVG() {
	return (
		<svg
			width="100%"
			height="auto"
			viewBox="0 0 1024 620"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				id="curve2"
				d="M2.04309 563.872C111.592 558.268 316.491 554.016 517.963 490.064C703.017 431.323 875.319 444.531 1021.88 453.216"
				stroke="#1A1A1A"
				strokeWidth="26"
			></path>

			<text
				x="-4500"
				fill="rgb(255,255,235)"
			>
				<textPath
					id="marquee-text-hero2"
					href="#curve2"
					startOffset="60%"
					textAnchor="last"
				>
					<tspan dy="6">
						Hope your week is off to a good start. I was talking to Cheyene
						earlier, but the reception was really bad. I think they’re going to
						handle the first part of the project, but I’m not totally sure. I
						also told the team the new timeline should be ready by Friday —
						although it might slip. There’s been a lot of back and forth, and
						honestly, the whole thing has been a bit chaotic. It feels like
						nobody really knows what’s going on. Can you check in with them and
						see if the notes from yesterday’s meeting were sent out, or if
						they’re still waiting? I think Cheyene mentioned it, but didn’t
						confirm — and now I’m a little lost!
					</tspan>
				</textPath>
				<animate
					id="marquee2-anim"
					attributeName="x"
					dur="50s"
					delay="10s"
					values=" -4500; 0"
					repeatCount="indefinite"
				></animate>
			</text>
		</svg>
	);
}
