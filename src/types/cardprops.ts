export interface CardProps {
  title: string;
  date: string;
  state: "pending" | "inProgress" | "done"
  time: number;
  id: string;
  handleStartButton: (id: string)=> void
}
