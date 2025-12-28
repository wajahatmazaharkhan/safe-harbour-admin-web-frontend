import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Avatar,
	Box,
	Button,
	Container,
	CssBaseline,
	TextField,
	Typography,
	Paper,
	InputAdornment,
	IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { z } from "zod";
import { resetAdminPassword } from "../services/auth-service";

// Zod Schema for Strong Password
const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.regex(/[A-Z]/, "Must contain at least one uppercase letter")
	.regex(/[a-z]/, "Must contain at least one lowercase letter")
	.regex(/[0-9]/, "Must contain at least one number");

const ResetPassword = () => {
	const [form, setForm] = useState({ password: "", confirmPassword: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// Guard: Ensure we have the email from the previous step
	const email = sessionStorage.getItem("admin-reset-email");

	useEffect(() => {
		if (!email) {
			toast.error("Session expired. Please start over.");
			navigate("/forgot");
		}
	}, [email, navigate]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// 1. Basic Matching Check
		if (form.password !== form.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		// 2. Zod Strength Validation
		const validation = passwordSchema.safeParse(form.password);
		if (!validation.success) {
			toast.error(validation.error.errors[0].message);
			return;
		}

		setLoading(true);
		try {
			await resetAdminPassword(email, form.password);

			toast.success("Password reset successful! Please login.");
			sessionStorage.removeItem("admin-reset-email"); // Cleanup
			navigate("/sign-in");
		} catch (error) {
			toast.error(error.response?.data?.msg || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container
			component="main"
			maxWidth="sm"
			sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
		>
			<CssBaseline />
			<Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: "100%" }}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "success.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5" fontWeight="bold">
						Set New Password
					</Typography>

					<Box
						component="form"
						onSubmit={handleSubmit}
						sx={{ mt: 3, width: "100%" }}
					>
						<TextField
							fullWidth
							required
							label="New Password"
							name="password"
							type={showPassword ? "text" : "password"}
							value={form.password}
							onChange={handleChange}
							margin="normal"
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() =>
												setShowPassword(!showPassword)
											}
											edge="end"
										>
											{showPassword ? (
												<VisibilityOff />
											) : (
												<Visibility />
											)}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>

						<TextField
							fullWidth
							required
							label="Confirm Password"
							name="confirmPassword"
							type="password"
							value={form.confirmPassword}
							onChange={handleChange}
							margin="normal"
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							size="large"
							disabled={loading}
							sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
						>
							{loading ? "Resetting..." : "Reset Password"}
						</Button>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

export default ResetPassword;
