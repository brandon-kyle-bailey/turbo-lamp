import { User } from "./types";

export const currentUser: User = {
  id: "1",
  name: "Alex Chen",
  email: "alex@company.com",
  image:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  emailVerified: true,
};
export const users: User[] = [
  currentUser,
  {
    id: "2",
    name: "Sarah Miller",
    email: "sarah@company.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    emailVerified: true,
  },
  {
    id: "3",
    name: "James Wilson",
    email: "james@company.com",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    emailVerified: true,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@company.com",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    emailVerified: true,
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@company.com",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    emailVerified: true,
  },
];
