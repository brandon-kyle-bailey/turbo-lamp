export enum EnvironmentVariables {
  ALLOWED_ORIGINS = 'ALLOWED_ORIGINS',
  DATABASE_URL = 'DATABASE_URL',
  REDIS_URL = 'REDIS_URL',
  JWT_PRIVATE = 'JWT_PRIVATE',
  JWT_PUBLIC = 'JWT_PUBLIC',
  FRONTEND_URL = 'FRONTEND_URL',
  GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_ID',
  GOOGLE_CLIENT_SECRET = 'GOOGLE_CLIENT_SECRET',
  GOOGLE_CALLBACK_URL = 'GOOGLE_CALLBACK_URL',
  GITHUB_CLIENT_ID = 'GITHUB_CLIENT_ID',
  GITHUB_CLIENT_SECRET = 'GITHUB_CLIENT_SECRET',
  GITHUB_CALLBACK_URL = 'GITHUB_CALLBACK_URL',
  TOKEN_TTL = 'TOKEN_TTL',
  RESEND_API_KEY = 'RESEND_API_KEY',
  RESEND_FROM_EMAIL = 'RESEND_FROM_EMAIL',
}

export type PROVIDERS = 'github' | 'google';
export const STRATEGIES: PROVIDERS[] = ['google', 'github'];

export enum CalendarProvider {
  GOOGLE = 'google',
}

export enum AccountProvider {
  CREDENTIALS = 'credentials',
  GOOGLE = 'google',
  GITHUB = 'github',
}

export enum MeetingGroupStatus {
  OPEN = 'open',
  FINALIZED = 'finalized',
  CANCELLED = 'cancelled',
}

export enum MeetingStatus {
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
}

export const SANITIZED_ROUTES = {
  dashboard: '/dashboard',
  onboarding_complete: '/onboarding/complete',
} as const;

export type VERIFICATION_TYPES = 'oauth_state' | 'invite';

export interface VerificationValue {
  type: VERIFICATION_TYPES;
  id: string;
  after: keyof typeof SANITIZED_ROUTES;
}
