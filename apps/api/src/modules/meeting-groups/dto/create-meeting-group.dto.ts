import { MeetingGroupStatus } from '../../../lib/constants';

export class CreateMeetingGroupDto {
  creatorId: string;
  title: string;
  duration: number;
  after: Date;
  before: Date;
  timezone: string;
  status: MeetingGroupStatus;
}
