'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { get } from '@workspace/ui/lib/apiClients';
import React, { useEffect, useState } from 'react';
import { User } from '../api/mockData';
import Loading from './loading';
import * as Avatar from '@radix-ui/react-avatar';
import { Mail, Phone, MapPin, Building, Calendar, User as UserIcon } from 'lucide-react';
import { Separator } from '@workspace/ui/components/separator';
import { ClientOnly } from '@/components/client-only';

const Page = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchUsers = async () => {
      try {
        const data = await get<User[]>('/api/users');
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users. Please try again.');
        console.error('API Error:', err);
      }
    };
    fetchUsers();
  }, []);

  // Generate avatar URL based on user name
  const getAvatarUrl = (name: string) => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=000000&textColor=ffffff`;
  };

  // Get status color variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'outline';
    }
  };

  // Safe date formatting to prevent hydration mismatches
  const formatJoinDate = (dateString: string) => {
    if (!isClient) return 'Loading...';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
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
  
  if (!users || !isClient) return (
    <div className="container mx-auto p-8">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">User Profiles</h1>
        <p className="text-muted-foreground">
          View and manage team member profiles and information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start space-x-4">
                <Avatar.Root className="bg-blackA1 inline-flex h-16 w-16 select-none items-center justify-center overflow-hidden rounded-full align-middle">
                  <Avatar.Image
                    className="h-full w-full rounded-full object-cover"
                    src={getAvatarUrl(user.name)}
                    alt={user.name}
                  />
                  <Avatar.Fallback
                    className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-primary text-[15px] font-medium text-primary-foreground"
                    delayMs={600}
                  >
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <CardDescription className="text-sm">{user.position}</CardDescription>
                  <div className="mt-2">
                    <Badge variant={getStatusVariant(user.status)} className="capitalize">
                      {user.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">{user.email}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user.phone}</span>
                </div>
                
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-muted-foreground">
                    <div>{user.address.street}</div>
                    <div>{user.address.city}, {user.address.country}</div>
                    <div>{user.address.zipCode}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user.department}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    <ClientOnly fallback="Joined Loading...">
                      Joined {formatJoinDate(user.joinDate)}
                    </ClientOnly>
                  </span>
                </div>
              </div>
              
              {user.bio && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">About</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {user.bio}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

};

export default Page;