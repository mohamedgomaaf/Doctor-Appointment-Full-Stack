import React from "react";
import { assets } from "../assets/assets";

function Footer() {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm">
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Looking for a trusted medical professional? We’re here to connect
            you with top-rated doctors for your healthcare needs. Book an
            appointment quickly and easily with verified experts who prioritize
            your well-being. Our platform ensures access to quality medical care
            when you need it most.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">Company</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+20-11-265-76004</li>
            <li>mohamedgomaafathi@gmail.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;
