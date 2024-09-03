import { styled } from "@mui/system";
import { DataGrid, GridColDef, GridValidRowModel } from "@mui/x-data-grid";

import "./CustomDataGrid.css";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none", // Removes the outer border
  "& .MuiDataGrid-row--borderBottom .MuiDataGrid-columnHeader": {
    border: "none",
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#F4F6F8",
    // Apply the external header class if needed
    "&.custom-header-class": {
      // Add your custom header styles here if necessary
    },
  },
  "& .MuiDataGrid-cell": {
    border: "none",
    padding: "16px",
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
  },
  "& .MuiDataGrid-row": {
    borderBottomColor: "rgb(145 158 171 / 20%)",
    borderBottomStyle: "dashed",
    borderBottomWidth: "1px",
    borderBottomSpacing: "2px",
  },
  "& .MuiDataGrid-filler > *": {
    border: "none",
  },
}));

interface CustomDataGridProps {
  rows: GridValidRowModel[] | undefined;
  columns: GridColDef<GridValidRowModel>[];
}

export const CustomDataGrid: React.FC<CustomDataGridProps> = ({
  rows,
  columns,
  ...props
}) => {
  return (
    <StyledDataGrid
      rows={rows}
      columns={columns}
      getRowHeight={() => "auto"}
      rowSpacingType="border"
      {...props}
    />
  );
};
