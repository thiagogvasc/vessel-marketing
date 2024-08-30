import React from "react";
import { KanbanViewContainer } from "../containers/KanbanViewContainer";
import { ListViewContainer } from "../containers/ListViewContainer";

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
      <KanbanViewContainer
        readOnly={false}
        databaseId={databaseId}
        viewId={viewId}
      />
    );
  } else if (viewTypeUppercase === 'LIST') {
		return (
			<ListViewContainer
				databaseId={databaseId}
				viewId={viewId}
				readOnly={false}
			/>
		)
	}

  return <>No matched view</>;
};
