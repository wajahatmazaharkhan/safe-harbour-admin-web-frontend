// adminMenuConfig.js
import PeopleIcon from "@mui/icons-material/People";
import PsychologyIcon from "@mui/icons-material/Psychology";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import LockIcon from "@mui/icons-material/Lock";
import PaymentsIcon from "@mui/icons-material/Payments";

export const adminMenu = [
  {
    section: "User Management",
    icon: <PeopleIcon />,
    items: [
      { label: "All Users", route: "/user-management" },
      // { label: "User Info", route: "/admin/users/info" },
    ],
  },
  {
    section: "Counsellors",
    icon: <PsychologyIcon />,
    items: [
      { label: "All Counsellors", route: "/admin/counsellors" },
      { label: "Add Counsellor", route: "/admin/counsellors/add" },
      { label: "Availability", route: "/admin/counsellors/availability" },
    ],
  },
  {
    section: "Services",
    icon: <MedicalServicesIcon />,
    items: [
      { label: "All Services", route: "/admin/services" },
      { label: "Add Service", route: "/admin/services/add" },
    ],
  },
  {
    section: "Analytics",
    icon: <AnalyticsIcon />,
    items: [{ label: "Platform Analytics", route: "/admin/analytics" }],
  },
  {
    section: "Payments",
    icon: <PaymentsIcon />,
    items: [{ label: "Razorpay Orders", route: "/admin/payments" }],
  },
  {
    section: "Authentication",
    icon: <LockIcon />,
    items: [
      { label: "Admin Login", route: "/admin/login" },
      { label: "Logout", route: "/logout" },
    ],
  },
];
