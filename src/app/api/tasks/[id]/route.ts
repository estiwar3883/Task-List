import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectBD } from "@/lib/mongodb";
import { Task } from "@/models/TaskDB";

type TaskRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const getUserId = async () => {
  const session = await auth();

  return session?.user?.id;
};

const unauthorizedResponse = () => {
  return NextResponse.json(
    {
      message: "Unauthorized",
    },
    {
      status: 401,
    }
  );
};

// UPDATE TASK
export async function PATCH(req: Request, { params }: TaskRouteContext) {
  const userId = await getUserId();

  if (!userId) {
    return unauthorizedResponse();
  }

  await connectBD();

  const body = await req.json();
  const { id } = await params;
  const safeBody = {
    ...body,
  };

  delete safeBody.userId;
  delete safeBody._id;

  const updatedTask = await Task.findOneAndUpdate(
    {
      _id: id,
      userId,
    },
    safeBody,
    {
      new: true,
    }
  );

  if (!updatedTask) {
    return NextResponse.json(
      {
        message: "Task not found",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(updatedTask);
}

export async function PUT(req: Request, context: TaskRouteContext) {
  return PATCH(req, context);
}

// DELETE TASK
export async function DELETE(_req: Request, { params }: TaskRouteContext) {
  const userId = await getUserId();

  if (!userId) {
    return unauthorizedResponse();
  }

  await connectBD();

  const { id } = await params;
  const deletedTask = await Task.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!deletedTask) {
    return NextResponse.json(
      {
        message: "Task not found",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    message: "Task deleted",
  });
}
