// Types for Users Collection
export interface User {
  id?: string; // auto-generated
  email: string;
  role: 'cliente' | 'socio';
  created_at?: Date;
  updated_at?: Date;
  profile_picture?: string;
  phone_number?: string;
}

// Types for Requests Collection
export interface Request {
  id?: string; // auto-generated
  client_id: string; // reference to Users
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: Date;
  assigned_to?: string; // reference to Users
  created_at?: Date;
  updated_at?: Date;
}

export interface Task {
  id?: string; // auto-generated
  board_id: string; // reference to Boards
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  due_date?: Date;
  assigned_to?: string; // reference to Users
  priority: 'low' | 'medium' | 'high';
  created_at?: Date;
  updated_at?: Date;
}

export interface Column {
  title: string; // column title
  taskIds: string[]; // array of task IDs in order
}

export interface AggregateColumn {
  title: string; // column title
  tasks: Task[]; // array of task IDs in order
}

export interface Board {
  id: string; // board ID
  title: string; // board title
  columns: Column[]; // array of columns
  created_at?: Date;
  updated_at?: Date;
}

// Types for Task_Notes Subcollection (within Tasks)
export interface TaskNote {
  id?: string; // auto-generated
  user_id: string; // reference to Users
  note: string;
  created_at?: Date;
}

// Types for Meetings Collection
export interface Meeting {
  id?: string; // auto-generated
  client_id: string; // reference to Users
  socio_id: string; // reference to Users
  meeting_datetime: Date;
  location: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'canceled';
  created_at?: Date;
  updated_at?: Date;
}

// Types for Deliverables Collection
export interface Deliverable {
  id?: string; // auto-generated
  client_id: string; // reference to Users
  socio_id: string; // reference to Users
  file_path: string;
  description: string;
  title: string;
  type: 'video' | 'document' | 'image' | 'other';
  status: 'pending' | 'delivered';
  created_at?: Date;
  updated_at?: Date;
}

// Types for Results Collection
export interface Result {
  id?: string; // auto-generated
  client_id: string; // reference to Users
  socio_id: string; // reference to Users
  campaign_name: string;
  investment: number;
  leads: number;
  traffic: number;
  sales_value: number;
  roi: number;
  start_date: Date;
  end_date: Date;
  created_at?: Date;
  updated_at?: Date;
}

// Types for Notifications Collection
export interface Notification {
  id?: string; // auto-generated
  user_id: string; // reference to Users
  message: string;
  read_status: 'unread' | 'read';
  created_at?: Date;
}

// Types for Comments Subcollection (within Tasks)
export interface Comment {
  id?: string; // auto-generated
  task_id: string; // reference to Tasks
  user_id: string; // reference to Users
  comment: string;
  created_at?: Date;
}

// Types for Attachments Subcollection (within Tasks)
export interface Attachment {
  id?: string; // auto-generated
  task_id: string; // reference to Tasks
  file_path: string;
  file_type: 'document' | 'image' | 'video' | 'other';
  uploaded_at?: Date;
}

// Types for Tags Collection
export interface Tag {
  id?: string; // auto-generated
  name: string;
}

// Types for Task_Tags Subcollection (within Tasks)
export interface TaskTag {
  task_id: string; // reference to Tasks
  tag_id: string; // reference to Tags
}
