"use client";

import {Button,Card as HeroCard,Chip,Input as HeroInput,Spinner,} from "@heroui/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Card } from "@/components/Card";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { useTranslation } from "@/context/i18nContext";
import { useTasks } from "@/hooks/usetasks";

export default function Home() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const {Input,setInput,List,addTask,changeTaskState,editTaskTitle,getCurrentTime,} = useTasks(isAuthenticated);

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
      setAuthError(t.tasks.authError);
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

      setAuthError(data?.message ?? t.tasks.registerError);
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
              {t.tasks.eyebrow}
            </Chip>
            <h1 id="task-title">
              {t.tasks.title}
            </h1>
          </div>

          <div className="task-session-bar">
            <ThemeSwitch />
            <LanguageSwitch />
            {isAuthenticated && (
              <>
                <span>
                  {session.user?.name ?? session.user?.email ?? t.tasks.userLabel}
                </span>
                <Button
                  className="task-secondary-button"
                  type="button"
                  size="sm"
                  variant="secondary"
                  onPress={() => signOut()}
              >
                {t.tasks.signOut}
                </Button>
              </>
            )}
          </div>
        </header>

        {status === "loading" && (
          <div className="task-loading">
            <Spinner size="sm" />
            <span>{t.tasks.loadingSession}</span>
          </div>
        )}

        {status === "unauthenticated" && (
          <HeroCard
            className="auth-panel"
            aria-label={t.tasks.authLabel}
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
              aria-label={t.tasks.name}
              placeholder={t.tasks.name}
              value={authName}
              variant="secondary"
              onChange={(event) => {
                setAuthName(event.target.value);
              }}
            />
            <HeroInput
              aria-label={t.tasks.email}
              placeholder={t.tasks.email}
              type="email"
              value={authEmail}
              variant="secondary"
              onChange={(event) => {
                setAuthEmail(event.target.value);
              }}
            />
            <HeroInput
              aria-label={t.tasks.password}
              placeholder={t.tasks.password}
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
                {t.tasks.signIn}
              </Button>
              <Button
                className="task-secondary-button"
                type="button"
                variant="secondary"
                onPress={handleRegister}
                isDisabled={isAuthLoading}
              >
                {t.tasks.register}
              </Button>
            </div>
          </HeroCard>
        )}

        {isAuthenticated && (
          <>
            <section className="task-summary" aria-label={t.tasks.summaryLabel}>
              <HeroCard className="task-summary-item">
                <span>{t.tasks.total}</span>
                <strong>{List.length}</strong>
              </HeroCard>
              <HeroCard className="task-summary-item is-pending">
                <span>{t.tasks.pending}</span>
                <strong>{pendingTasks}</strong>
              </HeroCard>
              <HeroCard className="task-summary-item is-active">
                <span>{t.tasks.active}</span>
                <strong>{activeTasks}</strong>
              </HeroCard>
              <HeroCard className="task-summary-item is-done">
                <span>{t.tasks.done}</span>
                <strong>{doneTasks}</strong>
              </HeroCard>
            </section>

            <div className="task-input-bar">
              <HeroInput
                aria-label={t.tasks.newTask}
                placeholder={t.tasks.newTask}
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
                {t.tasks.add}
              </Button>

            </div>

            <section
              className="task-list"
              aria-label={t.tasks.tasksLabel}
            >

              {isMounted ? (
                <>

                  {List.length === 0 && (
                    <HeroCard className="task-empty">
                      {t.tasks.empty}
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
                        commentCount={task.comments?.length ?? 0}
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
                  <span>{t.tasks.loadingTasks}</span>
                </div>

              )}

            </section>
          </>
        )}
      </section>
    </main>
  );
}
