export interface Task {
  id: string;
  title: string;
  date: string;
  time: number;
  state: "pending" | "inProgress" | "Done";
}