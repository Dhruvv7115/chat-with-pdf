"use client";
import { Cards } from "./cards";
import { TopSection, VoiceVisualizer, LeftSVG, RightSVG } from "./wisprflow";

export default function page() {
	return (
		<div className="flex items-center flex-col justify-start w-full h-screen bg-[rgb(255,255,235)] relative">
			{/* <Cards /> */}
			<TopSection />
			<div className="absolute left-1/2 bottom-28 z-50 flex -translate-x-1/2 flex-col items-center gap-3 bg-[rgb(255,255,235)] rounded-full">
				<div className="flex h-16 w-32 items-center overflow-hidden rounded-full border-2 border-black shadow-sm">
					<VoiceVisualizer />
				</div>
			</div>
			<div className="absolute -left-106 bottom-26 w-7xl">
				<LeftSVG />
			</div>
			<div className="absolute -right-122 bottom-18 w-7xl">
				<RightSVG />
			</div>
		</div>
	);
}
