import { useEffect, useState } from "react";
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
import { login } from "../services/auth-service";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/auth-store";
import { Link, useNavigate } from "react-router-dom";

const SignInComponent = () => {
	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	useEffect(() => {
		console.log("COMPONENT MOUNTED");
	}, []);
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const isAuthenticated = useAuthStore((state) => state.authenticated);
	const changeAuthState = useAuthStore((state) => state.toggleAuthState);

	console.log(isAuthenticated);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const response = await login(form.email, form.password);

		setLoading(false);

		const { status, data } = response;

		// ✅ SUCCESS
		if (status === 200) {
			toast.success("Login successful");
			console.log("User:", data.user);
			changeAuthState(true);
			return;
		}

		// ❌ ERROR HANDLING — EXACTLY MATCHES BACKEND
		switch (status) {
			case 400:
				toast.error(data.msg); // invalid password
				break;

			case 402:
				toast.warning(data.msg); // not admin
				break;

			case 404:
				toast.error(data.msg); // user not found
				break;

			case 0:
				toast.error("Server not responding");
				break;

			default:
				toast.error("Something went wrong");
		}
	};

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	return (
		<>
			<Container
				component="main"
				maxWidth="sm"
				sx={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
				}}
			>
				<CssBaseline />

				<Paper
					elevation={6}
					sx={{
						width: "100%",
						p: 4,
						borderRadius: 3,
					}}
				>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
							<LockOutlinedIcon />
						</Avatar>

						<Typography
							sx={{ textTransform: "uppercase" }}
							component="h1"
							variant="h5"
							fontWeight="bold"
						>
							Safe Harbour Login
						</Typography>

						<Box
							component="form"
							onSubmit={handleSubmit}
							sx={{ mt: 3 }}
						>
							<TextField
								fullWidth
								required
								label="Email Address"
								name="email"
								type="email"
								margin="normal"
								value={form.email}
								onChange={handleChange}
							/>

							<TextField
								fullWidth
								required
								label="Password"
								name="password"
								type={showPassword ? "text" : "password"}
								margin="normal"
								value={form.password}
								onChange={handleChange}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={() =>
													setShowPassword(
														!showPassword
													)
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
							<Link
								to="/forgot"
								style={{
									textDecoration: "none",
									fontSize: "0.8rem",
									color: "#1976d2",
									fontWeight: 500,
								}}
								disabled={loading}
							>
								Forgot Password?
							</Link>

							<Button
								type="submit"
								fullWidth
								variant="contained"
								size="large"
								disabled={loading}
								sx={{
									mt: 3,
									py: 1.2,
									fontWeight: "bold",
								}}
							>
								{loading ? "Signing In..." : "Sign In"}
							</Button>

							<Typography
								variant="body2"
								color="text.secondary"
								align="center"
								sx={{ mt: 3 }}
							>
								Authorized Admins Only
							</Typography>
						</Box>
					</Box>
				</Paper>
			</Container>
		</>
	);
};

export default SignInComponent;
