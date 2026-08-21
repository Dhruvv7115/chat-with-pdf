"use client";

import { useEffect, useState } from "react";

export type ResponseStyle = "concise" | "balanced" | "detailed";
export type Language = "en" | "hi";

export type Preferences = {
	language: Language;
	responseStyle: ResponseStyle;
	autoScroll: boolean;
	readAloud: boolean;
};

const STORAGE_KEY = "chatwithpdf:preferences";

export const defaultPreferences: Preferences = {
	language: "en",
	responseStyle: "balanced",
	autoScroll: true,
	readAloud: false,
};

function loadPreferences(): Preferences {
	if (typeof window === "undefined") {
		return defaultPreferences;
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);

		if (!stored) {
			return defaultPreferences;
		}

		const parsed = JSON.parse(stored);

		return {
			...defaultPreferences,
			...parsed,
		};
	} catch (error) {
		console.error("Failed to load preferences:", error);
		return defaultPreferences;
	}
}

export function usePreferences() {
	const [preferences, setPreferences] =
		useState<Preferences>(defaultPreferences);

	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setPreferences(loadPreferences());
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (!hydrated) return;

		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
		} catch (error) {
			console.error("Failed to save preferences:", error);
		}
	}, [preferences, hydrated]);

	const updatePreferences = (updates: Partial<Preferences>) => {
		setPreferences((prev) => ({
			...prev,
			...updates,
		}));
	};

	const resetPreferences = () => {
		setPreferences(defaultPreferences);

		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch (error) {
			console.error("Failed to reset preferences:", error);
		}
	};

	return {
		preferences,
		updatePreferences,
		resetPreferences,
		hydrated,
	};
}
