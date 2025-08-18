"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";

const Page = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handlePasswordChecker = () => {
    const password = document.getElementById("password") as HTMLInputElement;
    const confirmPassword = document.getElementById(
      "confirmPassword"
    ) as HTMLInputElement;

    if (password.value === confirmPassword.value) {
      setErrorMessage("");
    } else {
      setErrorMessage("Password does not match");
    }
  };

  useEffect(() => {
    handlePasswordChecker();
  }, []);

  return (
    <div className="flex justify-center bg-emerald-950 min-h-screen py-12 px-4">
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl bg-gradient-to-br from-green-100 to-orange-100 rounded-3xl shadow-2xl overflow-hidden animate-fade-in gap-8 lg:gap-10">
        {/* Left Section - Form */}
        <div className="flex flex-col w-full lg:w-1/2 p-6 lg:p-10 animate-slide-in-left">
          <div className="lg:hidden sm:visible">
            <h1 className="text-center text-3xl font-bold text-blue-gray-900 lg:hidden sm:visible">
              Welcome to Our Platform
            </h1>
            <p className="text-center lg:text-lg text-gray-500 mt-2">
              Create your account to get started
            </p>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-3xl lg:text-4xl font-bold text-blue-gray-900">
              Sign Up
            </h1>
            <p className="text-base lg:text-lg text-gray-500 mt-2">
              Create your account to get started
            </p>
          </div>
          <form className="mt-4 space-y-5 animate-fade-in-up">
            {/* First & Last Name */}
            <div className="flex flex-col sm:flex-row gap-4 mb-0">
              <div className="flex flex-col flex-1">
                <label
                  htmlFor="firstName"
                  className="text-gray-500 text-sm lg:text-lg"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:border-transparent focus:ring-lime-600 transition duration-300"
                  required
                />
              </div>
              <div className="flex flex-col flex-1">
                <label
                  htmlFor="lastName"
                  className="text-gray-500 text-sm lg:text-lg"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:border-transparent focus:ring-lime-600 transition duration-300"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col mt-3 mb-0">
              <label
                htmlFor="email"
                className="text-gray-500 text-sm lg:text-lg"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:border-transparent focus:ring-lime-600 transition duration-300"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col mt-3 mb-0">
              <label
                htmlFor="password"
                className="text-gray-500 text-sm lg:text-lg"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                onKeyUp={handlePasswordChecker}
                className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:border-transparent focus:ring-lime-600 transition duration-300"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col mt-3 mb-0">
              <label
                htmlFor="confirmPassword"
                className="text-gray-500 text-sm lg:text-lg"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                onKeyUp={handlePasswordChecker}
                className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:border-transparent focus:ring-lime-600 transition duration-300"
                required
              />
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe" className="text-sm text-gray-600">
                I agree to the Terms & Conditions
              </label>
            </div>

            <Button onClick={() => { }} name="Register" />

            {/* Error Message */}
            {errorMessage && (
              <p className="text-center text-orange-500">{errorMessage}</p>
            )}
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-400" />
            <span className="mx-2 text-gray-500 text-sm">or continue with</span>
            <hr className="flex-grow border-gray-400" />
          </div>

          {/* Redirect */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-medium text-gray-500 hover:text-emerald-950 transition-colors duration-200"
            >
              Login
            </Link>
          </p>
        </div>

        {/* Right Section - Image + Stats */}
        <div className="hidden lg:flex flex-col items-center w-1/2 animate-slide-in-right">
          <div className="mb-8 animate-fade-in">
            <Image
              src="/signup-image.png"
              alt="Sign Up"
              width={400}
              height={400}
              className="transform transition duration-500 hover:scale-105"
            />
          </div>
          <h1 className="text-3xl text-emerald-950 font-bold text-center">
            Welcome to Our Platform
          </h1>
          <p className="text-gray-600 text-lg mt-3 text-center">
            Be part of the change, Sign up today and breathe <br /> safer
            tomorrow.
          </p>

          {/* Stats */}
          <div className="flex gap-6 mt-6">
            <div className="flex flex-col items-center text-gray-500 font-semibold p-6 bg-white/30 backdrop-blur-xl rounded-2xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl animate-fade-in-up">
              <h1 className="text-2xl font-bold">10K+</h1>
              <p className="text-base">Active Users</p>
            </div>
            <div className="flex flex-col items-center text-gray-500 font-semibold p-6 bg-white/30 backdrop-blur-xl rounded-2xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl animate-fade-in-up delay-200">
              <h1 className="text-2xl font-bold">250+</h1>
              <p className="text-base">Active Sensors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
