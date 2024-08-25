import { addPropertyDefinition, deletePropertyDefinition, getPropertyDefinitionsByDatabaseId, updatePropertyDefinition } from "@/src/supabase/database_property_definitions";
import { DatabasePropertyDefinition } from "@/src/types";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const useGetDatabasePropertyDefinitions = (
	databaseId: string | null | undefined,
) => {
	return useQuery(
		["databases", databaseId, "property-definitions"],
		() => {
			console.warn(
				"start fetching  property definitions for database",
				databaseId,
			);
			return databaseId
				? getPropertyDefinitionsByDatabaseId(databaseId)
				: Promise.resolve(null);
		},
		{ enabled: !!databaseId, refetchOnMount: false },
	);
};

export const useAddPropertyDefinition = (databaseId: string) => {
  const queryClient = useQueryClient();
  return useMutation((propertyDefinition: DatabasePropertyDefinition) => addPropertyDefinition(propertyDefinition), {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["databases", databaseId, "property-definitions"],
      });
    },
  });
};

export const useDeletePropertyDefinition = (databaseId: string) => {
  const queryClient = useQueryClient();
  return useMutation((id: string) => deletePropertyDefinition(id), {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["databases", databaseId, "property-definitions"],
      });
    },
  });
};

export const useUpdatePropertyDefinition = (databaseId: string) => {
  const queryClient = useQueryClient();
  return useMutation(({ id, changes }: { id: string, changes: Partial<DatabasePropertyDefinition> }) => updatePropertyDefinition(id, changes), {
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["databases", databaseId, "property-definitions"],
      });
    },
  });
};