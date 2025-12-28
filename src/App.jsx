import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
	Dashboard,
	SignIn,
	ForgotPassword,
	ResetPasswordOTP,
	ResetPassword,
} from "./page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	return (
		<Router>
			<div>
				<ToastContainer position="top-right" autoClose={3000} />
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/forgot" element={<ForgotPassword />} />
					<Route
						path="/verify-otp/:emailId"
						element={<ResetPasswordOTP />}
					/>
					<Route path="/reset-password" element={<ResetPassword />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
