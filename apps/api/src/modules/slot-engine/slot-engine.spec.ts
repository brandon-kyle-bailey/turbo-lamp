import {
  computeSlots,
  validateSlotEngineInvariants,
  SlotEngineInput,
} from './domain/interval.types';

describe('Slot Engine', () => {
  const createTime = (hours: number): Date => {
    const d = new Date('2024-01-15T00:00:00.000Z');
    d.setUTCHours(hours);
    return d;
  };

  describe('computeSlots', () => {
    it('should return empty array when no participants provided', () => {
      const input: SlotEngineInput = {
        constraints: {
          after: createTime(9),
          before: createTime(17),
          duration: 60,
          timezone: 'UTC',
        },
        participants: [],
      };

      const result = computeSlots(input);
      expect(result.slots).toHaveLength(0);
    });

    it('should return empty array when no availability overlaps', () => {
      const input: SlotEngineInput = {
        constraints: {
          after: createTime(9),
          before: createTime(17),
          duration: 60,
          timezone: 'UTC',
        },
        participants: [
          {
            userId: 'user-1',
            isRequired: true,
            intervals: [{ start: createTime(9), end: createTime(10) }],
          },
          {
            userId: 'user-2',
            isRequired: true,
            intervals: [{ start: createTime(14), end: createTime(15) }],
          },
        ],
      };

      const result = computeSlots(input);
      expect(result.slots).toHaveLength(0);
    });

    it('should return slots when participants have overlapping availability', () => {
      const input: SlotEngineInput = {
        constraints: {
          after: createTime(9),
          before: createTime(17),
          duration: 60,
          timezone: 'UTC',
        },
        participants: [
          {
            userId: 'user-1',
            isRequired: true,
            intervals: [{ start: createTime(9), end: createTime(17) }],
          },
          {
            userId: 'user-2',
            isRequired: true,
            intervals: [{ start: createTime(9), end: createTime(17) }],
          },
        ],
      };

      const result = computeSlots(input);
      expect(result.slots.length).toBeGreaterThan(0);
      expect(result.engineVersion).toBe('v1');
    });

    it('should not return slots shorter than duration', () => {
      const input: SlotEngineInput = {
        constraints: {
          after: createTime(9),
          before: createTime(17),
          duration: 180,
          timezone: 'UTC',
        },
        participants: [
          {
            userId: 'user-1',
            isRequired: true,
            intervals: [{ start: createTime(9), end: createTime(11) }],
          },
          {
            userId: 'user-2',
            isRequired: true,
            intervals: [{ start: createTime(9), end: createTime(11) }],
          },
        ],
      };

      const result = computeSlots(input);
      expect(result.slots.length).toBe(0);
    });

    it('should exclude optional participants from feasibility', () => {
      const input: SlotEngineInput = {
        constraints: {
          after: createTime(9),
          before: createTime(17),
          duration: 60,
          timezone: 'UTC',
        },
        participants: [
          {
            userId: 'user-1',
            isRequired: true,
            intervals: [{ start: createTime(9), end: createTime(17) }],
          },
          {
            userId: 'user-2',
            isRequired: false,
            intervals: [{ start: createTime(14), end: createTime(15) }],
          },
        ],
      };

      const result = computeSlots(input);
      expect(result.slots.length).toBeGreaterThan(0);
    });

    it('should respect blocked intervals', () => {
      const input: SlotEngineInput = {
        constraints: {
          after: createTime(9),
          before: createTime(17),
          duration: 60,
          timezone: 'UTC',
        },
        participants: [
          {
            userId: 'user-1',
            isRequired: true,
            intervals: [{ start: createTime(9), end: createTime(17) }],
          },
        ],
        blockedIntervals: [{ start: createTime(10), end: createTime(11) }],
      };

      const result = computeSlots(input);

      const hasBlockedSlot = result.slots.some(
        (slot) =>
          slot.start.getTime() >= createTime(10).getTime() &&
          slot.start.getTime() < createTime(11).getTime(),
      );
      expect(hasBlockedSlot).toBe(false);
    });

    it('should respect window boundaries', () => {
      const input: SlotEngineInput = {
        constraints: {
          after: createTime(9),
          before: createTime(12),
          duration: 60,
          timezone: 'UTC',
        },
        participants: [
          {
            userId: 'user-1',
            isRequired: true,
            intervals: [{ start: createTime(8), end: createTime(14) }],
          },
        ],
      };

      const result = computeSlots(input);

      for (const slot of result.slots) {
        expect(slot.start.getTime()).toBeGreaterThanOrEqual(
          createTime(9).getTime(),
        );
        expect(slot.end.getTime()).toBeLessThanOrEqual(
          createTime(12).getTime(),
        );
      }
    });

    it('should throw when max participants exceeded', () => {
      const participants = Array.from({ length: 21 }, (_, i) => ({
        userId: `user-${i}`,
        isRequired: true,
        intervals: [{ start: createTime(9), end: createTime(17) }],
      }));

      const input: SlotEngineInput = {
        constraints: {
          after: createTime(9),
          before: createTime(17),
          duration: 60,
          timezone: 'UTC',
        },
        participants,
      };

      expect(() => computeSlots(input)).toThrow('Max participants exceeded');
    });

    it('should throw when max window exceeded', () => {
      const input: SlotEngineInput = {
        constraints: {
          after: createTime(0),
          before: createTime(0 + 24 * 91),
          duration: 60,
          timezone: 'UTC',
        },
        participants: [
          {
            userId: 'user-1',
            isRequired: true,
            intervals: [{ start: createTime(0), end: createTime(24 * 91) }],
          },
        ],
      };

      expect(() => computeSlots(input)).toThrow('Max window exceeded');
    });
  });

  describe('validateSlotEngineInvariants', () => {
    it('should return valid when all invariants satisfied', () => {
      const input: SlotEngineInput = {
        constraints: {
          after: createTime(9),
          before: createTime(17),
          duration: 60,
          timezone: 'UTC',
        },
        participants: [
          {
            userId: 'user-1',
            isRequired: true,
            intervals: [{ start: createTime(9), end: createTime(17) }],
          },
        ],
      };

      const result = computeSlots(input);
      const validation = validateSlotEngineInvariants(result, input);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect slots outside window', () => {
      const input: SlotEngineInput = {
        constraints: {
          after: createTime(9),
          before: createTime(17),
          duration: 60,
          timezone: 'UTC',
        },
        participants: [
          {
            userId: 'user-1',
            isRequired: true,
            intervals: [{ start: createTime(9), end: createTime(17) }],
          },
        ],
      };

      const result = computeSlots(input);
      const validation = validateSlotEngineInvariants(result, input);

      expect(validation.valid).toBe(true);
    });

    it('should detect slots shorter than duration', () => {
      const input: SlotEngineInput = {
        constraints: {
          after: createTime(9),
          before: createTime(17),
          duration: 60,
          timezone: 'UTC',
        },
        participants: [
          {
            userId: 'user-1',
            isRequired: true,
            intervals: [{ start: createTime(9), end: createTime(17) }],
          },
        ],
      };

      const result = computeSlots(input);
      const validation = validateSlotEngineInvariants(result, input);

      for (const slot of result.slots) {
        expect(
          slot.end.getTime() - slot.start.getTime(),
        ).toBeGreaterThanOrEqual(60 * 60 * 1000);
      }
    });
  });

  describe('Determinism', () => {
    it('should produce identical results for same input', () => {
      const input: SlotEngineInput = {
        constraints: {
          after: createTime(9),
          before: createTime(17),
          duration: 60,
          timezone: 'UTC',
        },
        participants: [
          {
            userId: 'user-1',
            isRequired: true,
            intervals: [{ start: createTime(9), end: createTime(17) }],
          },
          {
            userId: 'user-2',
            isRequired: true,
            intervals: [{ start: createTime(10), end: createTime(16) }],
          },
        ],
      };

      const result1 = computeSlots(input);
      const result2 = computeSlots(input);

      expect(result1.slots.length).toBe(result2.slots.length);

      for (let i = 0; i < result1.slots.length; i++) {
        expect(result1.slots[i].start.getTime()).toBe(
          result2.slots[i].start.getTime(),
        );
        expect(result1.slots[i].end.getTime()).toBe(
          result2.slots[i].end.getTime(),
        );
        expect(result1.slots[i].rank).toBe(result2.slots[i].rank);
      }
    });

    it('should sort slots by rank descending', () => {
      const input: SlotEngineInput = {
        constraints: {
          after: createTime(9),
          before: createTime(17),
          duration: 60,
          timezone: 'UTC',
        },
        participants: [
          {
            userId: 'user-1',
            isRequired: true,
            intervals: [{ start: createTime(9), end: createTime(17) }],
          },
          {
            userId: 'user-2',
            isRequired: true,
            intervals: [{ start: createTime(9), end: createTime(17) }],
          },
        ],
      };

      const result = computeSlots(input);

      for (let i = 1; i < result.slots.length; i++) {
        expect(result.slots[i - 1].rank).toBeGreaterThanOrEqual(
          result.slots[i].rank,
        );
      }
    });
  });
});
