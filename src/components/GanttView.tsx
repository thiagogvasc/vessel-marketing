// 'use client'

// import React, { useState } from 'react';
// import { Box, Typography, Paper } from '@mui/material';
// import { Task } from '../types';
// import { FrappeGantt } from 'frappe-gantt-react';
// import { FrappeGanttProps } from 'frappe-gantt-react/typings/FrappeGantt';

// import 'frappe-gantt/dist/frappe-gantt.css';

// interface TaskWithDates extends Task {
//     start_date: Date
//     end_date: Date
// }

// interface GanttViewProps {
//   tasks: TaskWithDates[];
// }

// // const GanttView: React.FC<GanttViewProps> = ({ tasks }) => {
// //   const [startDate] = useState<Date>(new Date(1999, 1));
// //   const [endDate] = useState<Date>(new Date(1999, 4));

// //   console.warn(tasks[0].start_at)

// //   const daysBetween = (start: Date, end: Date) => {
// //     return (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
// //   };

// //   const totalDays = daysBetween(startDate, endDate);

// //   const calculateLeft = (taskStart: Date) => {
// //     return (daysBetween(startDate, taskStart) / totalDays) * 100;
// //   };

// //   const calculateWidth = (taskStart: Date, taskEnd: Date) => {
// //     return (daysBetween(taskStart, taskEnd) / totalDays) * 100;
// //   };

// //   return (
// //     <Box sx={{ padding: 2 }}>
// //       <Typography variant="h5" gutterBottom>
// //         Gantt Chart
// //       </Typography>
// //       <Box sx={{ display: 'flex', flexDirection: 'column' }}>
// //         {tasks.map(task => (
// //           <Paper
// //             key={task.id}
// //             sx={{
// //               position: 'relative',
// //               marginBottom: 1,
// //               height: 40,
// //               backgroundColor: 'lightblue',
// //               left: `${calculateLeft(task.start_date)}%`,
// //               width: `${calculateWidth(task.start_date, task.end_date)}%`,
// //             }}
// //           >
// //             <Typography sx={{ padding: 1 }}>
// //               {task.title}
// //             </Typography>
// //           </Paper>
// //         ))}
// //       </Box>
// //       <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
// //         <Typography>{startDate.toDateString()}</Typography>
// //         <Typography>{endDate.toDateString()}</Typography>
// //       </Box>
// //     </Box>
// //   );
// // };

// const GanttView: React.FC<GanttViewProps> = ({ tasks }) => {
//     const ganttTasks = tasks.map(task => ({
//       id: task.id,
//       name: task.title,
//       start: task.start_date,
//       end: task.end_date,
//       progress: 0, // You can add a progress field to tasks if you want
//       dependencies: ''
//     }));
  
//     return (
//       <div style={{ height: 500 }}>
//         <FrappeGantt tasks={[]}/>
//       </div>
//     );
//   };

// export default GanttView;
