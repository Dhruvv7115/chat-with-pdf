import { client } from "@/lib/prisma";
export const similaritySearch = async (
	queryEmbedding: number[],
	pdfId: string,
	topK: number = 5,
) => {
	console.log("similaritySearch:", queryEmbedding, pdfId);
	const embedding = `[${queryEmbedding.join(",")}]`;

	const results = await client.$queryRaw<
		{ content: string; similarity: number }[]
	>`
    SELECT content, 1 - (embedding <=> ${embedding}::vector) AS similarity
    FROM "PdfEmbedding"
    WHERE "pdfId" = ${pdfId}
    ORDER BY "similarity" DESC 
    LIMIT ${topK}
  `;

	return results;
};
