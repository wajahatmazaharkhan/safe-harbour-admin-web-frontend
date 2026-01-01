import { asyncHandler } from "../utils/async-handler";
import { apiClient } from "./api-client";

export const getAllUsers = asyncHandler(async () => {
  const res = await apiClient.get("/api/admin/get-all-users");
  return res;
});
