// INFO: Aligns with Backend contract
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: string;
  image?: string;
}

// INFO: Aligns with Backend contract
// Calendar types
export interface Calendar {
  id: string;
  userId: string;
  providerId: string;
  externalId: string;
  name: string;
  timezone: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// INFO: Aligns with Backend contract
export interface ExternalCalendar {
  calendarId: string;
  providerId: string;
  name?: string;
  description?: string;
  timezone?: string;
  primary?: boolean;
  accessRole?: string;
}

// Availability types
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface TimeBlock {
  start_time: string; // HH:MM
  end_time: string; // HH:MM
}

// INFO: Aligns with Backend contract
export interface Availability {
  id: string;
  userId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// INFO: Aligns with Backend contract
export interface AvailabilityOverride {
  id: string;
  userId: string;
  date: string; // ISO date string
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// INFO: Aligns with Backend contract
// Meeting Group types
export type MeetingGroupStatus = "open" | "finalized" | "cancelled";

// INFO: Aligns with Backend contract
export interface MeetingGroup {
  id: string;
  creatorId: string;
  summary: string;
  description?: string;
  location?: string;
  duration: number;
  after: string;
  before: string;
  calendarId: string;
  status: MeetingGroupStatus;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

// INFO: Aligns with Backend contract
export interface CreateMeetingGroupPayload {
  calendarId: string;
  summary: string;
  description?: string;
  location?: string;
  duration: number;
  after: string;
  before: string;
  timezone: string;
}

// INFO: Aligns with Backend contract
// Meeting Participant types
export type ParticipantInvitationState = "pending" | "accepted" | "declined";
export type ParticipantAuthState =
  | "unauthorized"
  | "authorized"
  | "not_required";

// INFO: Aligns with Backend contract
export interface MeetingParticipant {
  id: string;
  userId: string;
  meetingGroupId: string;
  email: string;
  required: boolean;
  invitationState: ParticipantInvitationState;
  authState: ParticipantAuthState;
  createdAt: string;
  updatedAt: string;
}

// INFO: Aligns with Backend contract
// Meeting Slot types
export interface MeetingSlot {
  id: string;
  meetingGroupId: string;
  meetingGroup?: MeetingGroup;
  start: string;
  end: string;
  rank?: number;
  // participants_available?: string[];
  createdAt?: string;
}

// INFO: Aligns with Backend contract
export type CalculatedSlots = MeetingSlot[];

// INFO: Aligns with Backend contract
// Meeting types
export interface Meeting {
  id: string;
  meetingGroupId: string;
  start: string;
  end: string;
  meeting_group?: MeetingGroup;
  attendees?: MeetingAttendee[];
  createdAt: string;
  updatedAt: string;
}

// INFO: Aligns with Backend contract
export interface CreateMeetingPayload {
  meetingGroupId: string;
  start: string;
  end: string;
}

// INFO: Aligns with Backend contract
export interface MeetingAttendee {
  id: string;
  userId: string;
  user?: User;
  externalEventId: string;
  email: string;
  meetingId: string;
  meeting?: Meeting;
  createdAt: string;
  updatedAt: string;
}

// INFO: Aligns with Backend contract
export interface CreateMeetingAttendeePayload {
  meetingId: string;
  userId: string;
  externalEventId: string;
  email: string;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}
