import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountProvider } from '../../../lib/constants';
import { ExternalCalendarService } from '../../calendars/external-calendar.service';
import { MeetingAttendeesService } from '../../meeting-attendees/meeting-attendees.service';
import { MeetingCreatedCommand } from '../../meetings/commands/meeting-created.command';
import { MeetingGroupsService } from '../meeting-groups.service';

@CommandHandler(MeetingCreatedCommand)
export class MeetingCreatedHandler implements ICommandHandler<MeetingCreatedCommand> {
  constructor(
    @Inject(MeetingGroupsService)
    private readonly meetingGroupsService: MeetingGroupsService,
    @Inject(MeetingAttendeesService)
    private readonly meetingAttendeesService: MeetingAttendeesService,
    @Inject(ExternalCalendarService)
    private readonly externalCalendarService: ExternalCalendarService,
  ) {}

  async execute(command: MeetingCreatedCommand) {
    const { entity } = command;
    const actionId = crypto.randomUUID();
    const meetingGroup = await this.meetingGroupsService.findOne(
      entity.meetingGroupId,
      {
        participants: true,
        creator: { accounts: true },
        calendar: true,
      },
    );
    if (!meetingGroup) {
      console.log('no meeting group found.');
      return { actionId };
    }

    const creatorProviderAccount = meetingGroup.creator.accounts.find(
      (account) => account.providerId === AccountProvider.GOOGLE,
    );

    if (!creatorProviderAccount) {
      console.log('no creator provider account found.');
      return { actionId };
    }

    // omit creator of group and users not oauth_connected
    const participants = meetingGroup.participants.filter((participant) => {
      if (
        participant.userId !== meetingGroup.creatorId &&
        participant.oauth_connected
      ) {
        return participant;
      }
    });

    const externalCalendarId = meetingGroup.calendar.externalId;

    const externalEvent = await this.externalCalendarService.createEvent(
      'google',
      {
        account: creatorProviderAccount,
        calendarId: externalCalendarId,
        event: {
          summary: meetingGroup.summary,
          description: meetingGroup.description,
          attendees: participants.map((participant) => {
            return { email: participant.email };
          }),
          reminders: { useDefault: true },
          start: {
            dateTime: new Date(entity.start).toISOString(),
          },
          end: {
            dateTime: new Date(entity.end).toISOString(),
          },
        },
      },
    );
    for (const participant of participants) {
      await this.meetingAttendeesService.create({
        userId: participant.userId,
        meetingId: entity.id,
        externalEventId: externalEvent.id!,
        email: participant.email,
      });
    }

    return {
      actionId,
    };
  }
}
