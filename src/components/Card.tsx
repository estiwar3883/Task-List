"use client";

import {
    Button,
    Card as HeroCard,
    Chip,
    Input,
} from "@heroui/react";
import { useState } from "react";
import Link from "next/link";
import type { CardProps } from "../types/cardprops";
import {stateText,buttonText} from "../constants/appConstants";

export const Card = ({
    title,
    date,
    state,
    time,
    _id,
    handleStartButton,
    handleEditTitle,
    commentHref,
}: CardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);

    const formatTime = (
        seconds: number
    ): string => {
        if (seconds < 0) {
            return "00:00:00";
        }
        const hours = Math.floor(seconds / 3600)
            .toString().padStart(2, "0");
        const minutes = Math.floor((seconds % 3600) / 60)
            .toString().padStart(2, "0");
        const secs = (seconds % 60)
            .toString().padStart(2, "0");
        return `${hours}:${minutes}:${secs}`;
    };

    const saveTitle = async () => {
        const cleanTitle = editedTitle.trim();

        if (!cleanTitle) {
            setEditedTitle(title);
            setIsEditing(false);
            return;
        }

        await handleEditTitle(_id, cleanTitle);
        setIsEditing(false);
    };

    return (
        <HeroCard className={`card2 ${state}`}>
            {commentHref ? (
                <Link
                    href={commentHref}
                    className="card-comment-link"
                    aria-label={`Abrir comentarios de ${title}`}
                />
            ) : null}
            <div className="card-content">
                <div className="card-header">
                    <div className="card-title-row">
                        {isEditing ? (
                            <Input
                                className="card-title-input"
                                aria-label="Edit task title"
                                value={editedTitle}
                                autoFocus
                                onChange={(event) => {
                                    setEditedTitle(event.target.value);
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        saveTitle();
                                    }

                                    if (event.key === "Escape") {
                                        setEditedTitle(title);
                                        setIsEditing(false);
                                    }
                                }}
                            />
                        ) : (
                            <h2>{title}</h2>
                        )}

                        <Button
                            className="card-title-edit"
                            aria-label={isEditing ? "Save task title" : "Edit task title"}
                            type="button"
                            isIconOnly
                            variant="ghost"
                            onPress={() => {
                                if (isEditing) {
                                    saveTitle();
                                    return;
                                }

                                setEditedTitle(title);
                                setIsEditing(true);
                            }}
                        >
                            {isEditing ? (
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            ) : (
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="m16.5 3.5 4 4L8 20H4v-4L16.5 3.5Z" />
                                    <path d="m14 6 4 4" />
                                </svg>
                            )}
                        </Button>
                    </div>

                    <Chip className={`card-status ${state}`} size="sm" variant="soft">
                        {stateText[state]}
                    </Chip>
                </div>

                <div className="card-info">

                    <span>
                        {date || "No date recorded"}
                    </span>

                    <strong>
                        {formatTime(time)}
                    </strong>

                </div>
            </div>
            <div className="card-actions-row">
                <Button
                    className="card-action"
                    type="button"
                    variant={state === "done" ? "danger-soft" : "primary"}
                    onPress={() => handleStartButton(_id)}
                >
                    {buttonText[state]}
                </Button>
            </div>
        </HeroCard>
    );
};
