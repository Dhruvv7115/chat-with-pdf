import { FileType } from "@/lib/generated/prisma/enums";
import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
//@ts-ignore
import { formatFromBytes } from "@firecrawl/anydoc-darwin-arm64";

const s3 = new S3Client({
	region: "ap-south-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

// Upload
const uploadFile = async (
	userId: string,
	file: {
		name: string;
		type: string;
		size: number;
	},
) => {
	const allowedTypes = [
		"application/pdf",
		"application/msword", // .doc
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
		"text/plain", // .txt
		"text/markdown", // .md
	];
	if (!allowedTypes.includes(file.type)) throw new Error("Invalid file type");
	const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
	const key = `users/${userId}/${Date.now()}-${safeName}`;

	const url = await getSignedUrl(
		s3,
		new PutObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME!,
			Key: key,
			ContentType: file.type,
		}),
		{ expiresIn: 300 },
	);

	return { url, key }; // save key to DB
};

const uploadUserImage = async (
	userId: string,
	file: {
		name: string;
		type: string;
		size: number;
	},
) => {
	const allowedType = "images/*";
	if (allowedType !== file.type) throw new Error("Invalid file type");
	const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
	const key = `users/${userId}/avatars/${Date.now()}-${safeName}`;

	const url = await getSignedUrl(
		s3,
		new PutObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME!,
			Key: key,
			ContentType: file.type,
		}),
		{ expiresIn: 300 },
	);

	return { url, key }; // save key to DB
};

const getFileUrl = async (key: string) => {
	const command = new GetObjectCommand({
		Bucket: process.env.AWS_BUCKET_NAME!,
		Key: key,
	});
	return getSignedUrl(s3, command, { expiresIn: 3600 });
};

const deleteFile = async (key: string) => {
	await s3.send(
		new DeleteObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME!,
			Key: key,
		}),
	);
};

// to get file buffer
const getFileBufferFromS3 = async function (key: string): Promise<Buffer> {
	const response = await s3.send(
		new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME!, Key: key }),
	);
	const bytes = await response.Body!.transformToByteArray();
	return Buffer.from(bytes);
};

// to get file type
async function detectFileType(buffer: Buffer): Promise<FileType> {
	const format = formatFromBytes(buffer); // reads file signature, not the name

	const map: Record<string, FileType> = {
		Pdf: "PDF",
		Docx: "DOCX",
		Doc: "DOCX",
		Csv: "TXT",
		// map anydoc's Format enum values to yours as needed
	};

	const mapped = format ? map[format] : undefined;
	if (!mapped) throw new Error(`Unsupported or undetected file type`);
	return mapped;
}

export {
	uploadFile,
	getFileUrl,
	deleteFile,
	uploadUserImage,
	getFileBufferFromS3,
	detectFileType,
};
