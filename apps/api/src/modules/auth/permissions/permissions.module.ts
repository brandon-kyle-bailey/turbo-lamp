import { Module } from '@nestjs/common';
import { PermissionGuard } from './permission.guard';

@Module({
  providers: [PermissionGuard],
  exports: [PermissionGuard],
})
export class PermissionsModule {}

export * from './types';
export * from './permission-resolver';
export { PermissionGuard, SetPermission } from './permission.guard';
