import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ActionsCellProps {
    requestId: string;
}

export const ActionsCell: React.FC<ActionsCellProps> = ({ requestId }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const handleMenuOpen = (
        event: React.MouseEvent<HTMLElement>,
    ) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
          <IconButton
            onClick={(e) => handleMenuOpen(e)}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                router.push(`/agent/requests/${requestId}`);
              }}
            >
              View
            </MenuItem>
          </Menu>
        </>
    )
}