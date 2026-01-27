import { globalAsyncHandler as asyncHandler } from "../utils/async-handler";
import apiClient from "./api-client";

export async function login(email, password) {
  try {
    const res = await apiClient.post("/api/user/adminlogin", {
      email,
      Password: password, // 👈 backend expects capital P
    });

    return res;
  } catch (error) {
    // ✅ VERY IMPORTANT: return the backend response
    if (error.response) {
      return error.response;
    }

    // network / unknown error
    return {
      status: 0,
      data: { msg: "Server not responding" },
    };
  }
}

//temporary use of adminLogin endpoint with dummy password to check if email belongs to an admin user
export const checkAdminEmail = asyncHandler(async (email) => {
  try {
    await apiClient.post("/api/user/adminlogin", {
      email,
      Password: "verification_Dummy_pass",
    });
    //just in case the dummy password is correct
    return { isAdmin: true, exists: true };
  } catch (error) {
    const status = error.response?.status;

    if (status === 402) {
      // User exists, but not Admin
      throw new Error("Invalid email.");
    }

    if (status === 404) {
      // "User not found"
      throw new Error("Invalid email.");
    }

    if (status === 400) {
      return { isAdmin: true, exists: true };
    }

    throw error;
  }
});

// SEND OTP
export const sendAdminPasswordOtp = asyncHandler(async (email) => {
  const res = await apiClient.post(`/api/user/password-reset-otp/${email}`);
  return res.data;
});

// VERIFY OTP
export const verifyAdminPasswordOtp = asyncHandler(async (email, otp) => {
  const res = await apiClient.post("/api/user/verify-password-otp", {
    email,
    otp,
  });
  return res.data;
});

// RESET PASSWORD
export const resetAdminPassword = asyncHandler(async (email, newPassword) => {
  const res = await apiClient.post("/api/user/reset-password", {
    Email: email,
    newPassword,
  });
  return res.data;
});

// LOGOUT
export async function logout() {
  try {
    const res = await apiClient.post(
      "/api/user/logout",
      {},
      { withCredentials: true },
    );
    return res;
  } catch (error) {
    if (error.response) {
      return error.response;
    }

    return {
      status: 0,
      data: { message: "Server not responding" },
    };
  }
}
