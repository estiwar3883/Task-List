"use client";

import {Button,Card,Chip,Spinner,TextArea,} from "@heroui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { useTranslation } from "@/context/i18nContext";

type Task = {
  _id: string;
  title: string;
  date: string;
  state: "pending" | "inProgress" | "done";
  totalTime: number;
  startedAt: number | null;
  comments?: string[];
};

const TaskCommentsPage = () => {
  const { t } = useTranslation();
  const params = useParams() as { id?: string };
  const router = useRouter();
  const taskId = params?.id;
  const isMissingTaskId = !taskId;
  const [task, setTask] = useState<Task | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!taskId) return;

    const controller = new AbortController();

    fetch(`/api/tasks/${taskId}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(t.comments.taskNotFound);
        }
        return response.json();
      })
      .then((data) => {
        setTask(data);
        setStatus("ready");
      })
      .catch((fetchError) => {
        if (fetchError.name === "AbortError") return;
        setError(fetchError.message || t.comments.taskLoadError);
        setStatus("error");
      });

    return () => {
      controller.abort();
    };
  }, [taskId, t.comments.taskLoadError, t.comments.taskNotFound]);

  const handleAddComment = async () => {
    if (!task || !comment.trim()) return;

    setStatus("saving");
    const newComments = [...(task.comments ?? []), comment.trim()];

    const response = await fetch(`/api/tasks/${task._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comments: newComments }),
    });

    if (!response.ok) {
      setError(t.comments.saveError);
      setStatus("ready");
      return;
    }

    const updatedTask = await response.json();
    setTask(updatedTask);
    setComment("");
    setStatus("ready");
  };

  const comments = task?.comments ?? [];

  return (
    <main className="task-comments-page">
      <section className="task-comments-shell">
        <header className="task-comments-header">
          <div className="task-comments-nav">
            <Button
              className="task-secondary-button"
              variant="secondary"
              onPress={() => router.push("/")}
            >
              {t.comments.navBack}
            </Button>
            <ThemeSwitch />
            <LanguageSwitch />
          </div>
          <div>
            <Chip className="task-eyebrow" size="sm" variant="soft">
              {t.comments.eyebrow}
            </Chip>
            <h1>{t.comments.title}</h1>
          </div>
        </header>

        {isMissingTaskId && (
          <Card className="task-error">{t.comments.missingTask}</Card>
        )}

        {!isMissingTaskId && status === "loading" && (
          <div className="task-loading">
            <Spinner size="sm" />
            <span>{t.comments.loadingTask}</span>
          </div>
        )}

        {!isMissingTaskId && status === "error" && (
          <Card className="task-error">
            {error || t.comments.errorLoading}
          </Card>
        )}

        {task && (
          <Card className="task-comments-card">
            <div className="task-comments-summary">
              <div>
                <span className="task-comments-label">{t.comments.taskLabel}</span>
                <h2>{task.title}</h2>
              </div>
              <div className="task-comments-meta">
                <Chip className={`card-status ${task.state}`} size="sm" variant="soft">
                  {t.card.state[task.state]}
                </Chip>
                <span>{task.date || t.comments.noDate}</span>
                <strong>
                  {comments.length} {comments.length === 1 ? t.card.commentsSingular : t.card.commentsPlural}
                </strong>
              </div>
            </div>

            <div className="task-comments-list">
              <h3>{t.comments.commentsTitle}</h3>
              {comments.length > 0 ? (
                <ul>
                  {comments.map((text, index) => (
                    <li key={`${task._id}-comment-${index}`}>
                      <Card className="task-comment-item">
                        <span>#{index + 1}</span>
                        {text}
                      </Card>
                    </li>
                  ))}
                </ul>
              ) : (
                <Card className="task-comments-empty">
                  {t.comments.empty}
                </Card>
              )}
            </div>

            <div className="task-comments-form">
              <label htmlFor="comment-input">{t.comments.newComment}</label>
              <TextArea
                id="comment-input"
                value={comment}
                variant="secondary"
                onChange={(event) => setComment(event.target.value)}
                rows={4}
                placeholder={t.comments.placeholder}
              />
              <Button
                type="button"
                variant="primary"
                onPress={handleAddComment}
                isDisabled={!comment.trim() || status === "saving"}
              >
                {status === "saving" ? t.comments.saving : t.comments.save}
              </Button>
            </div>
          </Card>
        )}
      </section>
    </main>
  );
}


export default TaskCommentsPage;
