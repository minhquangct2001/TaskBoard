'use client';

import { Project, User, ProjectMember } from '../api/mockData';
import { get, del } from '@workspace/ui/lib/apiClients';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import React, { useEffect, useState } from 'react';
import { InviteUserModal } from '../../components/forms/invite-user-modal';
import { UserPlus, Users, X, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@workspace/ui/components/separator';

type ProjectMemberWithUser = User & {
  role: string;
  addedAt: string;
};

const Page = () => {
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [viewingMembers, setViewingMembers] = useState<Project | null>(null);
    const [projectMembers, setProjectMembers] = useState<ProjectMemberWithUser[]>([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await get<Project[]>('/api/projects');
                setProjects(data);
            } catch (err) {
                setError('Failed to fetch projects. Please try again.');
                console.error('API Error:', err);
            }
        };
        fetchProjects();
    }, []);

    const fetchProjectMembers = async (projectId: string) => {
        try {
            setLoadingMembers(true);
            const members = await get<ProjectMemberWithUser[]>(`/api/projects/${projectId}/members`);
            setProjectMembers(members);
        } catch (err) {
            console.error('Error fetching project members:', err);
            toast.error('Failed to load project members');
        } finally {
            setLoadingMembers(false);
        }
    };

    const handleViewMembers = async (project: Project) => {
        setViewingMembers(project);
        await fetchProjectMembers(project.id);
    };

    const handleRemoveMember = async (userId: string) => {
        if (!viewingMembers) return;
        
        try {
            await del(`/api/projects/${viewingMembers.id}/members?userId=${userId}`);
            toast.success('User removed from project');
            await fetchProjectMembers(viewingMembers.id);
        } catch (err) {
            console.error('Error removing member:', err);
            toast.error('Failed to remove user from project');
        }
    };

    const handleUserAdded = () => {
        if (viewingMembers) {
            fetchProjectMembers(viewingMembers.id);
        }
    };

    if (error) return (
        <div className="container mx-auto p-8">
            <Card className="border-destructive">
                <CardContent className="pt-6">
                    <div className="text-center text-destructive">{error}</div>
                </CardContent>
            </Card>
        </div>
    );
    
    if (!projects) return (
        <div className="container mx-auto p-8">
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">Loading...</div>
                </CardContent>
            </Card>
        </div>
    );

    if (viewingMembers) {
        return (
            <div className="container mx-auto p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">
                            {viewingMembers.name}
                        </h1>
                        <p className="text-muted-foreground">
                            Manage project members and their roles
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setSelectedProject(viewingMembers)}
                            className="gap-2"
                        >
                            <UserPlus className="h-4 w-4" />
                            Add Member
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setViewingMembers(null)}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Projects
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Project Members
                        </CardTitle>
                        <CardDescription>
                            {projectMembers.length} member{projectMembers.length !== 1 ? 's' : ''} in this project
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingMembers ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="text-center space-y-2">
                                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                                    <p className="text-sm text-muted-foreground">Loading members...</p>
                                </div>
                            </div>
                        ) : projectMembers.length === 0 ? (
                            <div className="text-center py-8 space-y-3">
                                <Users className="h-12 w-12 text-muted-foreground mx-auto" />
                                <div>
                                    <p className="text-lg font-medium">No members found</p>
                                    <p className="text-muted-foreground">Add some members to get started</p>
                                </div>
                                <Button
                                    onClick={() => setSelectedProject(viewingMembers)}
                                    className="gap-2"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Add First Member
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {projectMembers.map((member, index) => (
                                    <div key={member.id}>
                                        {index > 0 && <Separator />}
                                        <div className="flex items-center justify-between py-3">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-primary">
                                                            {member.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium">{member.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant={member.role === 'ADMIN' ? 'default' : 'secondary'}>
                                                            {member.role}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            Added {new Date(member.addedAt).toLocaleDateString('en-GB', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: '2-digit',
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveMember(member.id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8 space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <p className="text-muted-foreground">
                    Manage your projects and team members
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg">{project.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Created {new Date(project.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {project.id}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewMembers(project)}
                                    className="flex-1 gap-2"
                                >
                                    <Users className="h-4 w-4" />
                                    Members
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => setSelectedProject(project)}
                                    className="flex-1 gap-2"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Add User
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedProject && (
                <InviteUserModal
                    isOpen={!!selectedProject}
                    onClose={() => setSelectedProject(null)}
                    projectId={selectedProject.id}
                    projectName={selectedProject.name}
                    onUserAdded={handleUserAdded}
                />
            )}
        </div>
    );
};

export default Page;