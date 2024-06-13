import DatabaseView from "@/src/components/DatabaseView";
import KanbanBoard from "@/src/components/KanbanBoard";
import { Task } from "@/src/types";
import { Timestamp } from "firebase/firestore";

const tasks: Task[] = [
  {
    id: '1',
    board_id: '',
    description: 'description 1',
    title: 'task1',
    priority: 'high',
    status:'To Do',
    start_at: Timestamp.fromDate(new Date(1999, 1, 20)),
    end_at: Timestamp.fromDate(new Date(1999, 1, 22))

  },
  {
    id: '2',
    board_id: '',
    description: 'description 2',
    title: 'task2',
    priority: 'high',
    status:'In Progress',
    start_at: Timestamp.fromDate(new Date(1999, 2, 10)),
    end_at: Timestamp.fromDate(new Date(1999, 2, 12))
    
  },
  {
    id: '3',
    board_id: '',
    description: 'description 3',
    title: 'task3',
    priority: 'high',
    status:'To Do',
    start_at: Timestamp.fromDate(new Date(1999, 2, 3)),
    end_at: Timestamp.fromDate(new Date(1999, 2, 4))
  }

]

export default function Planning() {
    return (
      <div>
        <h1>Kanban Board - Test</h1>
        {/* <KanbanBoard boardId='b34VLvMGePOdsnUdolFN'/> */}
        <DatabaseView tasks={tasks.map(task => ({ ...task, start_date: task.start_at?.toDate(), end_date: task.end_at?.toDate()}))}/>
      </div>
    );
  }