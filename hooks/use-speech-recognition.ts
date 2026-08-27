"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
	resultIndex: number;
	results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
	error: string;
	message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
	continuous: boolean;
	interimResults: boolean;
	lang: string;
	start: () => void;
	stop: () => void;
	abort: () => void;
	onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
	onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
	onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null;
	onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
}

interface SpeechRecognitionConstructor {
	new (): SpeechRecognitionInstance;
}

declare global {
	interface Window {
		SpeechRecognition?: SpeechRecognitionConstructor;
		webkitSpeechRecognition?: SpeechRecognitionConstructor;
	}
}

export interface UseSpeechRecognitionOptions {
	continuous?: boolean;
	interimResults?: boolean;
	lang?: string;
	onTranscriptChange?: (text: string) => void;
	onError?: (error: string) => void;
}

const emptySubscribe = () => () => {};

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
	const {
		continuous = true,
		interimResults = true,
		lang = "en-US",
		onTranscriptChange,
		onError,
	} = options;

	const [isListening, setIsListening] = useState(false);
	const [transcript, setTranscript] = useState("");
	const [error, setError] = useState<string | null>(null);

	const isSupported = useSyncExternalStore(
		emptySubscribe,
		() =>
			typeof window !== "undefined" &&
			Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
		() => false
	);

	const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
	const shouldBeListeningRef = useRef(false);
	const onTranscriptChangeRef = useRef(onTranscriptChange);
	const onErrorRef = useRef(onError);

	useEffect(() => {
		onTranscriptChangeRef.current = onTranscriptChange;
		onErrorRef.current = onError;
	}, [onTranscriptChange, onError]);

	const stopListening = useCallback(() => {
		shouldBeListeningRef.current = false;
		if (recognitionRef.current) {
			try {
				recognitionRef.current.stop();
			} catch {
				// Ignore errors on stopping
			}
		}
		setIsListening(false);
	}, []);

	const startListening = useCallback(() => {
		if (typeof window === "undefined") return;

		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;

		if (!SpeechRecognition) {
			toast.error("Speech recognition is not supported in your browser.");
			return;
		}

		// Stop any existing instance
		if (recognitionRef.current) {
			try {
				recognitionRef.current.abort();
			} catch {
				// Ignore abort errors
			}
		}

		setError(null);
		setTranscript("");

		try {
			const recognition = new SpeechRecognition();
			recognition.continuous = continuous;
			recognition.interimResults = interimResults;
			recognition.lang = lang;

			recognition.onstart = () => {
				setIsListening(true);
				shouldBeListeningRef.current = true;
			};

			recognition.onresult = (event: SpeechRecognitionEvent) => {
				let fullTranscript = "";
				for (let i = 0; i < event.results.length; i++) {
					const result = event.results[i];
					if (result && result[0]) {
						fullTranscript += result[0].transcript;
					}
				}

				setTranscript(fullTranscript);
				if (onTranscriptChangeRef.current) {
					onTranscriptChangeRef.current(fullTranscript);
				}
			};

			recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
				const errCode = event.error;
				let errorMessage = "Speech recognition error occurred.";

				if (errCode === "not-allowed" || errCode === "service-not-allowed") {
					errorMessage = "Microphone access denied. Please allow microphone permissions.";
					toast.error(errorMessage);
					shouldBeListeningRef.current = false;
				} else if (errCode === "no-speech") {
					// Don't toast for silence timeout, just handle
					return;
				} else if (errCode === "network") {
					errorMessage = "Network error during speech recognition.";
					toast.error(errorMessage);
				} else if (errCode === "audio-capture") {
					errorMessage = "No microphone was found on your device.";
					toast.error(errorMessage);
				}

				setError(errorMessage);
				if (onErrorRef.current) {
					onErrorRef.current(errorMessage);
				}
			};

			recognition.onend = () => {
				setIsListening(false);
				shouldBeListeningRef.current = false;
			};

			recognitionRef.current = recognition;
			recognition.start();
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to start speech recognition.";
			setError(msg);
			toast.error(msg);
			setIsListening(false);
			shouldBeListeningRef.current = false;
		}
	}, [continuous, interimResults, lang]);

	const toggleListening = useCallback(() => {
		if (isListening) {
			stopListening();
		} else {
			startListening();
		}
	}, [isListening, startListening, stopListening]);

	const resetTranscript = useCallback(() => {
		setTranscript("");
	}, []);

	useEffect(() => {
		return () => {
			if (recognitionRef.current) {
				try {
					recognitionRef.current.abort();
				} catch {
					// Ignore cleanup errors
				}
			}
		};
	}, []);

	return {
		isListening,
		isSupported,
		transcript,
		error,
		startListening,
		stopListening,
		toggleListening,
		resetTranscript,
	};
}
