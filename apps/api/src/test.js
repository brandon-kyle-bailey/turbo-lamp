const calendarA = [
  {
    start: new Date('2026-04-10T09:00:00'),
    end: new Date('2026-04-10T16:00:00'),
  },

  {
    start: new Date('2026-04-10T16:00:00'),
    end: new Date('2026-04-10T16:00:00'),
  },
];

const calendarB = [
  {
    start: new Date('2026-04-10T09:00:00'),
    end: new Date('2026-04-10T16:00:00'),
  },

  {
    start: new Date('2026-04-10T16:00:00'),
    end: new Date('2026-04-10T16:00:00'),
  },
];

function getAvailableSlots(calendars, windowStart, windowEnd, slotMinutes) {
  const allEvents = calendars.flat();

  // sort
  allEvents.sort((a, b) => a.start - b.start);

  // merge overlaps
  const merged = [];
  for (const event of allEvents) {
    if (!merged.length) {
      merged.push({ ...event });
      continue;
    }

    const last = merged[merged.length - 1];

    if (event.start <= last.end) {
      last.end = new Date(Math.max(last.end, event.end));
    } else {
      merged.push({ ...event });
    }
  }

  // invert to free intervals
  const free = [];
  let cursor = new Date(windowStart);

  for (const busy of merged) {
    if (busy.start > cursor) {
      free.push({ start: new Date(cursor), end: new Date(busy.start) });
    }
    cursor = new Date(Math.max(cursor, busy.end));
  }

  if (cursor < windowEnd) {
    free.push({ start: new Date(cursor), end: new Date(windowEnd) });
  }

  // slice into slots
  const slots = [];
  const slotMs = slotMinutes * 60 * 1000;

  for (const interval of free) {
    let start = interval.start.getTime();

    while (start + slotMs <= interval.end.getTime()) {
      slots.push({
        start: new Date(start),
        end: new Date(start + slotMs),
      });
      start += slotMs;
    }
  }

  return slots;
}

// usage
const slots = getAvailableSlots(
  [calendarA, calendarB],
  new Date('2026-04-10T09:00:00'),
  new Date('2026-04-10T17:00:00'),
  60,
);

console.log(slots);
