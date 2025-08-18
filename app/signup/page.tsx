"use client";

import Image from "next/image";
import Link from "next/link";
import React, { use } from "react";
import Button from "@/component/Button";
import { useEffect, useState  } from "react";

const Page = () => {

    const [errorMessage, setErrorMessage] = useState("");

    const handlePasswordChecker = () => {
            const password = document.getElementById("password") as HTMLInputElement;
            const confirmPassword = document.getElementById("confirmPassword") as HTMLInputElement;

            if (password.value == confirmPassword.value) {
                setErrorMessage("");
            } else {
                setErrorMessage("Password does not match");
            }
        };

    useEffect(() => {
        handlePasswordChecker();
    }, []);

  return (
    <div className="flex justify-center items-center bg-emerald-950 h-screen px-4">
      <div className="flex items-center justify-center gap-20 p-8 bg-gradient-to-br from-green-100 to-orange-100 rounded-3xl shadow-2xl animate-fade-in">
        
        {/* Left Section - Form */}
        <div className="animate-slide-in-left">
          <h1 className="text-4xl text-gray-900 font-bold">Sign Up</h1>
          <p className="text-lg text-gray-600 mt-2">Create your account to get started</p>
          
          <form action="" className="mt-4 space-y-5 animate-fade-in-up">
            {/* First & Last Name */}
            <div className="flex gap-4 mb-0">
              <div className="flex flex-col flex-1 space-y-2">
                <label htmlFor="firstName" className="text-lg text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-600 transition duration-300"
                />
              </div>
              <div className="flex flex-col flex-1 space-y-2">
                <label htmlFor="lastName" className="text-lg text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-600 transition duration-300"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col mt-2 mb-0">
              <label htmlFor="email" className="text-lg text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-600 transition duration-300"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col space-y-2 mt-2 mb-0">
              <label htmlFor="password" className="text-lg text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                onKeyUp={handlePasswordChecker}
                className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-600 transition duration-300"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col space-y-2 mt-2 mb-0">
              <label htmlFor="confirmPassword" className="text-lg text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                onKeyUp={handlePasswordChecker}
                className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-lime-600 transition duration-300"
              />
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 mt-4 mb-4">
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe" className="text-sm text-gray-600">
                I agree to the Terms & Conditions
              </label>
            </div>

            <div>
              <Button onClick={() => {}} name="Register" />
            </div>

            <div>
                <p className="text-center text-orange-500" id="error-message">{errorMessage}</p>
            </div>

          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-400" />
            <span className="mx-4 text-gray-500 text-sm">or continue with</span>
            <hr className="flex-grow border-gray-400" />
          </div>

          {/* Redirect */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-gray-600 hover:text-emerald-950 transition-colors duration-200">
              Login
            </Link>
          </p>
        </div>

        {/* Right Section - Image + Stats */}
        <div className="flex flex-col items-center animate-slide-in-right">
          <div className="mb-8 animate-fade-in">
            <Image
              src="/signup-image.png"
              alt="Sign Up"
              width={450}
              height={450}
              className="transform transition duration-500 hover:scale-105"
            />
          </div>
          <h1 className="text-3xl text-emerald-950 font-bold">Welcome to Our Platform</h1>
            <p className="text-gray-600 text-lg mt-3 text-center">
                Be part of the change, Sign up today and breathe <br /> safer tomorrow.
            </p>

          {/* Stats */}
          <div className="flex gap-6 mt-6">
            <div className="flex flex-col items-center text-gray-700 font-semibold p-6 bg-white/30 backdrop-blur-xl rounded-2xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl animate-fade-in-up">
              <h1 className="text-2xl font-bold">10K+</h1>
              <p className="text-base">Active Users</p>
            </div>
            <div className="flex flex-col items-center text-gray-700 font-semibold p-6 bg-white/30 backdrop-blur-xl rounded-2xl shadow-lg transition transform hover:scale-105 hover:shadow-2xl animate-fade-in-up delay-200">
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
