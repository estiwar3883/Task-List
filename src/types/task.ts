export interface Task {
  _id: string;
  title: string;
  date: string;
  startedAt: number | null;
  totalTime: number;
  state: "pending" | "inProgress" | "done";
  comments?: string[];
}