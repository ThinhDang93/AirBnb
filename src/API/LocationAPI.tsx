import type { LocationType } from "../assets/Models/Location";
import { httpClient } from "../Utils/interceptor";

export const DeleteLocaById = async (id: number) => {
  return await httpClient.delete(`/api/vi-tri/${id}`);
};

export const UpdateLocaById = async (data: LocationType , id: string) => {
  return await httpClient.put(`/api/vi-tri/${id}` , data)
}

export const AddLocaById = async (data: LocationType) => {
  return await httpClient.post("/api/vi-tri/" , data)
}