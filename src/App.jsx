import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
	return (
		<Routes>
			<Route path="/" element={<LoginPage />} />
			<Route
				path="/admin/AdminDashboard"
				element={
					<PrivateRoute>
						<AdminDashboard />
					</PrivateRoute>
				}
			/>
		</Routes>
	);
}

export default App;
