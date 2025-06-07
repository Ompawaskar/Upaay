import React from "react";

function HeroSection(){
    return <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen flex flex-col items-center justify-center text-center px-4 py-12">
  <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 mb-6 drop-shadow-sm">
    Empowering Education for Every Child
  </h1>
  <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-10">
    At <span className="text-purple-600 font-bold">FootPathShala</span>, we bring quality education to the streets — providing underprivileged children access to learning through volunteer-driven sessions and digital support.
  </p>
  
  {/* Lottie Animation or Center Image */}
  <div className="w-full max-w-md mb-8">
    <img src="./public/heroSectionImage.jpg" alt="Remote Education" className="rounded-2xl shadow-xl w-full" />
    {/* Or use Lottie: <Lottie animationData={educationLottie} loop={true} /> */}
  </div>

  <div className="flex flex-wrap justify-center gap-4">
    <a href="/" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium shadow hover:scale-105 transition">
      Join as Volunteer
    </a>
    <a href="/" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-blue-100 transition">
      Donate Now
    </a>
  </div>
</div>

}

export default HeroSection