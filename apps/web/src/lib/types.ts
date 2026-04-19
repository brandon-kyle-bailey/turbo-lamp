export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Account {
  id: string;
  userId: string;
  provider: string;
  providerAccountId: string;
}

export interface Calendar {
  id: string;
  userId: string;
  name: string;
  color: string;
  isDefault: boolean;
}

export interface AvailabilityOverride {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface MeetingGroup {
  id: string;
  title: string;
  description?: string;
  organizerId: string;
  calendarId: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  createdAt: string;
}

export interface Meeting {
  id: string;
  meetingGroupId: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetingLink?: string;
}

export interface MeetingParticipant {
  id: string;
  meetingGroupId: string;
  userId: string;
  status: "pending" | "accepted" | "declined";
  invitedAt: string;
  respondedAt?: string;
}

export interface MeetingAttendee {
  id: string;
  meetingId: string;
  userId: string;
  attended: boolean;
}

export interface MeetingGroupWithDetails extends MeetingGroup {
  participants: (MeetingParticipant & { user: User })[];
  meetings: Meeting[];
}

export interface PendingInvitation {
  id: string;
  meetingGroup: MeetingGroup;
  organizer: User;
  invitedAt: string;
}

export interface WeeklyAvailability {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isEnabled: boolean;
}

export interface ConnectedCalendar {
  id: string;
  provider: "google" | "outlook" | "apple";
  email: string;
  name: string;
  color: string;
  isEnabled: boolean;
  lastSynced: string;
}

export interface AccountSettings {
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  defaultMeetingDuration: number;
  bufferBetweenMeetings: number;
  notifications: {
    email: boolean;
    push: boolean;
    reminderMinutes: number;
  };
}
