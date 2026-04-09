export class CreateMeetingParticipantDto {
  userId: string;
  meetingGroupId: string;
  email: string;
  oauth_connected: boolean;
  required: boolean;
}
