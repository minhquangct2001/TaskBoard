import { NextRequest, NextResponse } from 'next/server';
import { users, projectMembers } from '../../../mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    
    // Get all current members of this project
    const currentMembers = projectMembers
      .filter(member => member.projectId === projectId)
      .map(member => member.userId);
    
    // Get all users who are NOT already members
    const availableUsers = users.filter(user => !currentMembers.includes(user.id));

    return NextResponse.json(availableUsers);
  } catch (error) {
    console.error('Error fetching available users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available users' },
      { status: 500 }
    );
  }
}
