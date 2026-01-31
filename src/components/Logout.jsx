import { Box, Button, Typography, Paper, Backdrop } from "@mui/material";
import { logout } from "../services/auth-service";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/auth-store";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.authenticated);
  const changeAuthState = useAuthStore((state) => state.toggleAuthState);

  const handleLogout = async () => {
    // 🔐 Not logged in → just redirect
    if (!isAuthenticated) {
      return;
    }

    const response = await logout();
    const { status, data } = response;

    if (status === 200) {
      toast.success(data.message || "Logged out successfully");
    } else {
      toast.error(data?.message || "Logout failed");
    }

    // 🧹 Frontend cleanup (always)
    changeAuthState(false);
    localStorage.clear();
    sessionStorage.clear();

    navigate("/sign-in", { replace: true });
  };

  const handleCancel = () => {
    navigate(-1); // go back to previous page
  };

  return (
    <Backdrop open sx={{ zIndex: 1300 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          minWidth: 320,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Confirm Logout
        </Typography>

        <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
          Are you sure you want to log out?
        </Typography>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="outlined" color="inherit" onClick={handleCancel}>
            Cancel
          </Button>

          <Button variant="contained" color="error" onClick={handleLogout}>
            Yes, Logout
          </Button>
        </Box>
      </Paper>
    </Backdrop>
  );
};

export default Logout;
