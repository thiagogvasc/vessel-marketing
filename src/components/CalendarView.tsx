// 'use client'

// import React from 'react';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { Task } from '../types';
// import { Timestamp } from 'firebase/firestore';

// interface TaskWithDates extends Task {
//   start_date: Date
//   end_date: Date
// }
// interface CalendarViewProps {
//   tasks: TaskWithDates[];
// }

// const localizer = momentLocalizer(moment);

// const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
//   const events = tasks.map(task => ({
//     title: task.title,
//     start: task.start_date,
//     end: task.end_date,
//   }));

//   return (
//     <div style={{ height: 500 }}>
//       <Calendar
//         localizer={localizer}
//         events={events}
//         startAccessor="start"
//         endAccessor="end"
//         style={{ height: '100%' }}
//       />
//     </div>
//   );
// };

// export default CalendarView;
