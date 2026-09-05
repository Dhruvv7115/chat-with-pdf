"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface ScrollSpyContextType {
	activeSection: string;
	setActiveSection: (id: string) => void;
	scrollToSection: (id: string) => void;
}

const ScrollSpyContext = createContext<ScrollSpyContextType>({
	activeSection: "hero",
	setActiveSection: () => {},
	scrollToSection: () => {},
});

export const useScrollSpy = () => useContext(ScrollSpyContext);

export function ScrollSpyProvider({
	children,
	defaultSection = "hero",
}: {
	children: React.ReactNode;
	defaultSection?: string;
}) {
	const [activeSection, setActiveSectionState] =
		useState<string>(defaultSection);
	const isProgrammaticScroll = useRef(false);
	const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

	// Guard setActiveSection so scroll events during a click jump don't overwrite it
	const setActiveSection = (id: string) => {
		if (isProgrammaticScroll.current) return;
		setActiveSectionState(id);
	};

	const scrollToSection = (id: string) => {
		const cleanId = id.replace(/^#/, "");
		const el = document.getElementById(cleanId);
		if (!el) return;

		// 1. Immediately set active section & lock observer
		isProgrammaticScroll.current = true;

		// 2. Perform the scroll
		const navbarOffset = 90;
		const targetPosition =
			el.getBoundingClientRect().top + window.pageYOffset - navbarOffset;
		const startPosition = window.pageYOffset;
		const distance = targetPosition - startPosition;
		const duration = 400;
		let start: number | null = null;

		const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

		const step = (timestamp: number) => {
			if (!start) start = timestamp;
			const progress = Math.min((timestamp - start) / duration, 1);
			window.scrollTo(0, startPosition + distance * easeOutExpo(progress));

			if (progress < 1) {
				window.requestAnimationFrame(step);
			} else {
				// 3. Unlock observer once scrolling completes
				if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
				scrollTimeout.current = setTimeout(() => {
					isProgrammaticScroll.current = false;
				}, 100);
			}
		};

		window.requestAnimationFrame(step);
	};

	// scroll-spy-context.tsx — add this alongside your existing scrollToSection
	useEffect(() => {
		if (typeof window === "undefined") return;

		const sectionIds = ["hero", "how-it-works", "features", "pricing"]; // your actual ids

		const handleScroll = () => {
			if (isProgrammaticScroll.current) return;

			const scrollPos = window.scrollY + 120; // offset to match your navbar height
			let current = sectionIds[0];

			for (const id of sectionIds) {
				const el = document.getElementById(id);
				if (!el) continue;
				if (el.offsetTop <= scrollPos) {
					current = id;
				}
			}

			setActiveSectionState(current);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll(); // set initial state
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<ScrollSpyContext.Provider
			value={{
				activeSection,
				setActiveSection,
				scrollToSection,
			}}
		>
			{children}
		</ScrollSpyContext.Provider>
	);
}
