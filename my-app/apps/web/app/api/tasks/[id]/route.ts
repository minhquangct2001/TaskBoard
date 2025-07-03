// app/api/tasks/[id]/route.ts
import { NextResponse } from "next/server";
import { tasks } from "../../mockData";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const task = tasks.find((task) => task.id === params.id);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  return NextResponse.json(task);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const taskIndex = tasks.findIndex((task) => task.id === params.id);
    
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Update only the provided fields (partial update)
    const updatedTask = { ...tasks[taskIndex], ...body };
    tasks[taskIndex] = updatedTask;

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const taskIndex = tasks.findIndex((task) => task.id === params.id);
  
  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  return NextResponse.json(deletedTask);
}