"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Card } from "@/components/Card";
import { useTasks } from "@/hooks/usetasks";

export default function Home() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const {
    Input,
    setInput,
    List,
    addTask,
    changeTaskState,
    editTaskTitle,
    getCurrentTime,
  } = useTasks(isAuthenticated);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {

    const frameId = requestAnimationFrame(() => {
      setIsMounted(true);
    });

    return () => cancelAnimationFrame(frameId);

  }, []);

  const handleSignIn = async () => {
    setAuthError("");
    setIsAuthLoading(true);

    const result = await signIn("credentials", {
      email: authEmail,
      password: authPassword,
      redirect: false,
    });

    setIsAuthLoading(false);

    if (result?.error) {
      setAuthError("Email or password is incorrect.");
    }
  };

  const handleRegister = async () => {
    setAuthError("");
    setIsAuthLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: authName,
        email: authEmail,
        password: authPassword,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      setAuthError(data?.message ?? "Could not create the account.");
      setIsAuthLoading(false);
      return;
    }

    await handleSignIn();
  };

  return (
    <main className="task-page">

      <section className="task-shell" aria-labelledby="task-title">
        <header className="task-header">
          <p className="task-eyebrow">
            Daily organizer
          </p>
          <h1 id="task-title">
            Task List
          </h1>

          {isAuthenticated && (
            <div className="task-session-bar">
              <span>
                {session.user?.name ?? session.user?.email}
              </span>
              <button
                className="task-secondary-button"
                type="button"
                onClick={() => signOut()}
              >
                Cerrar Sesion
              </button>
            </div>
          )}
        </header>

        {status === "loading" && (
          <p className="task-loading">
            Loading your session...
          </p>
        )}

        {status === "unauthenticated" && (
          <section
            className="auth-panel"
            aria-label="Authentication"
          >
            <input
              aria-label="Name"
              placeholder="Name"
              value={authName}
              onChange={(event) => {
                setAuthName(event.target.value);
              }}
            />
            <input
              aria-label="Email"
              placeholder="Email"
              type="email"
              value={authEmail}
              onChange={(event) => {
                setAuthEmail(event.target.value);
              }}
            />
            <input
              aria-label="Password"
              placeholder="Password"
              type="password"
              value={authPassword}
              onChange={(event) => {
                setAuthPassword(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSignIn();
                }
              }}
            />

            {authError && (
              <p className="auth-error">
                {authError}
              </p>
            )}

            <div className="auth-actions">
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isAuthLoading}
              >
                Iniciar Sesion
              </button>
              <button
                className="task-secondary-button"
                type="button"
                onClick={handleRegister}
                disabled={isAuthLoading}
              >
                Crear Cuenta
              </button>
            </div>
          </section>
        )}

        {isAuthenticated && (
          <>
            <div className="task-input-bar">
              <input
                aria-label="New task"
                placeholder="Write a task..."
                value={Input}
                onChange={(event) => {
                  setInput(event.target.value);
                }}
                onKeyDown={(event) => {

                  if (event.key === "Enter") {
                    addTask();
                  }

                }}
              />
              <button
                className="task-add-button"
                onClick={addTask}
              >
                Add Task
              </button>

            </div>

            <section
              className="task-list"
              aria-label="Tasks"
            >

              {isMounted ? (
                <>

                  {List.length === 0 && (
                    <p className="task-empty">
                      No tasks yet. Create one to get started.
                    </p>
                  )}

                  {List.map((task) => {

                    return (
                      <Card
                        key={task._id}
                        title={task.title}
                        state={task.state}
                        date={task.date}
                        time={getCurrentTime(task)}
                        _id={task._id}
                        handleStartButton={changeTaskState}
                        handleEditTitle={editTaskTitle}
                      />
                    );

                  })}

                </>
              ) : (

                <p className="task-loading">
                  Loading your tasks...
                </p>

              )}

            </section>
          </>
        )}
      </section>
    </main>
  );
}
