import { NextResponse } from "next/server";
import { connectBD } from "@/lib/mongodb";
import { Task } from "@/models/TaskDB";

// GET TASKS
export async function GET() {
  await connectBD();

  const tasks = await Task.find();
  return NextResponse.json(tasks);
}

// CREATE TASK
export async function POST(req: Request) {

  await connectBD();
  const body = await req.json();

  const newTask = await Task.create({
    title: body.title,
    state: body.state,
    totalTime: body.totalTime,
    startedAt: body.startedAt,
    date: body.date,
  });

  return NextResponse.json(newTask);
}
