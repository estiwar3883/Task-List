"use client";

import type { CardProps } from "../types/cardprops";
import { stateText, buttonText } from "../constants/appConstants";

export const Card = ({ title, date, state, time, id, handleStartButton }: CardProps) => {
    const formatTime = (seconds: number): string => {
        if (seconds < 0) return "00:00:00";
        const hours = Math.floor(seconds / 3600)
            .toString().padStart(2, "0");
        const minutes = Math.floor((seconds % 3600) / 60)
            .toString().padStart(2, "0");
        const secs = (seconds % 60)
            .toString().padStart(2, "0");

        return `${hours}:${minutes}:${secs}`;
    };
    return (
        <article className={`card2 ${state}`}>
            <div className="card-content">
                <div className="card-header">
                    <h2>{title}</h2>
                    <span className="card-status">{stateText[state]}</span>
                </div>

                <div className="card-info">
                    <span>{date || "No date recorded"}</span>
                    <strong>{formatTime(time)}</strong>
                </div>
            </div>

            <button className="card-action" onClick={() => handleStartButton(id)}>
                {buttonText[state]}
            </button>
        </article>
    )
}
