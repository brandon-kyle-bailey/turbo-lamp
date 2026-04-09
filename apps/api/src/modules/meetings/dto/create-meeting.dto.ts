import { MeetingStatus } from '../../../lib/constants';

export class CreateMeetingDto {
  meetingGroupId: string;
  start_at: Date;
  end_at: Date;
  status: MeetingStatus;
}
