import {
  PermissionAction,
  ResourceType,
  AuthContext,
  Resource,
  PermissionResult,
  RESOURCE_OWNER_FIELD,
} from './types';

export function resolvePermission(
  actor: AuthContext,
  action: PermissionAction,
  resource: Resource,
): PermissionResult {
  if (actor.roles?.includes('system')) {
    return { allowed: true, scope: 'system' };
  }

  const ownerField = RESOURCE_OWNER_FIELD[resource.type];
  if (!ownerField) {
    return { allowed: false, reason: 'resource_type_not_supported' };
  }

  let ownerId: string | undefined;
  switch (ownerField) {
    case 'id':
      ownerId = resource.id;
      break;
    case 'userId':
      ownerId = resource.userId;
      break;
    case 'creatorId':
      ownerId = resource.creatorId;
      break;
    case 'meetingGroupId':
      ownerId = resource.meetingGroupId;
      break;
    case 'meetingId':
      ownerId = resource.meetingId;
      break;
  }

  if (ownerId && ownerId === actor.userId) {
    return { allowed: true, scope: 'owner' };
  }

  const participantField = getParticipantField(resource.type);
  if (participantField && resource[participantField as keyof Resource]) {
    if (action === PermissionAction.READ) {
      return { allowed: true, scope: 'participant' };
    }
    if (
      resource.type === ResourceType.MEETING_PARTICIPANT &&
      action === PermissionAction.UPDATE
    ) {
      if (resource.userId === actor.userId) {
        return { allowed: true, scope: 'participant' };
      }
    }
  }

  return { allowed: false, reason: 'no_relationship' };
}

function getParticipantField(type: ResourceType): string | null {
  switch (type) {
    case ResourceType.MEETING_GROUP:
      return 'meetingGroupId';
    case ResourceType.MEETING:
      return 'meetingId';
    default:
      return null;
  }
}

export function canAccessResource(
  actor: AuthContext,
  action: PermissionAction,
  resource: Resource,
): boolean {
  const result = resolvePermission(actor, action, resource);
  return result.allowed;
}

export function isOwner(actor: AuthContext, resource: Resource): boolean {
  const result = resolvePermission(actor, PermissionAction.READ, resource);
  return result.scope === 'owner';
}

export function isSystem(actor: AuthContext): boolean {
  return actor.roles?.includes('system') ?? false;
}
