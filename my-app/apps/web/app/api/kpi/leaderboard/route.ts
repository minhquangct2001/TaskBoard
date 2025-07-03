import { NextResponse } from 'next/server';
import { leaderboard } from '../../mockData';

export async function GET() {
  return NextResponse.json(leaderboard);
}