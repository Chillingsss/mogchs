import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import RegistrarDashboard from "./pages/registrar/RegistrarDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";

function App() {
	return (
		<Routes>
			<Route path="/" element={<LoginPage />} />
			<Route
				path="/AdminDashboard"
				element={
					<PrivateRoute allowedRole="Admin">
						<AdminDashboard />
					</PrivateRoute>
				}
			/>
			<Route
				path="/RegistrarDashboard"
				element={
					<PrivateRoute allowedRole="Registrar">
						<RegistrarDashboard />
					</PrivateRoute>
				}
			/>
			<Route
				path="/StudentDashboard"
				element={
					<PrivateRoute allowedRole="Student">
						<StudentDashboard />
					</PrivateRoute>
				}
			/>
		</Routes>
	);
}

export default App;
