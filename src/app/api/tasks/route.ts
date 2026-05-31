import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectBD } from "@/lib/mongodb";
import { Task } from "@/models/TaskDB";

// GET TASKS
export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  await connectBD();

  const tasks = await Task.find({ userId }).lean();
  const normalizedTasks = tasks.map((task) => ({
    ...task,
    state: task.state ?? "pending",
    totalTime: task.totalTime ?? 0,
    startedAt: task.startedAt ?? null,
    date: task.date ?? "",
  }));

  return NextResponse.json(normalizedTasks);
}

// CREATE TASK
export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  await connectBD();
  const body = await req.json();

  const newTask = await Task.create({
    userId,
    title: body.title,
    state: body.state ?? "pending",
    totalTime: body.totalTime ?? 0,
    startedAt: body.startedAt ?? null,
    date: body.date ?? "",
  });

  return NextResponse.json(newTask);
}
