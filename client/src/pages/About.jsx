import React from "react";

const About = () => {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-6 text-center text-white">
          About Us
        </h1>
        <p className="text-lg mb-4 leading-relaxed text-center">
          Welcome to our website! We are dedicated to providing the best
          solutions to our clients by leveraging cutting-edge technologies and
          innovative approaches. Our team is passionate about making a positive
          impact in the industry and delivering exceptional results for our
          customers.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-3 text-white">
              Our Mission
            </h2>
            <p className="text-gray-400">
              Our mission is to empower businesses by delivering high-quality
              solutions that drive efficiency, enhance customer engagement, and
              promote growth. We strive to exceed expectations through
              creativity, innovation, and a commitment to excellence.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-3 text-white">
              Our Vision
            </h2>
            <p className="text-gray-400">
              Our vision is to be a leader in the industry, recognized for our
              expertise and dedication to client success. We aim to create
              long-lasting relationships with our clients and be their trusted
              partner for digital transformation.
            </p>
          </div>
        </div>
        <div className="mt-12 text-center">
          <h3 className="text-2xl font-semibold mb-3 text-white">Our Team</h3>
          <p className="text-gray-400 mb-8">
            Meet our passionate and talented team who work tirelessly to bring
            our vision to life. We are a diverse group of professionals with a
            shared commitment to excellence.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold text-white">John Doe</h4>
              <p className="text-gray-400">CEO & Founder</p>
            </div>
            {/* Team Member 2 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold text-white">Jane Smith</h4>
              <p className="text-gray-400">Lead Developer</p>
            </div>
            {/* Team Member 3 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h4 className="text-xl font-semibold text-white">
                Emily Johnson
              </h4>
              <p className="text-gray-400">Project Manager</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
