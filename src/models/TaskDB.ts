import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  date: {
    type: String,
    default: "",
  },

  startedAt: {
    type: Number,
    default: null,
  },

  totalTime: {
    type: Number,
    default: 0,
  },

  state: {
    type: String,
    enum: ["pending", "inProgress", "done"],
    default: "pending",
  },
});

export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
