export interface TimeInterval {
  start: Date;
  end: Date;
}

export interface ParticipantAvailability {
  userId: string;
  intervals: TimeInterval[];
  isRequired: boolean;
}

export interface MeetingGroupConstraints {
  after: Date;
  before: Date;
  duration: number;
  timezone: string;
}

export interface SlotEngineInput {
  constraints: MeetingGroupConstraints;
  participants: ParticipantAvailability[];
  blockedIntervals?: TimeInterval[];
}

export interface Slot {
  start: Date;
  end: Date;
  rank: number;
}

export interface SlotEngineOutput {
  slots: Slot[];
  engineVersion: string;
  computedAt: Date;
  cacheHit: boolean;
}

export const SLOT_ENGINE_VERSION = 'v1';

export const PERFORMANCE_LIMITS = {
  maxParticipants: 20,
  maxDaysInWindow: 90,
  maxIntervalsPerDayPerUser: 15,
  maxIntersectionOps: 10000,
  targetLatency: {
    low: 50,
    medium: 150,
    high: 300,
  },
} as const;

function clampToWindow(
  interval: TimeInterval,
  windowStart: Date,
  windowEnd: Date,
): TimeInterval {
  return {
    start: new Date(Math.max(interval.start.getTime(), windowStart.getTime())),
    end: new Date(Math.min(interval.end.getTime(), windowEnd.getTime())),
  };
}

function getDurationMs(interval: TimeInterval): number {
  return interval.end.getTime() - interval.start.getTime();
}

function doIntervalsOverlap(a: TimeInterval, b: TimeInterval): boolean {
  return a.start < b.end && a.end > b.start;
}

function mergeIntervals(intervals: TimeInterval[]): TimeInterval[] {
  if (intervals.length === 0) return [];

  const sorted = [...intervals].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );

  const merged: TimeInterval[] = [];
  let current = { ...sorted[0] };

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].start.getTime() <= current.end.getTime()) {
      current.end = new Date(
        Math.max(current.end.getTime(), sorted[i].end.getTime()),
      );
    } else {
      merged.push(current);
      current = { ...sorted[i] };
    }
  }
  merged.push(current);

  return merged;
}

function isFeasible(
  interval: TimeInterval,
  participants: ParticipantAvailability[],
  durationMs: number,
): boolean {
  const intervalDuration = getDurationMs(interval);
  if (intervalDuration < durationMs) return false;

  for (const participant of participants) {
    if (!participant.isRequired) continue;

    const hasOverlap = participant.intervals.some((pInterval) =>
      doIntervalsOverlap(interval, pInterval),
    );

    if (!hasOverlap) return false;
  }

  return true;
}

function rank(slot: Slot, windowStart: Date, windowEnd: Date): number {
  const windowDuration = windowEnd.getTime() - windowStart.getTime();
  const startFromWindow = slot.start.getTime() - windowStart.getTime();
  const endFromWindow = windowEnd.getTime() - slot.end.getTime();

  const edgeProximity =
    startFromWindow / windowDuration + endFromWindow / windowDuration;

  const workingHoursStart = 9 * 60 * 60 * 1000;
  const workingHoursEnd = 17 * 60 * 60 * 1000;
  const slotMid = (slot.start.getTime() + slot.end.getTime()) / 2;
  const timeOfDay = slotMid % (24 * 60 * 60 * 1000);
  const workingHoursBonus =
    timeOfDay >= workingHoursStart && timeOfDay <= workingHoursEnd ? 2 : 0;

  const overlapDensity = 5;
  const edgeProximityPenalty = 3;

  return (
    overlapDensity - edgeProximity * edgeProximityPenalty + workingHoursBonus
  );
}

export function computeSlots(input: SlotEngineInput): SlotEngineOutput {
  const { constraints, participants, blockedIntervals = [] } = input;
  const durationMs = constraints.duration * 60 * 1000;
  const windowStart = new Date(constraints.after);
  const windowEnd = new Date(constraints.before);

  if (participants.length > PERFORMANCE_LIMITS.maxParticipants) {
    throw new Error(
      `Max participants exceeded: ${participants.length} > ${PERFORMANCE_LIMITS.maxParticipants}`,
    );
  }

  const daysDiff = Math.ceil(
    (windowEnd.getTime() - windowStart.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (daysDiff > PERFORMANCE_LIMITS.maxDaysInWindow) {
    throw new Error(
      `Max window exceeded: ${daysDiff} days > ${PERFORMANCE_LIMITS.maxDaysInWindow}`,
    );
  }

  const requiredParticipants = participants.filter((p) => p.isRequired);
  const expandedIntervals = requiredParticipants.flatMap((p) => p.intervals);

  const clampedIntervals = expandedIntervals
    .map((interval) => clampToWindow(interval, windowStart, windowEnd))
    .filter((i) => i.start < i.end);

  const mergedIntervals = mergeIntervals(clampedIntervals);

  const prunedIntervals = mergedIntervals.filter(
    (interval) => getDurationMs(interval) >= durationMs,
  );

  const feasibleIntervals: TimeInterval[] = [];
  for (const interval of prunedIntervals) {
    if (isFeasible(interval, participants, durationMs)) {
      const hasBlockOverlap = blockedIntervals.some((block) =>
        doIntervalsOverlap(interval, block),
      );
      if (!hasBlockOverlap) {
        feasibleIntervals.push(interval);
      }
    }
  }

  const slots: Slot[] = [];
  for (const interval of feasibleIntervals) {
    let cursor = interval.start.getTime();
    const intervalEnd = interval.end.getTime();

    while (cursor + durationMs <= intervalEnd) {
      const slotStart = new Date(cursor);
      const slotEnd = new Date(cursor + durationMs);

      slots.push({
        start: slotStart,
        end: slotEnd,
        rank: 0,
      });

      cursor += durationMs;
    }
  }

  const scoredSlots = slots.map((slot) => ({
    ...slot,
    rank: rank(slot, windowStart, windowEnd),
  }));

  scoredSlots.sort((a, b) => {
    if (b.rank !== a.rank) return b.rank - a.rank;
    return a.start.getTime() - b.start.getTime();
  });

  return {
    slots: scoredSlots,
    engineVersion: SLOT_ENGINE_VERSION,
    computedAt: new Date(),
    cacheHit: false,
  };
}

export function validateSlotEngineInvariants(
  output: SlotEngineOutput,
  input: SlotEngineInput,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const { constraints, participants, blockedIntervals = [] } = input;
  const durationMs = constraints.duration * 60 * 1000;

  for (const slot of output.slots) {
    if (slot.start < constraints.after) {
      errors.push(`Slot starts before window: ${slot.start}`);
    }
    if (slot.end > constraints.before) {
      errors.push(`Slot ends after window: ${slot.end}`);
    }

    const slotDuration = slot.end.getTime() - slot.start.getTime();
    if (slotDuration < durationMs) {
      errors.push(`Slot duration too short: ${slotDuration} < ${durationMs}`);
    }

    for (const block of blockedIntervals) {
      if (doIntervalsOverlap(slot, block)) {
        errors.push(`Slot intersects blocked interval`);
      }
    }

    const requiredParticipants = participants.filter((p) => p.isRequired);
    for (const participant of requiredParticipants) {
      const hasOverlap = participant.intervals.some((pInterval) =>
        doIntervalsOverlap(slot, pInterval),
      );
      if (!hasOverlap) {
        errors.push(`Required participant ${participant.userId} not available`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
