"use client"

import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { useTasks } from '@/hooks/usetasks';

export default function Home() {
  const {
    Input,
    setInput,
    List,
    addTask,
    changeTaskState,
  } = useTasks();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <main className="task-page">
      <section className="task-shell" aria-labelledby="task-title">
        <header className="task-header">
          <p className="task-eyebrow">Daily organizer</p>
          <h1 id="task-title">Task List</h1>
        </header>

        <div className="task-input-bar">
          <input
            aria-label="New task"
            placeholder="Write a task..."
            onChange={(event) => {
              setInput(event.target.value)
            }}
            value={Input}
            onKeyDown={(event)=>{
              if (event.key === "Enter") {
                addTask()
              }
            }}
          />
          <button className="task-add-button" onClick={addTask}>
            Add Task
          </button>
        </div>

        <section className="task-list" aria-label="Tasks">
          {isMounted ? (
            <>
              {List.length === 0 && (
                <p className="task-empty">No tasks yet. Create one to get started.</p>
              )}

              {List.map((task) => {
                return (
                  <Card
                    key={task.id}
                    title={task.title}
                    state={task.state}
                    date={task.date}
                    time={task.time}
                    id={task.id}
                    handleStartButton={changeTaskState}
                  />
                );
              })}
            </>
          ) : (
            <p className="task-loading">Loading your tasks...</p>
          )}
        </section>
      </section>
    </main>
  )
}
