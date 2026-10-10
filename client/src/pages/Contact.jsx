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

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const { name, email, message } = formData;

        const mailtoLink = `mailto:avneetsingh.8979@gmail.com?subject=Contact from ${encodeURIComponent(
            name
        )}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;

        window.location.href = mailtoLink;

        // Clear the form
        setFormData({
            name: "",
            email: "",
            message: "",
        });

        // Show the submitted message
        setSubmitted(true);
    };

    return (
        <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200 min-h-screen flex items-center justify-center px-4">
            <div className="max-w-lg w-full p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-slate-900 dark:text-white">
                    Contact Us
                </h1>
                {submitted ? (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-emerald-400">
                            Thank you!
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            Your message has been sent successfully.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1"
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
                                className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1"
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
                                className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1"
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
                                className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-75"
                        >
                            Send Message
                        </button>
                    </form>
                )}
                <div className="mt-8 text-center text-slate-500 dark:text-slate-400">
                    <p>Or reach us at:</p>
                    <p>
                        Email:{" "}
                        <a
                            href="mailto:avneetsingh.8979@gmail.com"
                            className="text-emerald-700 dark:text-emerald-400 hover:underline"
                        >
                            avneetsingh.8979@gmail.com
                        </a>
                    </p>
                    <p>
                        Phone:{" "}
                        <a
                            href="tel:+918954932320"
                            className="text-emerald-700 dark:text-emerald-400 hover:underline"
                        >
                            +91-8954932320
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
