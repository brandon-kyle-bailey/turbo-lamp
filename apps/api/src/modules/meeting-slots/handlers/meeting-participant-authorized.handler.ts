import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MeetingParticipantAuthorizedCommand } from '../../meeting-participants/commands/meeting-participant-authorized.command';
import { MeetingSlotsService } from '../meeting-slots.service';
import { Inject } from '@nestjs/common';
import { MeetingGroupsService } from '../../meeting-groups/meeting-groups.service';

@CommandHandler(MeetingParticipantAuthorizedCommand)
export class MeetingParticipantAuthorizedHandler implements ICommandHandler<MeetingParticipantAuthorizedCommand> {
  constructor(
    @Inject(MeetingGroupsService)
    private readonly meetingGroupsService: MeetingGroupsService,
    @Inject(MeetingSlotsService)
    private readonly meetingSlotsService: MeetingSlotsService,
  ) {}

  async execute(command: MeetingParticipantAuthorizedCommand) {
    const { entity } = command;

    const actionId = crypto.randomUUID();
    const meetingGroup = await this.meetingGroupsService.findOne(
      entity.meetingGroupId,
    );
    if (!meetingGroup) {
      return { actionId };
    }
    await this.meetingSlotsService.calculate(
      entity.meetingGroupId,
      meetingGroup.creatorId,
    );
    return {
      actionId,
    };
  }
}
