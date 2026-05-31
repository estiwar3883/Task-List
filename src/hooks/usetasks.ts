"use client";

import { useCallback, useEffect, useState } from "react";
import type { Task } from "../types/task";

export const useTasks = (enabled = true) => {

    const [Input, setInput] = useState("");
    const [List, setList] = useState<Task[]>([]);

    // REFRESH TIMER UI
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // GET TASKS FROM MONGODB
    const getTasks = useCallback(async () => {
        if (!enabled) {
            setList([]);
            return;
        }

        try {
            const response = await fetch("/api/tasks");

            if (!response.ok) {
                setList([]);
                return;
            }

            const data = await response.json();
            setList(data);
        } catch (error) {
            console.log(error);
        }
    }, [enabled]);

    useEffect(() => {
        const frameId = requestAnimationFrame(() => {
            getTasks();
        });

        return () => cancelAnimationFrame(frameId);
    }, [getTasks]);

    // ADD TASK
    const addTask = async () => {
        if (!Input.trim() || !enabled) return;
        try {

            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: Input.trim(),
                    state: "pending",
                    totalTime: 0,
                    startedAt: null,
                    date: "",
                }),
            });

            if (!response.ok) {
                return;
            }

            const newTask = await response.json();
            setList((prev) => [...prev, newTask]);
            setInput("");
        } catch (error) {
            console.log(error);

        }
    };

    // GET CURRENT TIME
    const getCurrentTime = (task: Task) => {
        if (
            task.state !== "inProgress" ||
            !task.startedAt
        ) {
            return task.totalTime;
        }
        return (
            task.totalTime +
            Math.floor(
                (Date.now() - task.startedAt) / 1000
            )
        );
    };

    // CHANGE TASK STATE
    const changeTaskState = async (id: string) => {
        try {
            const task = List.find(
                (task) => task._id === id
            );
            if (!task) return;
            let updatedTask: Task;

            // START TASK
            if (task.state === "pending") {
                updatedTask = {
                    ...task,
                    state: "inProgress",
                    startedAt: Date.now(),
                    date: new Date().toLocaleString(),
                };
            }

            // FINISH TASK
            else if (task.state === "inProgress") {
                const extraTime =
                    Math.floor(
                        (Date.now() - task.startedAt!) / 1000
                    );
                updatedTask = {
                    ...task,
                    state: "done",
                    totalTime:
                        task.totalTime + extraTime,
                    startedAt: null,
                    date: new Date().toLocaleString(),
                };
            }

            // DELETE TASK IF DONE
            else {
                const response = await fetch(`/api/tasks/${id}`, {
                    method: "DELETE",
                });

                if (!response.ok) {
                    return;
                }

                setList((tasks) =>
                    tasks.filter(
                        (task) => task._id !== id
                    )
                );
                return;
            }

            // UPDATE DATABASE
            const response = await fetch(`/api/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) {
                return;
            }

            const savedTask = await response.json();

            // UPDATE UI
            setList((tasks) =>
                tasks.map((task) =>
                    task._id === id
                        ? savedTask
                        : task
                )
            );

        } catch (error) {
            console.log(error);
        }
    };

    // EDIT TASK TITLE
    const editTaskTitle = async (id: string, title: string) => {
        const cleanTitle = title.trim();
        if (!cleanTitle) return;

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: cleanTitle,
                }),
            });

            if (!response.ok) {
                return;
            }

            const updatedTask = await response.json();

            setList((tasks) =>
                tasks.map((task) =>
                    task._id === id
                        ? {
                            ...task,
                            title: updatedTask.title ?? cleanTitle,
                        }
                        : task
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    return {
        Input,
        setInput,
        List,
        addTask,
        changeTaskState,
        editTaskTitle,
        getCurrentTime,
    };
};
