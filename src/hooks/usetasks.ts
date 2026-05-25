"use client";

import { useEffect, useState } from "react";
import type { Task } from "../types/task";
import { useLocalStorage } from "./uselocarstorage";



export const useTasks = () => {
    const [Input, setInput] = useState("");
    const [List, setList] = useLocalStorage<Task[]>(
        "tasks",
        []
    );
    // TIMER
    useEffect(() => {
        const activeTask = List.find(
            (task) => task.state === "inProgress"
        );
        if (activeTask) {
            const interval = setInterval(() => {
                setList((tasks) =>
                    tasks.map((task) => {

                        if (task.id !== activeTask.id) {
                            return task;
                        }

                        return {
                            ...task,
                            time: task.time + 1,
                        };
                    })
                );

            }, 1000);
            return () => clearInterval(interval);
        }
    }, [List, setList]);
    // ADD TASK
    const addTask = () => {
        if (!Input.trim()) return;
        const task: Task = {
            id: crypto.randomUUID(),
            title: Input.trim(),
            date: "",
            time: 0,
            state: "pending",
        };
        setList([...List, task]);

        setInput("");
    };

    // CHANGE TASK STATE
    const changeTaskState = (id: string) => {
        setList((tasks) =>
            
            tasks.filter(
                (task) => !(task.id === id && task.state === "Done")
            )
            .map((task) => {
                if (task.id !== id) {
                    return task;
                }
                if (task.state === "pending") {
                    return {
                        ...task,
                        state: "inProgress" as const,
                        date: new Date().toLocaleString(),
                    };
                }
                if (task.state === "inProgress") {
                    return {
                        ...task,
                        state: "Done" as const,
                        date: new Date().toLocaleString(),
                    };
                }
                return task;
            })
        );
    };

    return {
        Input,
        setInput,
        List,
        addTask,
        changeTaskState,
    };
};