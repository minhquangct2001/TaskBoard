import { NextResponse } from 'next/server';
import { projects } from '../mockData';

export async function GET() {
  return NextResponse.json(projects);
}