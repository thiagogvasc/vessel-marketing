// 'use client'

// import React, { useEffect, useState } from 'react';
// import { DragDropContext } from 'react-beautiful-dnd';
// import { useBoard, useUpdateTaskOrder, /*useAddColumn*/ } from '../hooks/useTasks';
// import Column from './Column';
// import { AggregateColumn, Column as ColumnType } from '../types';
// import { Box, CircularProgress, Grid, Fade, Grow, IconButton, TextField } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';

// interface KanbanBoardProps {
//   boardId: string;
// }

// const KanbanBoard: React.FC<KanbanBoardProps> = ({ boardId }) => {
//   const { data, isLoading } = useBoard(boardId);
//   const [columns, setColumns] = useState<AggregateColumn[]>([]);
//   const [newColumnTitle, setNewColumnTitle] = useState('');
//   const [isAddingColumn, setIsAddingColumn] = useState(false);
//   const updateTaskOrderMutation = useUpdateTaskOrder(boardId);
//   // const addColumnMutation = useAddColumn(boardId);

//   useEffect(() => {
//     if (data) {
//       setColumns(data.board.columns);
//     }
//   }, [data]);

//   const handleDragEnd = (result: any) => {
//     if (!result.destination) return;

//     const sourceIndex = result.source.index;
//     const destinationIndex = result.destination.index;
//     const sourceColumnTitle = result.source.droppableId;
//     const destinationColumnTitle = result.destination.droppableId;

//     const sourceColumn = columns.find(col => col.title === sourceColumnTitle);
//     const destinationColumn = columns.find(col => col.title === destinationColumnTitle);

//     if (sourceColumn && destinationColumn) {
//       const [movedTask] = sourceColumn.tasks.splice(sourceIndex, 1);
//       destinationColumn.tasks.splice(destinationIndex, 0, movedTask);

//       setColumns(columns.map(col => {
//         if (col.title === sourceColumnTitle) return sourceColumn;
//         if (col.title === destinationColumnTitle) return destinationColumn;
//         return col;
//       }));

//       updateTaskOrderMutation.mutate(
//         columns.map(column => ({
//           title: column.title,
//           taskIds: column.tasks.map(task => task?.id),
//         } as ColumnType))
//       );
//     }
//   };

//   const handleAddColumn = () => {
//     if (newColumnTitle.trim() === '') return;
//     // addColumnMutation.mutateAsync({ title: newColumnTitle }).then(newColumn => {
//     //   setColumns([...columns, newColumn]);
//     //   setNewColumnTitle('');
//     //   setIsAddingColumn(false);
//     // });
//   };

//   const handleColumnTitleBlur = () => {
//     if (newColumnTitle.trim() !== '') {
//       handleAddColumn();
//     } else {
//       setIsAddingColumn(false);
//     }
//   };

//   const handleColumnTitleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       handleAddColumn();
//     } else if (e.key === 'Escape') {
//       setIsAddingColumn(false);
//     }
//   };

//   if (isLoading) return (
//     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
//       <CircularProgress />
//     </Box>
//   );

//   return (
//     <div>
//       <Fade in timeout={500}>
//         <Box>
//           <DragDropContext onDragEnd={handleDragEnd}>
//             <Grid container spacing={2} sx={{ mt: 2 }}>
//               {columns.map(column => (
//                 <Grow in timeout={1000} key={column.title}>
//                   <Grid item xs={12} md={4}>
//                     <Column column={column} boardId={boardId} />
//                   </Grid>
//                 </Grow>
//               ))}
//               <Grid item xs={12} md={4}>
//                 {isAddingColumn ? (
//                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     <TextField
//                       placeholder="Column title"
//                       value={newColumnTitle}
//                       onChange={(e) => setNewColumnTitle(e.target.value)}
//                       onBlur={handleColumnTitleBlur}
//                       onKeyDown={handleColumnTitleKeyDown}
//                       variant="outlined"
//                       size="small"
//                       sx={{ flex: 1 }}
//                       autoFocus
//                     />
//                     <IconButton color="primary" onClick={handleAddColumn}>
//                       <AddIcon />
//                     </IconButton>
//                   </Box>
//                 ) : (
//                   <IconButton color="primary" onClick={() => setIsAddingColumn(true)}>
//                     <AddIcon />
//                   </IconButton>
//                 )}
//               </Grid>
//             </Grid>
//           </DragDropContext>
//         </Box>
//       </Fade>
//     </div>
//   );
// };

// export default KanbanBoard;
