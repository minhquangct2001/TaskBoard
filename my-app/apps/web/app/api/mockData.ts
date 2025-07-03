export type Project = {
  id: string;
  name: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assignee: { id: string; name: string };
  dueDate: string;
  projectId: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
  department: string;
  position: string;
  joinDate: string;
  status: "active" | "inactive" | "pending";
  bio?: string;
};

export type ProjectMember = {
  projectId: string;
  userId: string;
  role: "MEMBER" | "ADMIN";
  addedAt: string;
};

export type LeaderboardEntry = {
  user: string;
  tasksCompleted: number;
  hoursLogged: number;
  efficiency: number;
};

export const projects: Project[] = [
  {
    id: "proj-1",
    name: "Frontend Refactor",
    createdAt: "2025-04-01T10:00:00Z",
  },
  {
    id: "proj-2",
    name: "Mobile MVP",
    createdAt: "2025-04-10T12:00:00Z",
  },
];

export const tasks: Task[] = [
  // Frontend Refactor Project (proj-1) tasks
  {
    id: "task-101",
    title: "Setup Zustand store",
    description: "Implement global state for modal and current project",
    status: "IN_PROGRESS",
    assignee: { id: "user-1", name: "Alice Johnson" },
    dueDate: "2025-05-10",
    projectId: "proj-1",
  },
  {
    id: "task-102",
    title: "Build Table View",
    description: "Use React Table to render task list with sorting",
    status: "TODO",
    assignee: { id: "user-2", name: "Bob Smith" },
    dueDate: "2025-05-11",
    projectId: "proj-1",
  },
  {
    id: "task-103",
    title: "Implement Dark Mode",
    description: "Add theme provider and dark mode toggle functionality",
    status: "TODO",
    assignee: { id: "user-1", name: "Alice Johnson" },
    dueDate: "2025-05-15",
    projectId: "proj-1",
  },
  {
    id: "task-104",
    title: "Responsive Design Updates",
    description: "Ensure all components work properly on mobile devices",
    status: "IN_PROGRESS",
    assignee: { id: "user-2", name: "Bob Smith" },
    dueDate: "2025-05-12",
    projectId: "proj-1",
  },
  {
    id: "task-105",
    title: "Performance Optimization",
    description: "Optimize bundle size and implement code splitting",
    status: "DONE",
    assignee: { id: "user-1", name: "Alice Johnson" },
    dueDate: "2025-05-08",
    projectId: "proj-1",
  },
  {
    id: "task-106",
    title: "Unit Tests for Components",
    description: "Write comprehensive tests for UI components",
    status: "DONE",
    assignee: { id: "user-2", name: "Bob Smith" },
    dueDate: "2025-05-05",
    projectId: "proj-1",
  },

  // Mobile MVP Project (proj-2) tasks
  {
    id: "task-201",
    title: "Mobile App Architecture",
    description: "Define the overall architecture and tech stack for mobile app",
    status: "DONE",
    assignee: { id: "user-3", name: "Charlie Brown" },
    dueDate: "2025-04-15",
    projectId: "proj-2",
  },
  {
    id: "task-202",
    title: "User Authentication Flow",
    description: "Implement login, registration, and password reset",
    status: "IN_PROGRESS",
    assignee: { id: "user-3", name: "Charlie Brown" },
    dueDate: "2025-05-20",
    projectId: "proj-2",
  },
  {
    id: "task-203",
    title: "Core Navigation Setup",
    description: "Set up navigation structure and routing for mobile app",
    status: "IN_PROGRESS",
    assignee: { id: "user-4", name: "Diana Prince" },
    dueDate: "2025-05-18",
    projectId: "proj-2",
  },
  {
    id: "task-204",
    title: "Home Screen UI",
    description: "Design and implement the main dashboard screen",
    status: "TODO",
    assignee: { id: "user-4", name: "Diana Prince" },
    dueDate: "2025-05-25",
    projectId: "proj-2",
  },
  {
    id: "task-205",
    title: "Profile Management",
    description: "Allow users to view and edit their profile information",
    status: "TODO",
    assignee: { id: "user-3", name: "Charlie Brown" },
    dueDate: "2025-05-22",
    projectId: "proj-2",
  },
  {
    id: "task-206",
    title: "Offline Data Sync",
    description: "Implement offline capabilities and data synchronization",
    status: "TODO",
    assignee: { id: "user-3", name: "Charlie Brown" },
    dueDate: "2025-06-01",
    projectId: "proj-2",
  },
  {
    id: "task-207",
    title: "Push Notifications",
    description: "Set up push notification system for mobile app",
    status: "TODO",
    assignee: { id: "user-4", name: "Diana Prince" },
    dueDate: "2025-05-28",
    projectId: "proj-2",
  },
  {
    id: "task-208",
    title: "App Store Preparation",
    description: "Prepare app metadata and assets for app store submission",
    status: "TODO",
    assignee: { id: "user-4", name: "Diana Prince" },
    dueDate: "2025-06-05",
    projectId: "proj-2",
  },
];

export const users: User[] = [
  {
    id: "user-1",
    name: "Alice Johnson",
    email: "alice.johnson@company.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Tech Street, Apt 4B",
      city: "San Francisco",
      country: "United States",
      zipCode: "94105"
    },
    department: "Engineering",
    position: "Senior Frontend Developer",
    joinDate: "2023-01-15",
    status: "active",
    bio: "Passionate frontend developer with 5+ years of experience in React and TypeScript. Loves creating intuitive user interfaces."
  },
  {
    id: "user-2",
    name: "Bob Smith",
    email: "bob.smith@company.com",
    phone: "+1 (555) 234-5678",
    address: {
      street: "456 Design Avenue",
      city: "New York",
      country: "United States",
      zipCode: "10001"
    },
    department: "Design",
    position: "UX/UI Designer",
    joinDate: "2023-03-22",
    status: "active",
    bio: "Creative designer with a keen eye for detail and user-centered design principles. Specializes in mobile and web interfaces."
  },
  {
    id: "user-3",
    name: "Charlie Brown",
    email: "charlie.brown@company.com",
    phone: "+1 (555) 345-6789",
    address: {
      street: "789 Backend Boulevard",
      city: "Seattle",
      country: "United States",
      zipCode: "98101"
    },
    department: "Engineering",
    position: "Backend Developer",
    joinDate: "2022-11-08",
    status: "active",
    bio: "Full-stack developer with expertise in Node.js, Python, and cloud architecture. Enjoys solving complex technical challenges."
  },
  {
    id: "user-4",
    name: "Diana Prince",
    email: "diana.prince@company.com",
    phone: "+1 (555) 456-7890",
    address: {
      street: "321 Product Lane",
      city: "Austin",
      country: "United States",
      zipCode: "73301"
    },
    department: "Product",
    position: "Product Manager",
    joinDate: "2023-06-10",
    status: "active",
    bio: "Strategic product manager with a background in agile methodologies and cross-functional team leadership."
  },
  {
    id: "user-5",
    name: "Eva Martinez",
    email: "eva.martinez@company.com",
    phone: "+1 (555) 567-8901",
    address: {
      street: "654 Marketing Street",
      city: "Los Angeles",
      country: "United States",
      zipCode: "90210"
    },
    department: "Marketing",
    position: "Digital Marketing Specialist",
    joinDate: "2024-01-20",
    status: "pending",
    bio: "Data-driven marketing professional with expertise in digital campaigns, SEO, and brand strategy."
  }
];

export const projectMembers: ProjectMember[] = [
  // Frontend Refactor Project (proj-1) members
  {
    projectId: "proj-1",
    userId: "user-1",
    role: "ADMIN",
    addedAt: "2025-04-01T10:00:00Z",
  },
  {
    projectId: "proj-1",
    userId: "user-2",
    role: "MEMBER",
    addedAt: "2025-04-02T10:00:00Z",
  },
  // Mobile MVP Project (proj-2) members
  {
    projectId: "proj-2",
    userId: "user-3",
    role: "ADMIN",
    addedAt: "2025-04-10T12:00:00Z",
  },
  {
    projectId: "proj-2",
    userId: "user-4",
    role: "MEMBER",
    addedAt: "2025-04-11T10:00:00Z",
  },
];

export const leaderboard: LeaderboardEntry[] = [
  {
    user: "Alice",
    tasksCompleted: 12,
    hoursLogged: 40,
    efficiency: 0.3,
  },
  {
    user: "Bob",
    tasksCompleted: 8,
    hoursLogged: 20,
    efficiency: 0.4,
  },
];
