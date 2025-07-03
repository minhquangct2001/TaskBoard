import { NextResponse } from 'next/server';
import { tasks, users, projects } from '../mockData';

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, status, assigneeId, projectId, dueDate } = body;

  if (!title || !status || !assigneeId || !projectId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const assignee = users.find((user) => user.id === assigneeId);
  const project = projects.find((proj) => proj.id === projectId);
  if (!assignee) {
    return NextResponse.json({ error: 'Invalid assignee ID' }, { status: 400 });
  }
  if (!project) {
    return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
  }

  const newTask = {
    id: `task-${Math.floor(Math.random() * 10000)}`,
    title,
    description: description || '',
    status,
    assignee: { id: assigneeId, name: assignee.name },
    projectId,
    dueDate: dueDate || null,
  };

  tasks.push(newTask);
  return NextResponse.json(newTask, { status: 201 });
}