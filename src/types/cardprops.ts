export interface CardProps {
  title: string;
  date: string;
  state: "pending" | "inProgress" | "done";
  time: number;
  _id: string;
  handleStartButton: (_id: string) => void;
  handleEditTitle: (_id: string, title: string) => Promise<void>;
  commentHref?: string;
}
