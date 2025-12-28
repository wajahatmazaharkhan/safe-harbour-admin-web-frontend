import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Avatar,
	Box,
	Button,
	Container,
	CssBaseline,
	TextField,
	Typography,
	Paper,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { toast } from "react-toastify";
import { z } from "zod";
import {
	checkAdminEmail,
	sendAdminPasswordOtp,
} from "../services/auth-service";

const emailSchema = z.string().email("Please enter a valid email address");

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const validation = emailSchema.safeParse(email);
		if (!validation.success) {
			toast.error(validation.error.errors[0].message);
			setLoading(false);
			return;
		}

		try {
			//Check if Admin Exists
			await checkAdminEmail(email);

			//Send OTP
			await sendAdminPasswordOtp(email);

			toast.success("OTP sent successfully");
			navigate(`/verify-otp/${email}`);
		} catch (error) {
			toast.error("Invalid email");
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
					<Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
						<LockResetIcon />
					</Avatar>
					<Typography component="h1" variant="h5" fontWeight="bold">
						Reset Password
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 1, textAlign: "center" }}
					>
						Enter your admin email to receive a verification code.
					</Typography>

					<Box
						component="form"
						onSubmit={handleSubmit}
						sx={{ mt: 3, width: "100%" }}
					>
						<TextField
							fullWidth
							required
							label="Email Address"
							name="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={loading}
							sx={{ mb: 2 }}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							size="large"
							disabled={loading}
							sx={{ py: 1.5, fontWeight: "bold" }}
						>
							{loading ? "Processing..." : "Send OTP"}
						</Button>

						<Box sx={{ mt: 2, textAlign: "center" }}>
							<Link
								to="/admin/login"
								style={{
									textDecoration: "none",
									color: "#1976d2",
									fontWeight: 500,
								}}
							>
								Back to Login
							</Link>
						</Box>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

export default ForgotPassword;
