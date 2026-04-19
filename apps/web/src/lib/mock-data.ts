import type {
  User,
  MeetingGroupWithDetails,
  PendingInvitation,
  WeeklyAvailability,
  AvailabilityOverride,
  ConnectedCalendar,
  AccountSettings,
  Calendar,
} from "@/lib/types";

export const currentUser: User = {
  id: "1",
  name: "Alex Chen",
  email: "alex@company.com",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
};

export const users: User[] = [
  currentUser,
  {
    id: "2",
    name: "Sarah Miller",
    email: "sarah@company.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "James Wilson",
    email: "james@company.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@company.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@company.com",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
];

const today = new Date();
const formatDate = (date: Date) => date.toISOString();

export const todaysMeetingGroups: MeetingGroupWithDetails[] = [
  {
    id: "1",
    title: "Q1 Planning Review",
    description: "Review Q1 objectives and set priorities",
    organizerId: "2",
    calendarId: "1",
    startTime: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
    endTime: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
    status: "scheduled",
    createdAt: formatDate(new Date(Date.now() - 86400000 * 3)),
    participants: [
      {
        id: "p1",
        meetingGroupId: "1",
        userId: "1",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[0],
      },
      {
        id: "p2",
        meetingGroupId: "1",
        userId: "2",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[1],
      },
      {
        id: "p3",
        meetingGroupId: "1",
        userId: "3",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[2],
      },
    ],
    meetings: [
      {
        id: "m1",
        meetingGroupId: "1",
        title: "Q1 Planning Review",
        startTime: new Date(today.setHours(10, 0, 0, 0)).toISOString(),
        endTime: new Date(today.setHours(11, 0, 0, 0)).toISOString(),
      },
    ],
  },
  {
    id: "2",
    title: "Design System Sync",
    description: "Weekly design system updates and discussions",
    organizerId: "1",
    calendarId: "1",
    startTime: new Date(today.setHours(14, 30, 0, 0)).toISOString(),
    endTime: new Date(today.setHours(15, 30, 0, 0)).toISOString(),
    status: "scheduled",
    createdAt: formatDate(new Date(Date.now() - 86400000 * 2)),
    participants: [
      {
        id: "p4",
        meetingGroupId: "2",
        userId: "1",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[0],
      },
      {
        id: "p5",
        meetingGroupId: "2",
        userId: "4",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[3],
      },
    ],
    meetings: [
      {
        id: "m2",
        meetingGroupId: "2",
        title: "Design System Sync",
        startTime: new Date(today.setHours(14, 30, 0, 0)).toISOString(),
        endTime: new Date(today.setHours(15, 30, 0, 0)).toISOString(),
      },
    ],
  },
  {
    id: "3",
    title: "Engineering Standup",
    description: "Daily engineering team standup",
    organizerId: "3",
    calendarId: "1",
    startTime: new Date(today.setHours(9, 0, 0, 0)).toISOString(),
    endTime: new Date(today.setHours(9, 30, 0, 0)).toISOString(),
    status: "completed",
    createdAt: formatDate(new Date(Date.now() - 86400000)),
    participants: [
      {
        id: "p6",
        meetingGroupId: "3",
        userId: "1",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[0],
      },
      {
        id: "p7",
        meetingGroupId: "3",
        userId: "3",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[2],
      },
      {
        id: "p8",
        meetingGroupId: "3",
        userId: "5",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[4],
      },
    ],
    meetings: [
      {
        id: "m3",
        meetingGroupId: "3",
        title: "Engineering Standup",
        startTime: new Date(today.setHours(9, 0, 0, 0)).toISOString(),
        endTime: new Date(today.setHours(9, 30, 0, 0)).toISOString(),
      },
    ],
  },
];

const tomorrow = new Date(Date.now() + 86400000);
const nextWeek = new Date(Date.now() + 86400000 * 7);

export const upcomingMeetingGroups: MeetingGroupWithDetails[] = [
  {
    id: "4",
    title: "Product Roadmap Discussion",
    description: "Discuss upcoming product features and timeline",
    organizerId: "1",
    calendarId: "1",
    startTime: new Date(tomorrow.setHours(11, 0, 0, 0)).toISOString(),
    endTime: new Date(tomorrow.setHours(12, 0, 0, 0)).toISOString(),
    status: "scheduled",
    createdAt: formatDate(new Date(Date.now() - 86400000)),
    participants: [
      {
        id: "p9",
        meetingGroupId: "4",
        userId: "1",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[0],
      },
      {
        id: "p10",
        meetingGroupId: "4",
        userId: "2",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[1],
      },
      {
        id: "p11",
        meetingGroupId: "4",
        userId: "4",
        status: "pending",
        invitedAt: formatDate(new Date()),
        user: users[3],
      },
    ],
    meetings: [
      {
        id: "m4",
        meetingGroupId: "4",
        title: "Product Roadmap Discussion",
        startTime: new Date(tomorrow.setHours(11, 0, 0, 0)).toISOString(),
        endTime: new Date(tomorrow.setHours(12, 0, 0, 0)).toISOString(),
      },
    ],
  },
  {
    id: "5",
    title: "Client Presentation",
    description: "Present Q1 results to stakeholders",
    organizerId: "2",
    calendarId: "1",
    startTime: new Date(tomorrow.setHours(15, 0, 0, 0)).toISOString(),
    endTime: new Date(tomorrow.setHours(16, 30, 0, 0)).toISOString(),
    status: "scheduled",
    createdAt: formatDate(new Date(Date.now() - 86400000 * 5)),
    participants: [
      {
        id: "p12",
        meetingGroupId: "5",
        userId: "1",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[0],
      },
      {
        id: "p13",
        meetingGroupId: "5",
        userId: "2",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[1],
      },
      {
        id: "p14",
        meetingGroupId: "5",
        userId: "3",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[2],
      },
      {
        id: "p15",
        meetingGroupId: "5",
        userId: "5",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[4],
      },
    ],
    meetings: [
      {
        id: "m5",
        meetingGroupId: "5",
        title: "Client Presentation",
        startTime: new Date(tomorrow.setHours(15, 0, 0, 0)).toISOString(),
        endTime: new Date(tomorrow.setHours(16, 30, 0, 0)).toISOString(),
      },
    ],
  },
  {
    id: "6",
    title: "Team Retrospective",
    description: "Monthly team retrospective session",
    organizerId: "4",
    calendarId: "1",
    startTime: new Date(nextWeek.setHours(14, 0, 0, 0)).toISOString(),
    endTime: new Date(nextWeek.setHours(15, 30, 0, 0)).toISOString(),
    status: "scheduled",
    createdAt: formatDate(new Date()),
    participants: [
      {
        id: "p16",
        meetingGroupId: "6",
        userId: "1",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[0],
      },
      {
        id: "p17",
        meetingGroupId: "6",
        userId: "4",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[3],
      },
      {
        id: "p18",
        meetingGroupId: "6",
        userId: "5",
        status: "accepted",
        invitedAt: formatDate(new Date()),
        user: users[4],
      },
    ],
    meetings: [
      {
        id: "m6",
        meetingGroupId: "6",
        title: "Team Retrospective",
        startTime: new Date(nextWeek.setHours(14, 0, 0, 0)).toISOString(),
        endTime: new Date(nextWeek.setHours(15, 30, 0, 0)).toISOString(),
      },
    ],
  },
];

export const pendingInvitations: PendingInvitation[] = [
  {
    id: "inv1",
    meetingGroup: {
      id: "7",
      title: "Marketing Strategy Session",
      description: "Align on Q2 marketing initiatives",
      organizerId: "5",
      calendarId: "1",
      startTime: new Date(Date.now() + 86400000 * 3).toISOString(),
      endTime: new Date(Date.now() + 86400000 * 3 + 3600000).toISOString(),
      status: "scheduled",
      createdAt: formatDate(new Date(Date.now() - 3600000)),
    },
    organizer: users[4],
    invitedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "inv2",
    meetingGroup: {
      id: "8",
      title: "Budget Review Meeting",
      description: "Review department budgets",
      organizerId: "2",
      calendarId: "1",
      startTime: new Date(Date.now() + 86400000 * 5).toISOString(),
      endTime: new Date(Date.now() + 86400000 * 5 + 5400000).toISOString(),
      status: "scheduled",
      createdAt: formatDate(new Date(Date.now() - 7200000)),
    },
    organizer: users[1],
    invitedAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const weeklyAvailability: WeeklyAvailability[] = [
  {
    id: "wa1",
    dayOfWeek: 0,
    startTime: "09:00",
    endTime: "17:00",
    isEnabled: false,
  },
  {
    id: "wa2",
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
    isEnabled: true,
  },
  {
    id: "wa3",
    dayOfWeek: 2,
    startTime: "09:00",
    endTime: "17:00",
    isEnabled: true,
  },
  {
    id: "wa4",
    dayOfWeek: 3,
    startTime: "09:00",
    endTime: "17:00",
    isEnabled: true,
  },
  {
    id: "wa5",
    dayOfWeek: 4,
    startTime: "09:00",
    endTime: "17:00",
    isEnabled: true,
  },
  {
    id: "wa6",
    dayOfWeek: 5,
    startTime: "09:00",
    endTime: "12:00",
    isEnabled: true,
  },
  {
    id: "wa7",
    dayOfWeek: 6,
    startTime: "09:00",
    endTime: "17:00",
    isEnabled: false,
  },
];

export const availabilityOverrides: AvailabilityOverride[] = [
  {
    id: "ao1",
    userId: "1",
    date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    startTime: "00:00",
    endTime: "00:00",
    isAvailable: false,
  },
  {
    id: "ao2",
    userId: "1",
    date: new Date(Date.now() + 86400000 * 10).toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "14:00",
    isAvailable: true,
  },
  {
    id: "ao3",
    userId: "1",
    date: new Date(Date.now() + 86400000 * 15).toISOString().split("T")[0],
    startTime: "00:00",
    endTime: "00:00",
    isAvailable: false,
  },
];

export const connectedCalendars: ConnectedCalendar[] = [
  {
    id: "cc1",
    provider: "google",
    email: "alex@gmail.com",
    name: "Personal",
    color: "#4285F4",
    isEnabled: true,
    lastSynced: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "cc2",
    provider: "google",
    email: "alex@company.com",
    name: "Work",
    color: "#34A853",
    isEnabled: true,
    lastSynced: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "cc3",
    provider: "outlook",
    email: "alex.chen@outlook.com",
    name: "Outlook Calendar",
    color: "#0078D4",
    isEnabled: false,
    lastSynced: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const calendars: Calendar[] = [
  { id: "1", userId: "1", name: "Work", color: "#4285F4", isDefault: true },
  {
    id: "2",
    userId: "1",
    name: "Personal",
    color: "#34A853",
    isDefault: false,
  },
  {
    id: "3",
    userId: "1",
    name: "Side Projects",
    color: "#FBBC04",
    isDefault: false,
  },
];

export const accountSettings: AccountSettings = {
  timezone: "America/New_York",
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12h",
  defaultMeetingDuration: 30,
  bufferBetweenMeetings: 15,
  notifications: {
    email: true,
    push: true,
    reminderMinutes: 15,
  },
};

export const allMeetingGroups: MeetingGroupWithDetails[] = [
  ...todaysMeetingGroups,
  ...upcomingMeetingGroups,
];
