import { useQueryClient } from "@tanstack/react-query";

export const useRefetch = () => {
	const queryClient = useQueryClient();
	return () =>
		queryClient.refetchQueries({
			type: "active",
		});
};
