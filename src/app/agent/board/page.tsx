import DatabaseView from "@/src/components/DatabaseView";
import { Task } from "@/src/types";
import { Container, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";

const tasks: Task[] = [
  {
    id: '1',
    database_id: '',
    description: 'description 1',
    title: 'task1',
    priority: 'high',
    status:'To Do',
    start_at: Timestamp.fromDate(new Date(1999, 1, 20)),
    end_at: Timestamp.fromDate(new Date(1999, 1, 22))

  },
  {
    id: '2',
    database_id: '',
    description: 'description 2',
    title: 'task2',
    priority: 'high',
    status:'In Progress',
    start_at: Timestamp.fromDate(new Date(1999, 2, 10)),
    end_at: Timestamp.fromDate(new Date(1999, 2, 12))
    
  },
  {
    id: '3',
    database_id: '',
    description: 'description 3',
    title: 'task3',
    priority: 'high',
    status:'Done',
    start_at: Timestamp.fromDate(new Date(1999, 2, 3)),
    end_at: Timestamp.fromDate(new Date(1999, 2, 4))
  }

]

export default function Planning() {
    return (
      <Container component="main" maxWidth="xl" sx={{ mt: 4 }}>
        <Typography component="h1" variant="h5">Kanban Board - Test</Typography>
        <DatabaseView tasks={tasks.map(task => ({ ...task, start_date: task.start_at?.toDate(), end_date: task.end_at?.toDate()}))}/>
      </Container>
    );
  }