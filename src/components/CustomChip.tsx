import React from "react";
import { Chip } from "@mui/material";

const colorMap = {
  success: { backgroundColor: 'rgba(34, 197, 94, 0.16)', color: 'rgb(17, 141, 87)'},
  danger: { color: 'rgb(183, 29, 24)', backgroundColor: 'rgba(255, 86, 48, 0.16)'},
  warning: {color: '#B76E00', backgroundColor: '#FFF5CC'},
  info: {backgroundColor: '#CAFDF5', color: '#006C9C'},
  grey: {color: '#637381', backgroundColor: 'rgba(145, 158, 171, 0.16)'}
};

interface CustomChipProps {
    type: string;
    value: string;
}

export const CustomChip: React.FC<CustomChipProps> = ({ type, value }) => {
  // Define mapping logic for different types
  const typeColorMap = {
    priority: {
      Low: "grey",
      Medium: "warning",
      High: "danger",
    },
    status: {
      Pending: "warning",
      "In Progress": "info",
      Completed: "success",
    },
    // Add other mappings for different types
  };

  // Determine the color style based on type and value
  const chipStyle = colorMap[typeColorMap[type as keyof {}][value] as keyof typeof colorMap] || {}; // fix this

  return (
    <Chip
      label={value}
      sx={{
        backgroundColor: chipStyle.backgroundColor,
        color: chipStyle.color,
        fontWeight: "bold",
        borderRadius: '6px',
        padding: '0px 6px'
      }}
    />
  );
};
