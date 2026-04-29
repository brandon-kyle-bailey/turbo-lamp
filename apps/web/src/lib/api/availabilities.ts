import type { Availability } from "@/lib/types";
import { serverRequest } from "@/lib/api/client";
import {
  createAvailabilitySchema,
  updateAvailabilitySchema,
} from "@/lib/schemas";

export const availabilitiesApi = {
  get: async (id: string) =>
    await serverRequest<Availability>(`/availabilities/${id}`, "GET"),

  list: async () =>
    await serverRequest<Availability[]>(`/availabilities`, "GET"),

  upsert: async (data: Partial<Availability>) => {
    const payload = createAvailabilitySchema.parse(data);
    return await serverRequest<Availability>(
      "/availabilities/upsert",
      "POST",
      payload,
    );
  },

  batchUpsert: async (data: Partial<Availability>[]) => {
    return await serverRequest<Availability[]>(
      "/availabilities/upsert/batch",
      "POST",
      data,
    );
  },

  create: async (data: Partial<Availability>) => {
    const result = await serverRequest<Availability>(
      "/availabilities",
      "POST",
      data,
    );
    return result;
  },

  update: async (id: string, data: Partial<Availability>) => {
    const payload = updateAvailabilitySchema.parse(data);
    return await serverRequest<Availability>(
      `/availabilities/${id}`,
      "PATCH",
      payload,
    );
  },

  delete: async (id: string) =>
    await serverRequest<void>(`/availabilities/${id}`, "DELETE"),
};
