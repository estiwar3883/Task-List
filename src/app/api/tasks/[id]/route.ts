import { NextResponse } from "next/server";

import { connectBD } from "@/lib/mongodb";
import { Task } from "@/models/TaskDB";

// UPDATE TASK
export async function PATCH(req: Request,{ params }: { params: Promise<{ id: string }> }) {

  await connectBD();

  const body = await req.json();
  const { id } = await params;
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    body,
    {
      new: true,
    }
  );

  return NextResponse.json(updatedTask);
}

// DELETE TASK
export async function DELETE(req: Request,{ params }: { params: Promise<{ id: string }> }) {

  await connectBD();

  const { id } = await params;
  await Task.findByIdAndDelete(id);

  return NextResponse.json({
    message: "Task deleted",
  });
}