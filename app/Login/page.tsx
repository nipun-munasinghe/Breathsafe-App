"use client";
import React from "react";
import Image from "next/image";
import Button from "@/component/Button";
import {
  FaGoogle,
  FaFacebookF,
  FaApple
} from "react-icons/fa";

const page = () => {
  return (
    <div className="flex justify-center items-center bg-emerald-950 h-screen">
      {/* Image Section */}
      <div className="flex items-center justify-center p-8 bg-gray-100 bg-gradient-to-br from-green-100 to-orange-100 rounded-tl-4xl rounded-br-4xl ">
        <div className="flex flex-col p-10   rounded-tl-4xl rounded-bl-4xl">
          <div className="">
            <h1 className="text-3xl font-bold mb-6  text-emerald-950">
              Welcome Back !
            </h1>
            <h1 className="text-lg font-normal mb-8  text-gray-600 ">
              Access your{" "}
              <span className="text-lime-600 text-lg font-semibold">BreathSafe</span>{" "}
              dashboard to monitor air quality <br /> and ensure a healthier
              environment.
            </h1>
          </div>
          <Image
            src="/login-image.png"
            width={500}
            height={1300}
            alt="Login Image"
            className="-ml-8"
          />

          <p className="text-md opacity-70 text-gray-600 mt-12">
            &copy; 2025 BreathSafe. All rights reserved.
          </p>
        </div>

        {/* SignIn Heading */}
        <div className="p-7 rounded-tr-4xl rounded-br-4xl">
          <h1 className="text-4xl text-blue-gray-900 mb-0 font-semibold">Sign In</h1>
          <h1 className="text-lg font-normal text-gray-600 mt-6">
            Access to your account to continue
          </h1>

          {/* Signin Form */}
          <form action="post">
            <div className="flex flex-col mb-6 mt-6">
              <label htmlFor="email" className="font-normal text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="border p-2 rounded-md w-96 focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-transparent"
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
                className="border p-2 rounded-md w-96 focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex justify-between items-center mb-4 mt-6">
              <div className="flex items-center">
                <input type="checkbox" id="rememberMe" />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-gray-500 ml-2"
                >
                  Remember Me
                </label>
              </div>
              <div>
                <a
                  href="#"
                  className="text-sm text-gray-500 text-center hover:text-emerald-950 transition-colors duration-200"
                >
                  Forget Password?
                </a>
              </div>
            </div>
            <Button onClick={() => { }} name="Sign In" />
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-500" />
            <span className="mx-4 text-gray-500 text-sm">or continue with</span>
            <hr className="flex-grow border-gray-00" />
          </div>

          {/* Social buttons */}
          <div className="flex justify-center gap-4">
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
            <a
              href="#"
              className="text-sm font-medium text-gray-500 text-center hover:text-emerald-950 transition-colors duration-200"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
