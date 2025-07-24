"use client";

import React, { useState, useEffect } from "react";
import { LockKeyhole, Mail, ArrowRight } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { loginUser } from "@/utils/security";

const COOKIE_KEY = "mogchs_user";
const SECRET_KEY = "mogchs_secret_key"; // You can use a more secure key in production

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		const encrypted = Cookies.get(COOKIE_KEY);
		if (encrypted) {
			try {
				const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
				const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
				if (decrypted && decrypted.userLevel === "Admin") {
					navigate("/AdminDashboard");
				} else if (decrypted && decrypted.userLevel === "Registrar") {
					navigate("/RegistrarDashboard");
				} else if (decrypted && decrypted.userLevel === "Student") {
					navigate("/StudentDashboard");
				}
			} catch (e) {
				// Invalid cookie, ignore
			}
		}
	}, [navigate]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true);
		console.log("user");

		try {
			const user = await loginUser(username, password);
			console.log("user", user);
			if (user && user.userLevel === "Admin") {
				const encrypted = CryptoJS.AES.encrypt(
					JSON.stringify(user),
					SECRET_KEY
				).toString();
				Cookies.set(COOKIE_KEY, encrypted, { expires: 1 }); // 1 day expiry
				navigate("/AdminDashboard");
			} else if (user && user.userLevel === "Registrar") {
				const encrypted = CryptoJS.AES.encrypt(
					JSON.stringify(user),
					SECRET_KEY
				).toString();
				Cookies.set(COOKIE_KEY, encrypted, { expires: 1 }); // 1 day expiry
				navigate("/RegistrarDashboard");
			} else if (user && user.userLevel === "Student") {
				const encrypted = CryptoJS.AES.encrypt(
					JSON.stringify(user),
					SECRET_KEY
				).toString();
				Cookies.set(COOKIE_KEY, encrypted, { expires: 1 }); // 1 day expiry
				navigate("/StudentDashboard");
			} else {
				alert("Invalid credentials or unauthorized access");
			}
		} catch (err) {
			alert("Login failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center p-4 w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			<div className="flex overflow-hidden w-full max-w-4xl rounded-lg shadow-lg bg-white/80">
				{/* Left side: Image */}
				<div className="hidden relative flex-col justify-center items-center w-1/2 text-white bg-gradient-to-br md:flex from-slate-900 to-slate-800">
					<div className="flex flex-col justify-center items-center w-full h-full">
						<div className="flex flex-col items-center">
							<img
								src="/images/mogchs.jpg"
								alt="MOGCHS Logo"
								className="object-contain mb-6 w-48 h-48 rounded-full border-4 border-white shadow-xl bg-white/90"
								style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
							/>
							<div className="text-center">
								<h2 className="mb-1 text-2xl font-bold tracking-wide text-white drop-shadow">
									Misamis Oriental General Comprehensive High School
								</h2>
								<p className="text-sm italic drop-shadow text-slate-200">
									Cagayan de Oro City
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Right side: Login form */}
				<div className="flex flex-col justify-center p-8 w-full md:w-1/2">
					<div className="mb-8 text-center">
						<div className="inline-flex justify-center items-center mb-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
							<LockKeyhole className="w-6 h-6 text-white" />
						</div>
						<h1 className="text-2xl font-bold tracking-tight text-slate-900">
							Welcome back
						</h1>
						<p className="mt-1 text-sm text-slate-500">
							Sign in to access your account
						</p>
					</div>

					<Card className="p-0 w-full bg-transparent border-none shadow-none">
						<CardContent className="px-0 pt-0">
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="space-y-2">
									<Label
										htmlFor="username"
										className="text-sm font-medium text-black"
									>
										Username (Employee ID or School ID)
									</Label>
									<div className="relative">
										<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none text-slate-400">
											<Mail className="w-4 h-4" />
										</div>
										<Input
											id="username"
											type="text"
											value={username}
											onChange={(e) => setUsername(e.target.value)}
											placeholder="Enter your Employee ID or School ID"
											className="pl-10 text-black transition-colors bg-slate-50 border-slate-200 focus:bg-white"
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<Label
											htmlFor="password"
											className="text-sm font-medium text-black"
										>
											Password
										</Label>
										<a
											href="#"
											className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-500"
										>
											Forgot password?
										</a>
									</div>
									<div className="relative">
										<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none text-slate-400">
											<LockKeyhole className="w-4 h-4" />
										</div>
										<Input
											id="password"
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											placeholder="••••••••"
											className="pl-10 text-black transition-colors bg-slate-50 border-slate-200 focus:bg-white"
											required
										/>
									</div>
								</div>

								<div className="flex items-center space-x-2 text-black">
									<Checkbox id="remember" />
									<Label htmlFor="remember" className="text-sm text-slate-500">
										Remember me for 30 days
									</Label>
								</div>

								<Button
									type="submit"
									className="flex gap-2 justify-center items-center py-6 w-full h-10 font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md transition-all duration-200 cursor-pointer hover:from-blue-700 hover:to-indigo-700"
									disabled={isLoading}
								>
									{isLoading ? (
										<div className="w-5 h-5 rounded-full border-2 border-white animate-spin border-t-transparent" />
									) : (
										<>
											Sign in
											<ArrowRight className="w-4 h-4" />
										</>
									)}
								</Button>
							</form>
						</CardContent>
						<CardFooter className="flex justify-center p-6 border-t border-slate-100">
							<p className="text-sm text-slate-500">
								Don't have an account?{" "}
								<a
									href="#"
									className="font-medium text-blue-600 transition-colors hover:text-blue-500"
								>
									Create one
								</a>
							</p>
						</CardFooter>
					</Card>

					<div className="mt-8 text-center">
						<p className="text-xs text-slate-500">
							By signing in, you agree to our{" "}
							<a href="#" className="underline hover:text-slate-700">
								Terms of Service
							</a>{" "}
							and{" "}
							<a href="#" className="underline hover:text-slate-700">
								Privacy Policy
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
