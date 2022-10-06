import { SetMetadata } from '@nestjs/common';

export const metadataKey = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(metadataKey, roles);
