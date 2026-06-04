"use client";

import {
  Button,
  Card as HeroCard,
  Chip,
  Input as HeroInput,
  Spinner,
} from "@heroui/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Card } from "@/components/Card";
import { ThemeSwitch } from "@/components/ThemeSwitch";
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

  const pendingTasks = List.filter((task) => task.state === "pending").length;
  const activeTasks = List.filter((task) => task.state === "inProgress").length;
  const doneTasks = List.filter((task) => task.state === "done").length;

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
          <div className="task-title-block">
            <Chip className="task-eyebrow" size="sm" variant="soft">
              Daily organizer
            </Chip>
            <h1 id="task-title">
              Task List
            </h1>
          </div>

          <div className="task-session-bar">
            <ThemeSwitch />
            {isAuthenticated && (
              <>
                <span>
                  {session.user?.name ?? session.user?.email}
                </span>
                <Button
                  className="task-secondary-button"
                  type="button"
                  size="sm"
                  variant="secondary"
                  onPress={() => signOut()}
              >
                Cerrar Sesion
                </Button>
              </>
            )}
          </div>
        </header>

        {status === "loading" && (
          <div className="task-loading">
            <Spinner size="sm" />
            <span>Loading your session...</span>
          </div>
        )}

        {status === "unauthenticated" && (
          <HeroCard
            className="auth-panel"
            aria-label="Authentication"
          >
            <div className="auth-mark" aria-hidden="true">
              <Image
                src="/icon.svg"
                alt=""
                width={68}
                height={68}
              />
            </div>
            <HeroInput
              aria-label="Name"
              placeholder="Nombre"
              value={authName}
              variant="secondary"
              onChange={(event) => {
                setAuthName(event.target.value);
              }}
            />
            <HeroInput
              aria-label="Email"
              placeholder="Correo"
              type="email"
              value={authEmail}
              variant="secondary"
              onChange={(event) => {
                setAuthEmail(event.target.value);
              }}
            />
            <HeroInput
              aria-label="Password"
              placeholder="Contrasena"
              type="password"
              value={authPassword}
              variant="secondary"
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
              <Button
                type="button"
                variant="primary"
                onPress={handleSignIn}
                isDisabled={isAuthLoading}
              >
                Iniciar Sesion
              </Button>
              <Button
                className="task-secondary-button"
                type="button"
                variant="secondary"
                onPress={handleRegister}
                isDisabled={isAuthLoading}
              >
                Crear Cuenta
              </Button>
            </div>
          </HeroCard>
        )}

        {isAuthenticated && (
          <>
            <section className="task-summary" aria-label="Task summary">
              <HeroCard className="task-summary-item">
                <span>Total</span>
                <strong>{List.length}</strong>
              </HeroCard>
              <HeroCard className="task-summary-item is-pending">
                <span>Pendientes</span>
                <strong>{pendingTasks}</strong>
              </HeroCard>
              <HeroCard className="task-summary-item is-active">
                <span>Activas</span>
                <strong>{activeTasks}</strong>
              </HeroCard>
              <HeroCard className="task-summary-item is-done">
                <span>Listas</span>
                <strong>{doneTasks}</strong>
              </HeroCard>
            </section>

            <div className="task-input-bar">
              <HeroInput
                aria-label="New task"
                placeholder="Nueva tarea..."
                value={Input}
                variant="secondary"
                onChange={(event) => {
                  setInput(event.target.value);
                }}
                onKeyDown={(event) => {

                  if (event.key === "Enter") {
                    addTask();
                  }

                }}
              />
              <Button
                className="task-add-button"
                variant="primary"
                onPress={addTask}
              >
                Agregar
              </Button>

            </div>

            <section
              className="task-list"
              aria-label="Tasks"
            >

              {isMounted ? (
                <>

                  {List.length === 0 && (
                    <HeroCard className="task-empty">
                      Todavia no tienes tareas.
                    </HeroCard>
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
                        commentHref={`/tasks/${task._id}`}
                      />
                    );

                  })}

                </>
              ) : (

                <div className="task-loading">
                  <Spinner size="sm" />
                  <span>Loading your tasks...</span>
                </div>

              )}

            </section>
          </>
        )}
      </section>
    </main>
  );
}
