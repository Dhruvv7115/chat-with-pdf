import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const genai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY!,
});

// Strip markdown syntax so TTS reads clean text
function stripMarkdown(text: string): string {
	return text
		// Remove headers
		.replace(/^#{1,6}\s+/gm, "")
		// Remove bold/italic
		.replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
		.replace(/_{1,3}([^_]+)_{1,3}/g, "$1")
		// Remove inline code
		.replace(/`([^`]+)`/g, "$1")
		// Remove code blocks
		.replace(/```[\s\S]*?```/g, "")
		// Remove links, keep text
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		// Remove images
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
		// Remove blockquotes
		.replace(/^>\s+/gm, "")
		// Remove horizontal rules
		.replace(/^[-*_]{3,}\s*$/gm, "")
		// Remove list bullets/numbers
		.replace(/^[\s]*[-*+]\s+/gm, "")
		.replace(/^[\s]*\d+\.\s+/gm, "")
		// Collapse multiple blank lines
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

// Build a valid WAV file from raw PCM bytes (16-bit signed, mono)
function buildWavFile(pcmData: Uint8Array, sampleRate = 24000): Buffer {
	const numChannels = 1;
	const bitsPerSample = 16;
	const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
	const blockAlign = (numChannels * bitsPerSample) / 8;
	const dataSize = pcmData.byteLength;
	const headerSize = 44;
	const buffer = Buffer.alloc(headerSize + dataSize);

	// RIFF chunk descriptor
	buffer.write("RIFF", 0);
	buffer.writeUInt32LE(36 + dataSize, 4);
	buffer.write("WAVE", 8);

	// fmt sub-chunk
	buffer.write("fmt ", 12);
	buffer.writeUInt32LE(16, 16); // Subchunk1Size for PCM
	buffer.writeUInt16LE(1, 20); // AudioFormat: PCM = 1
	buffer.writeUInt16LE(numChannels, 22);
	buffer.writeUInt32LE(sampleRate, 24);
	buffer.writeUInt32LE(byteRate, 28);
	buffer.writeUInt16LE(blockAlign, 32);
	buffer.writeUInt16LE(bitsPerSample, 34);

	// data sub-chunk
	buffer.write("data", 36);
	buffer.writeUInt32LE(dataSize, 40);
	Buffer.from(pcmData).copy(buffer, headerSize);

	return buffer;
}

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const { text } = await req.json();
	if (!text || typeof text !== "string") {
		return NextResponse.json({ error: "Missing text" }, { status: 400 });
	}

	const cleanText = stripMarkdown(text).slice(0, 5000); // cap at 5k chars

	try {
		const response = await genai.models.generateContent({
			model: "gemini-2.5-flash-preview-tts",
			contents: [{ role: "user", parts: [{ text: cleanText }] }],
			config: {
				responseModalities: ["AUDIO"],
				speechConfig: {
					voiceConfig: {
						prebuiltVoiceConfig: { voiceName: "Kore" },
					},
				},
			},
		});

		const audioPart =
			response.candidates?.[0]?.content?.parts?.find(
				(p) => p.inlineData?.mimeType?.startsWith("audio/"),
			);

		if (!audioPart?.inlineData?.data) {
			return NextResponse.json(
				{ error: "No audio returned from TTS model" },
				{ status: 500 },
			);
		}

		const rawBytes = Buffer.from(audioPart.inlineData.data, "base64");
		const mimeType = audioPart.inlineData.mimeType ?? "";

		let audioBuffer: Buffer;

		// If the model returns raw PCM (L16), we need to add a WAV header
		if (mimeType.includes("L16") || mimeType.includes("pcm")) {
			audioBuffer = buildWavFile(new Uint8Array(rawBytes));
		} else {
			// Already a proper audio format (mp3, wav, etc.)
			audioBuffer = rawBytes;
		}

		// Slice to a standalone ArrayBuffer (avoids pooled-buffer issues).
		// ArrayBuffer is a valid BodyInit, unlike Buffer or Uint8Array in this TS config.
		const arrayBuf = audioBuffer.buffer.slice(
			audioBuffer.byteOffset,
			audioBuffer.byteOffset + audioBuffer.byteLength,
		);

		return new Response(arrayBuf as ArrayBuffer, {
			status: 200,
			headers: {
				"Content-Type": "audio/wav",
				"Content-Length": audioBuffer.byteLength.toString(),
				"Cache-Control": "no-store",
			},
		});
	} catch (err: unknown) {
		console.error("TTS error:", err);
		const message =
			err instanceof Error ? err.message : "TTS generation failed";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
