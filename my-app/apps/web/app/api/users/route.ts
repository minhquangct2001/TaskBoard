import { NextResponse } from 'next/server';
import { users } from '../mockData';

export async function GET() {
  return NextResponse.json(users);
}