import { NextRequest, NextResponse } from 'next/server';
import { users, projectMembers, ProjectMember, User } from '../../../mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    
    // Get all members for this project
    const members = projectMembers.filter(member => member.projectId === projectId);
    
    // Get user details for each member
    const projectUsers = members.map(member => {
      const user = users.find(u => u.id === member.userId);
      return {
        ...user,
        role: member.role,
        addedAt: member.addedAt,
      };
    }).filter(Boolean);

    return NextResponse.json(projectUsers);
  } catch (error) {
    console.error('Error fetching project members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project members' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const { userId, role = 'MEMBER' } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = users.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const existingMember = projectMembers.find(
      member => member.projectId === projectId && member.userId === userId
    );

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this project' },
        { status: 400 }
      );
    }

    // Add user to project
    const newMember: ProjectMember = {
      projectId,
      userId,
      role: role as "MEMBER" | "ADMIN",
      addedAt: new Date().toISOString(),
    };

    projectMembers.push(newMember);

    // Return the user with role info
    const memberWithDetails = {
      ...user,
      role: newMember.role,
      addedAt: newMember.addedAt,
    };

    return NextResponse.json(memberWithDetails, { status: 201 });
  } catch (error) {
    console.error('Error adding user to project:', error);
    return NextResponse.json(
      { error: 'Failed to add user to project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Find the member to remove
    const memberIndex = projectMembers.findIndex(
      member => member.projectId === projectId && member.userId === userId
    );

    if (memberIndex === -1) {
      return NextResponse.json(
        { error: 'User is not a member of this project' },
        { status: 404 }
      );
    }

    // Remove the member
    projectMembers.splice(memberIndex, 1);

    return NextResponse.json({ message: 'User removed from project successfully' });
  } catch (error) {
    console.error('Error removing user from project:', error);
    return NextResponse.json(
      { error: 'Failed to remove user from project' },
      { status: 500 }
    );
  }
}
