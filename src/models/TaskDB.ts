import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  completed: {
    type: Boolean,
    default: false,
  },
});

export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);