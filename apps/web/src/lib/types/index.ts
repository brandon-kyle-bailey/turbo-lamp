// Calendar types
export interface Calendar {
  id: string;
  name: string;
  description?: string;
  color?: string;
  timezone?: string;
  is_primary?: boolean;
  external_calendar_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ExternalCalendar {
  id: string;
  name: string;
  provider: "google" | "outlook" | "apple" | "other";
  account_email?: string;
  is_connected: boolean;
  last_synced_at?: string;
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

export interface AvailabilityDay {
  day: DayOfWeek;
  enabled: boolean;
  blocks: TimeBlock[];
}

export interface Availability {
  id: string;
  name: string;
  timezone: string;
  days: AvailabilityDay[];
  created_at: string;
  updated_at: string;
}

export interface AvailabilityOverride {
  id: string;
  availability_id: string;
  date: string; // ISO date string
  override_type: "unavailable" | "custom";
  blocks?: TimeBlock[];
  reason?: string;
  created_at: string;
  updated_at: string;
}

// Meeting Group types
export type MeetingGroupStatus = "draft" | "scheduling" | "scheduled";

export interface MeetingGroup {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  duration_minutes: number;
  after_datetime: string;
  before_datetime: string;
  calendar_id?: string;
  status: MeetingGroupStatus;
  participants_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingGroupPayload {
  summary: string;
  description?: string;
  location?: string;
  duration_minutes: number;
  after_datetime: string;
  before_datetime: string;
  calendar_id?: string;
}

// Meeting Participant types
export type ParticipantInvitationState = "pending" | "accepted" | "declined";
export type ParticipantAuthState =
  | "unauthorized"
  | "authorized"
  | "not_required";

export interface MeetingParticipant {
  id: string;
  meeting_group_id: string;
  attendee_id: string;
  invitation_state: ParticipantInvitationState;
  auth_state: ParticipantAuthState;
  attendee?: MeetingAttendee;
  created_at: string;
  updated_at: string;
}

// Meeting Slot types
export interface MeetingSlot {
  id: string;
  meeting_group_id: string;
  start_datetime: string;
  end_datetime: string;
  score?: number;
  participants_available?: string[];
  created_at?: string;
}

export interface CalculatedSlots {
  slots: MeetingSlot[];
  calculated_at: string;
  meeting_group_id: string;
}

// Meeting types
export interface Meeting {
  id: string;
  meeting_group_id: string;
  summary: string;
  description?: string;
  location?: string;
  start_datetime: string;
  end_datetime: string;
  calendar_id?: string;
  meeting_group?: MeetingGroup;
  attendees?: MeetingAttendee[];
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingPayload {
  meeting_group_id: string;
  slot_id?: string;
  start_datetime: string;
  end_datetime: string;
  summary?: string;
  description?: string;
  location?: string;
  calendar_id?: string;
}

// Meeting Attendee types
export type AttendeeStatus = "invited" | "accepted" | "declined";

export interface MeetingAttendee {
  id: string;
  name: string;
  email: string;
  status?: AttendeeStatus;
  meeting_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingAttendeePayload {
  meeting_id: string;
  name: string;
  email: string;
  status?: AttendeeStatus;
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
