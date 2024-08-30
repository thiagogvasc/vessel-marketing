import React from "react";
import { AgentKanbanViewContainer } from "../containers/AgentKanbanViewContainer";

interface DatabaseViewRendererProps {
  viewId: string | undefined;
  databaseId: string | undefined;
  viewType: string | undefined;
}

export const DatabaseViewRenderer: React.FC<DatabaseViewRendererProps> = ({
  viewId,
  databaseId,
  viewType,
}) => {
  const viewTypeUppercase = viewType?.toUpperCase();

  if (viewTypeUppercase === "KANBAN") {
    return (
      <AgentKanbanViewContainer
        readOnly={false}
        databaseId={databaseId}
        viewId={viewId}
      />
    );
  }

  return <>No matched view</>;
};
