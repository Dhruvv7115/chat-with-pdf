import { client } from "@/lib/prisma";
export const similaritySearch = async (
	queryEmbedding: number[],
	docId: string,
	topK: number = 5,
) => {
	console.log("similaritySearch:", queryEmbedding, docId);
	const embedding = `[${queryEmbedding.join(",")}]`;

	const results = await client.$queryRaw<
		{ content: string; page: number | null; similarity: number }[]
	>`
    SELECT content, page, 1 - (embedding <=> ${embedding}::vector) AS similarity
    FROM "DocumentEmbedding"
    WHERE "documentId" = ${docId}
    ORDER BY "similarity" DESC 
    LIMIT ${topK}
  `;

	return results;
};
