import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Avatar,
	Box,
	Button,
	Container,
	CssBaseline,
	Typography,
	Paper,
	TextField,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import { toast } from "react-toastify";
import {
	verifyAdminPasswordOtp,
	sendAdminPasswordOtp,
} from "../services/auth-service";

const OTP_LENGTH = 4;
const RESEND_COOLDOWN = 60;

const ResetPasswordOTP = () => {
	const { emailId } = useParams(); // Get email from URL
	const navigate = useNavigate();

	const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
	const [loading, setLoading] = useState(false);
	const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
	const [canResend, setCanResend] = useState(false);

	const inputRefs = useRef([]);

	// Timer Logic
	useEffect(() => {
		if (!canResend && resendTimer > 0) {
			const timer = setTimeout(
				() => setResendTimer((prev) => prev - 1),
				1000
			);
			return () => clearTimeout(timer);
		}
		if (resendTimer === 0) setCanResend(true);
	}, [resendTimer, canResend]);

	// Input Handlers
	const handleChange = (index, value) => {
		if (!/^\d?$/.test(value)) return; // Only allow digits

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		// Auto-focus next input
		if (value && index < OTP_LENGTH - 1) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index, e) => {
		// Handle Backspace to focus previous
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e) => {
		e.preventDefault();
		const pasted = e.clipboardData.getData("text").trim();
		if (!/^\d{4}$/.test(pasted)) return;
		const digits = pasted.split("").slice(0, OTP_LENGTH);
		setOtp(digits);
		inputRefs.current[OTP_LENGTH - 1]?.focus();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const otpString = otp.join("");

		if (otpString.length !== OTP_LENGTH) {
			toast.error("Please enter the complete 4-digit code");
			return;
		}

		setLoading(true);
		try {
			const res = await verifyAdminPasswordOtp(emailId, otpString);

			// Store email in session for the next step (Reset Password)
			sessionStorage.setItem("admin-reset-email", emailId);

			toast.success("Verified successfully");
			navigate("/reset-password"); // Navigate to final step
		} catch (error) {
			toast.error(error.response?.data?.msg || "Invalid OTP");
			setOtp(Array(OTP_LENGTH).fill("")); // Clear OTP on failure
			inputRefs.current[0]?.focus();
		} finally {
			setLoading(false);
		}
	};

	const handleResend = async () => {
		if (!canResend) return;
		setCanResend(false);
		setResendTimer(RESEND_COOLDOWN);
		try {
			await sendAdminPasswordOtp(emailId);
			toast.success("OTP resent successfully");
		} catch (error) {
			toast.error("Failed to resend OTP");
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
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<KeyIcon />
					</Avatar>
					<Typography component="h1" variant="h5" fontWeight="bold">
						Verify Email
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 1 }}
					>
						Code sent to <strong>{emailId}</strong>
					</Typography>

					<Box
						component="form"
						onSubmit={handleSubmit}
						sx={{ mt: 4, width: "100%" }}
					>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								gap: 2,
								mb: 3,
							}}
						>
							{otp.map((digit, index) => (
								<TextField
									key={index}
									inputRef={(el) =>
										(inputRefs.current[index] = el)
									}
									value={digit}
									onChange={(e) =>
										handleChange(index, e.target.value)
									}
									onKeyDown={(e) => handleKeyDown(index, e)}
									onPaste={
										index === 0 ? handlePaste : undefined
									}
									inputProps={{
										maxLength: 1,
										style: {
											textAlign: "center",
											fontSize: "1.5rem",
											padding: "12px",
										},
									}}
									sx={{ width: 60 }}
								/>
							))}
						</Box>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							size="large"
							disabled={
								loading || otp.join("").length !== OTP_LENGTH
							}
							sx={{ py: 1.5, fontWeight: "bold" }}
						>
							{loading ? "Verifying..." : "Verify Code"}
						</Button>

						<Box sx={{ mt: 2, textAlign: "center" }}>
							<Typography variant="body2" color="text.secondary">
								Didn't receive code?{" "}
								<Button
									onClick={handleResend}
									disabled={!canResend}
									sx={{
										textTransform: "none",
										fontWeight: "bold",
									}}
								>
									{canResend
										? "Resend"
										: `Resend in ${resendTimer}s`}
								</Button>
							</Typography>
						</Box>
					</Box>
				</Box>
			</Paper>
		</Container>
	);
};

export default ResetPasswordOTP;
