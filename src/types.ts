import { Timestamp } from "firebase/firestore";

export type UserRole = 'client' | 'agent';

// Types for Users Collection
export interface User {
  id?: string; // auto-generated
  email: string;
  role: UserRole;
  fullname: string;
  created_at?: Timestamp;
  updated_at?: Timestamp;
  profile_picture?: string;
  phone_number?: string;
}

export type RequestStatus = 'Pending' | 'In Progress' | 'Completed';
export type RequestPriority = 'Low' | 'Medium' | 'High';

// Types for Requests Collection
export interface Request {
  id?: string; // auto-generated
  client_id: string; // reference to Users
  title: string;
  description: string;
  status: RequestStatus;
  priority?: RequestPriority;
  due_date?: Timestamp;
  assigned_to?: string; // reference to Users
  created_at?: Timestamp;
  updated_at?: Timestamp;
  updates: RequestUpdate[];
}

export interface RequestUpdate {
  id?: string; // auto-generated
  updated_by: string; // reference to Users
  updated_at?: Timestamp; // auto-generated by Firestore
  update_description: string;
}

export interface ViewFilter {
  property_id: string;
  condition: string; // e.g., 'equals', 'contains'
  value: any;
}

export interface ViewSort {
  property_id: string;
  order: 'Asc' | 'Desc';
}

export interface GroupByGroup {
  group_by_value: string;
  task_order: string[];
}

export interface ViewConfig {
  group_by?: string; // property ID for grouping
  groups?: GroupByGroup[]; // optional manual sorting configuration
  filters?: ViewFilter[];
  sorts?: ViewSort[];
}

export interface DatabaseView {
  id?: string;
  name: string;
  type: string;
  config?: ViewConfig;
}

export enum PropertyType {
  Text = 'Text',
  Number = 'Number',
  Date = 'Date',
  Select = 'Select',
  // MultiSelect = 'Multi-select',
  // Checkbox = 'Checkbox',
  // User = 'User'
}

export interface PropertyValidation {
  allowedValues?: string[];
  allowDecimals?: boolean;
  precision?: number;
}

export interface PropertyMetadata {
  maxLength?: number;
  isRequired?: boolean;
  placeholder?: string;
  defaultValue?: string | number | string[] | number[];
  tooltip?: string;
  displayFormat?: string;
  min?: number;
  max?: number;
  validation?: PropertyValidation;
  multiple?: boolean;
  options?: string[]; // applicable for Select and Multi-select types
}

export interface DatabasePropertyDefinition {
  name: string;
  type: PropertyType;
  data?: PropertyMetadata;
}

export interface Database {
  id?: string;
  name: string;
  description: string;
  client_id?: string;
  // workspaceId: string;
  views: DatabaseView[];
  propertyDefinitions: DatabasePropertyDefinition[];
}

export interface Task {
  id?: string; // auto-generated
  database_id: string;
  title: string;
  description: string;
  created_at?: string; // ISO string format for timestamp
  updated_at?: string; // ISO string format for timestamp
  properties: {
    [key: string]: any; // key is propertyId, value can be any type depending on the property type
  };
}

export interface Column {
  title: string; // column title
  taskIds: string[]; // array of task IDs in order
}

export interface AggregateColumn {
  title: string; // column title
  tasks: Task[]; // array of task IDs in order
}

export interface AggregateBoard {
  id: string; // board ID
  title: string; // board title
  columns: AggregateColumn[]; // array of columns
  created_at?: Timestamp;
  updated_at?: Timestamp;
}


// Types for Task_Notes Subcollection (within Tasks)
export interface TaskNote {
  id?: string; // auto-generated
  user_id: string; // reference to Users
  note: string;
  created_at?: Timestamp;
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
