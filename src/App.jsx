import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Dashboard,
  SignIn,
  ForgotPassword,
  ResetPasswordOTP,
  ResetPassword,
  PrivateRoutes,
  Users,
  Counsellors,
} from "./page";
import { ToastContainer } from "react-toastify";
import { AdminDrawer } from "./components/index";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useThemeStore } from "./store/theme-store";
import Page404 from "./page";

function App() {
  const dark = useThemeStore((state) => state.darkMode);
  const darkTheme = createTheme({
    palette: {
      mode: `${dark ? "dark" : "light"}`,
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <div>
          <AdminDrawer />
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/verify-otp/:emailId" element={<ResetPasswordOTP />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/counsellors" element={<Counsellors />} />
              <Route path="/LandingPage" element={<LandingPage />} />
              <Route path="/User-Counsellor" element={<User-Counsellor />} />
              <Route path="/ServiceList" element={<ServiceList />} />
              <Route path="/Settings/User" element={<Settings />} />
              <Route path="/Chat-Voice-Video-Sessions" element={<Chat-Voice-Video-Sessions />} />
              
              <Route path='/*' element={<Page404 />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
