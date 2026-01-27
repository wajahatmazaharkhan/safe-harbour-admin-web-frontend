import { globalAsyncHandler } from "../utils/async-handler";
import api from "./api-client";

export const getAllUsers = globalAsyncHandler(async () => {
  const res = await api.get("/api/admin/get-all-users");
  return res;
});
