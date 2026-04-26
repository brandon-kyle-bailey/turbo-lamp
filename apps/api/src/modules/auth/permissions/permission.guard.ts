import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionAction, ResourceType, AuthContext, Resource } from './types';
import { resolvePermission } from './permission-resolver';

export const PERMISSION_KEY = 'permission';

interface PermissionMetadata {
  action: PermissionAction;
  resourceType: ResourceType;
  resourceIdParam?: string;
}

interface HttpRequest {
  user?: AuthContext;
  params: Record<string, string>;
}

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissionMeta = this.reflector.get<PermissionMetadata>(
      PERMISSION_KEY,
      context.getHandler(),
    );

    if (!permissionMeta) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.userId) {
      throw new ForbiddenException('UNAUTHORIZED');
    }

    const params = request.params;
    const resourceId = permissionMeta.resourceIdParam
      ? params[permissionMeta.resourceIdParam]
      : params.id;

    const resource: Resource = {
      type: permissionMeta.resourceType,
      id: resourceId ?? '',
      userId: params.userId,
      creatorId: params.creatorId,
      meetingGroupId: params.meetingGroupId,
      meetingId: params.meetingId,
    };

    const result = resolvePermission(user, permissionMeta.action, resource);

    if (!result.allowed) {
      throw new ForbiddenException(result.reason ?? 'FORBIDDEN');
    }

    return true;
  }
}

export function SetPermission(
  action: PermissionAction,
  resourceType: ResourceType,
  resourceIdParam?: string,
) {
  return (_target: object, _key: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(
      PERMISSION_KEY,
      { action, resourceType, resourceIdParam },
      descriptor.value,
    );
    return descriptor;
  };
}
