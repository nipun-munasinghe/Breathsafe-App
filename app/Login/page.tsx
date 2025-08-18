"use client";
import React from "react";
import Image from "next/image";
import Button from "@/component/Button";
import Link from "next/link";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";

const page = () => {
  return (
    <div className="flex justify-center items-center bg-emerald-950 h-screen">
      {/* Main Container */}
      <div className="flex items-center justify-center p-8 bg-gradient-to-br from-green-100 to-orange-100 rounded-tl-4xl rounded-br-4xl shadow-2xl animate-fade-in">
        
        {/* Left Section */}
        <div className="flex flex-col p-10 rounded-tr-[2.5rem] rounded-br-[2.5rem] animate-slide-in-left">
          <div>
            <h1 className="text-3xl font-bold mb-6 text-emerald-950">
              Welcome Back !
            </h1>
            <h1 className="text-lg font-normal mb-8 mt-4 text-gray-600">
              Access your{" "}
              <span className="text-lime-600 text-lg font-semibold">BreathSafe</span>{" "}
              dashboard to monitor air quality <br /> and ensure a healthier
              environment.
            </h1>
          </div>

          <Image
            src="/login-image.png"
            width={100}
            height={400}
            alt="Login Image"
            className="-ml-8 transform transition duration-500 hover:scale-105 animate-fade-in-up"
          />

          <p className="text-md opacity-70 text-gray-600 mt-12">
            &copy; 2025 BreathSafe. All rights reserved.
          </p>
        </div>

        {/* Right Section */}
        <div className="p-7 rounded-tr-4xl rounded-br-4xl animate-slide-in-right">
          <h1 className="text-4xl text-gray-900 mb-0 font-semibold">
            Sign In
          </h1>
          <h1 className="text-lg font-normal text-gray-600 mt-6">
            Access your account to continue
          </h1>

          {/* Sign-in Form */}
          <form action="post" className="animate-fade-in-up">
            <div className="flex flex-col mb-6 mt-6">
              <label htmlFor="email" className="font-normal text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="border p-3 rounded-md w-96 focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-transparent transition duration-300"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex flex-col mb-6 mt-6">
              <label htmlFor="password" className="font-normal text-lg">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="border p-3 rounded-md w-96 focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-transparent transition duration-300"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex justify-between items-center mb-4 mt-6">
              <div className="flex items-center">
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe" className="text-sm text-gray-500 ml-2">
                  Remember Me
                </label>
              </div>
              <div>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-emerald-950 transition-colors duration-200"
                >
                  Forget Password?
                </a>
              </div>
            </div>

            <div>
              <Button onClick={() => {}} name="Sign In" />
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 animate-fade-in-up">
            <hr className="flex-grow border-gray-500" />
            <span className="mx-4 text-gray-500 text-sm">or continue with</span>
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
              className="font-medium text-gray-600 hover:text-emerald-950 transition-colors duration-200"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
