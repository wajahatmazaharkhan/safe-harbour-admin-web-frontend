import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import { useNavigate } from "react-router-dom";

import { adminMenu } from "../data/adminMenuConfig";
import { useThemeStore } from "../store/theme-store";

export default function AdminDrawer() {
  const dark = useThemeStore((state) => state.darkMode);
  const toggleDark = useThemeStore((state) => state.toggleDarkState);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (state) => () => setOpen(state);

  const DrawerList = (
    <Box
      sx={{
        width: 280,
        bgcolor: dark ? "grey.900" : "background.paper",
        color: dark ? "grey.100" : "text.primary",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
    >
      <Box sx={{ flexGrow: 1 }}>
        <div className="flex justify-center place-content-center items-center">
          <img
            className="py-2"
            src="https://i.postimg.cc/HLSQ5WKF/Logo.png"
            alt=""
          />
          <h1 className="mt-1 mx-3 font-bold">Safe Harbour Admin</h1>
        </div>
        {adminMenu.map((group, idx) => (
          <Box key={group.section}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, opacity: 0.7 }}
              >
                {group.section}
              </Typography>
            </Box>

            <List>
              {group.items.map((item) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.route);
                      setOpen(false);
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>
                      {group.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {idx !== adminMenu.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>

      <Divider />
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2">Dark Mode</Typography>
        <Switch checked={dark} onChange={toggleDark} />
      </Box>
    </Box>
  );

  return (
    <>
      <Button onClick={toggleDrawer(true)}>
        <MenuIcon />
      </Button>

      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
}
