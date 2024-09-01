import React from "react";
import { useGetUserById } from "../../hooks/react-query/user";
import { Avatar, Box, Typography } from "@mui/material";

interface CustomerCellContainerProps {
	client_id: string | undefined;
}

export const CustomerCellContainer: React.FC<CustomerCellContainerProps> = ({ client_id }) => {
	const { data: user } = useGetUserById(client_id);

	return (
		<>
			{user ? (
				<Box sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'start',
					gap: '16px',
				}}>
					<Box>
						<Avatar />
					</Box>
					<Box sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'flex-start'
					}}>
					<Typography color="text.primary" fontSize={14}>
						{user?.fullname}
					</Typography>
					<Typography color="text.disabled" fontSize={14}>
						{user?.email}
					</Typography>
					</Box>
				</Box>
			) : (
				<>None</>
			)}
		</>
	)
}