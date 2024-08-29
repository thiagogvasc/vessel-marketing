import React from "react";
import { DatabaseView } from "@/src/types";
import { useGetDatabasePropertyDefinitions } from "../hooks/react-query/database_property_definition";
import { ViewSettingsPopover } from "../components/ViewSettingsPopover/ViewSettingsPopover";
import {
  useDeleteDatabaseView,
  useUpdateDatabaseView,
} from "../hooks/react-query/database_view";

interface ViewSettingsPopoverContainerProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  view: DatabaseView;
  databaseId: string | undefined;
}

export const ViewSettingsPopoverContainer: React.FC<
  ViewSettingsPopoverContainerProps
> = ({ anchorEl, onClose, view, databaseId }) => {
  const { data: propertyDefinitions } =
    useGetDatabasePropertyDefinitions(databaseId);
  const updateViewMutation = useUpdateDatabaseView(databaseId);
  const deleteViewMutation = useDeleteDatabaseView(databaseId);

  const handleRenameView = (name: string) => {
    updateViewMutation.mutate({
      id: view.id,
      changes: { name },
    });
  };

  const handleViewTypeChange = (type: string) => {
    updateViewMutation.mutate({
      id: view.id,
      changes: { type },
    });
  };

  const handleGroupByChange = (groupBy: string) => {
    console.warn(groupBy);
  };

  const handleDeleteView = () => {
    deleteViewMutation.mutate(view.id);
    onClose?.();
  };

  const handleClose = () => {
    console.warn("closing");
    onClose?.();
  };

  return (
    <ViewSettingsPopover
      anchorEl={anchorEl}
      view={view}
      propertyDefinitions={propertyDefinitions ?? []}
      onClose={handleClose}
      onDeleteView={handleDeleteView}
      onGroupByChange={handleGroupByChange}
      onRenameView={handleRenameView}
      onViewTypeChange={handleViewTypeChange}
    />
  );
};
