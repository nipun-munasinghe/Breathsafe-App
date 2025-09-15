"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/common/Button";
import Link from "next/link";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { loginUser } from "@/service/userApi";
import { useAuthStore } from "@/store/authStore"

interface FormData {
  username: string;
  password: string;
}

const Page = () => {

  const login = useAuthStore((s) => s.login);

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const router = useRouter();
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

      try {
          const response = await loginUser(formData);

          if (response) {
              const { token, ...userData } = response;
              login(token, userData);
              setMessage("Login successful!");
              console.log(userData);
              console.log(message);
              router.push("/");
          } else {
              setMessage("Invalid email or password.");
              console.log(message);
          }
      } catch (err) {
          setMessage("Something went wrong.");
          console.error(err);
      }
  }



  return (
    <div className="flex justify-center bg-emerald-950 min-h-screen py-12 px-4">
      {/* Main Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl bg-gradient-to-br from-green-100 to-orange-100 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Left Section */}
        <div className="flex flex-col items-center lg:items-start p-6 lg:p-10 w-full lg:w-1/2">
          <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-emerald-950 text-center lg:text-left">
            Welcome Back!
          </h1>
          <p className="text-sm lg:text-lg font-normal mb-6 text-gray-500 text-center lg:text-left">
            Access your{" "}
            <span className="text-lime-600 font-semibold">BreathSafe</span> dashboard to monitor air quality and ensure a healthier environment.
          </p>

          {/* Image only on desktop */}
          <div className="hidden lg:block mt-4 lg:mt-0">
            <Image
              src="/login-image.png"
              width={400}
              height={400}
              alt="Login Image"
              className="transform transition duration-500 hover:scale-105 animate-fade-in-up"
            />
          </div>

          {/* Right reserved text only on desktop */}
          <p className="text-xs lg:text-md opacity-70 text-gray-500 mt-6 hidden lg:block text-center lg:text-left">
            &copy; 2025 BreathSafe. All rights reserved.
          </p>
        </div>

        {/* Right Section */}
        <div className="p-6 lg:p-8 mt-8 lg:mt-0 w-full lg:w-1/2">
          <h1 className="text-2xl lg:text-4xl text-gray-900 font-semibold text-center lg:text-left">
            Sign In
          </h1>
          <p className="text-sm lg:text-lg font-normal text-gray-500 mt-4 lg:mt-6 text-center lg:text-left">
            Access your account to continue
          </p>

          {/* Sign-in Form */}
          <form action="post" className="animate-fade-in-up mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="email" className="font-normal text-sm lg:text-lg mb-1">
                Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-transparent transition duration-300"
                placeholder="Enter your username"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="font-normal text-sm lg:text-lg mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-transparent transition duration-300"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center mb-2 sm:mb-0">
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe" className="text-sm text-gray-500 ml-2">
                  Remember Me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-emerald-950 transition-colors duration-200"
              >
                Forget Password?
              </a>
            </div>

            <Button onClick={() => {}} name="Sign In" type="submit" />
          </form>

          {/* Divider */}
          <div className="flex items-center my-4 animate-fade-in-up">
            <hr className="flex-grow border-gray-500" />
            <span className="mx-2 text-gray-500 text-sm">or continue with</span>
            <hr className="flex-grow border-gray-500" />
          </div>

          {/* Social Buttons */}
          <div className="flex justify-center gap-4 animate-fade-in-up">
            <button className="border border-gray-300 rounded-md p-2 hover:bg-gray-100 transition">
              <FaGoogle className="text-red-500 w-5 h-5" />
            </button>
            <button className="border border-gray-300 rounded-md p-2 hover:bg-gray-100 transition">
              <FaFacebookF className="text-blue-500 w-5 h-5" />
            </button>
            <button className="border border-gray-300 rounded-md p-2 hover:bg-gray-100 transition">
              <FaApple className="w-5 h-5" />
            </button>
          </div>

          {/* Sign up */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-gray-500 hover:text-emerald-950 transition-colors duration-200"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
