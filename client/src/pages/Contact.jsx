import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle form submission,
    // e.g., sending data to a server
    console.log(formData);
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full p-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Contact Us
        </h1>
        {submitted ? (
            <div className="text-center">
            <h2 className="text-xl font-semibold text-green-400">Thank you!</h2>
            <p className="text-gray-400">
              Your message has been sent successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-400 mb-1"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-400 mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-400 mb-1"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required

                rows="5"
                className="w-full p-3 rounded-lg bg-gray-700 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              Send Message
            </button>
          </form>
        )}
        <div className="mt-8 text-center text-gray-400">
          <p>Or reach us at:</p>
          <p>
            Email:{" "}
            <a
              href="mailto:info@example.com"
              className="text-blue-400 hover:underline"
            >
              avneetsingh.8979@gmail.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a href="tel:+1234567890" className="text-blue-400 hover:underline">
              +91-8954932320
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
