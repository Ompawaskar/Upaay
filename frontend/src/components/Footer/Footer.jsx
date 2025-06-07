import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-[#003b5c] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Left Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Subscribe to our newsletter and get the latest update
          </h3>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 mt-2 text-black rounded-sm"
          />
          <button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-sm">
            SUBMIT
          </button>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Follow us on</h4>
            <div className="flex gap-4 text-2xl">
              <a href="#"><FaFacebookF className="bg-[#3b5998] text-white p-2 rounded-full w-10 h-10" /></a>
              <a href="#"><FaInstagram className="bg-[#E1306C] text-white p-2 rounded-full w-10 h-10" /></a>
              <a href="#"><FaXTwitter className="bg-black text-white p-2 rounded-full w-10 h-10" /></a>
              <a href="#"><FaYoutube className="bg-red-600 text-white p-2 rounded-full w-10 h-10" /></a>
            </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="flex flex-col items-center justify-center text-center">
          <button className="bg-white text-black font-semibold px-6 py-3 rounded-full hover:shadow-lg">
            SCHEDULE A VISIT TO UPAY
          </button>
          <p className="text-sm mt-6">
            Committed for safe & inclusive workspace, for any concern reach out to<br />
            <span className="font-semibold">complaint@upayngo.com</span>
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-3">
          <a href="#" className="hover:underline">MEMBERS-VOLUNTEER LOGIN</a>
          <a href="#" className="hover:underline">ADMIN PANEL</a>
          <a href="#" className="hover:underline">START YOUR UPAY</a>
          <a href="#" className="hover:underline">CONTACT US</a>

          <button className="mt-4 bg-white text-black font-semibold px-6 py-3 rounded-full hover:shadow-lg">
            WRITE TO CHAIRMAN
          </button>
        </div>
      </div>

      <hr className="my-6 border-gray-400" />

      {/* Bottom Text */}
      <div className="text-center text-sm">
        <p>
          UPAY NGO © 2024–2025 (Under Privileged’s Advancement by Youth)<br />
          Head Office: 201, Gandhi Nagar, Near Skating Ground, Nagpur, MH – 440010<br />
          Made with ❤️ by <span className="font-semibold">Nonstop Corporation</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
