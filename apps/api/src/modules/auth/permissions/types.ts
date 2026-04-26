export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum ResourceType {
  USER = 'user',
  CALENDAR = 'calendar',
  AVAILABILITY = 'availability',
  AVAILABILITY_INTERVAL = 'availability_interval',
  AVAILABILITY_OVERRIDE = 'availability_override',
  MEETING_GROUP = 'meeting_group',
  MEETING_GROUP_VERSION = 'meeting_group_version',
  MEETING = 'meeting',
  MEETING_PARTICIPANT = 'meeting_participant',
  MEETING_ATTENDEE = 'meeting_attendee',
}

export interface AuthContext {
  userId: string;
  accountId: string;
  roles?: string[];
}

export interface Resource {
  type: ResourceType;
  id: string;
  ownerId?: string;
  creatorId?: string;
  meetingGroupId?: string;
  meetingId?: string;
  userId?: string;
}

export interface PermissionResult {
  allowed: boolean;
  scope?: 'owner' | 'participant' | 'delegate' | 'system';
  reason?: string;
}

export const RESOURCE_OWNER_FIELD: Record<ResourceType, string | null> = {
  [ResourceType.USER]: 'id',
  [ResourceType.CALENDAR]: 'userId',
  [ResourceType.AVAILABILITY]: 'userId',
  [ResourceType.AVAILABILITY_INTERVAL]: 'userId',
  [ResourceType.AVAILABILITY_OVERRIDE]: 'userId',
  [ResourceType.MEETING_GROUP]: 'creatorId',
  [ResourceType.MEETING_GROUP_VERSION]: 'creatorId',
  [ResourceType.MEETING]: 'meetingGroupId',
  [ResourceType.MEETING_PARTICIPANT]: 'meetingGroupId',
  [ResourceType.MEETING_ATTENDEE]: 'meetingId',
};

export const RESOURCE_PARTICIPANT_FIELD: Record<ResourceType, string | null> = {
  [ResourceType.USER]: null,
  [ResourceType.CALENDAR]: null,
  [ResourceType.AVAILABILITY]: null,
  [ResourceType.AVAILABILITY_INTERVAL]: null,
  [ResourceType.AVAILABILITY_OVERRIDE]: null,
  [ResourceType.MEETING_GROUP]: 'meetingGroupId',
  [ResourceType.MEETING_GROUP_VERSION]: 'meetingGroupId',
  [ResourceType.MEETING]: 'meetingId',
  [ResourceType.MEETING_PARTICIPANT]: null,
  [ResourceType.MEETING_ATTENDEE]: null,
};
