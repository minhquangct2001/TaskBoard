import { NextResponse } from 'next/server';
import { tasks } from '../../../mockData';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const projectTasks = tasks.filter((task) => task.projectId === params.id);
  if (projectTasks.length === 0) {
    return NextResponse.json({ error: 'No tasks found for this project' }, { status: 404 });
  }
  return NextResponse.json(projectTasks);
}