import { asyncHandler } from "../utils/async-handler";
import { apiClient } from "./api-client";

export const getAllCounsellors = asyncHandler(async () => {
  const res = await apiClient.get("/api/counsellor/getcounsellor");
  return res;
});
