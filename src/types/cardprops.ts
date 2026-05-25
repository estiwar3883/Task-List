export interface CardProps {
  title: string;
  date: string;
  state: "pending" | "inProgress" | "Done"
  time: number;
  id: string;
  handleStartButton: (id: string)=> void
}
