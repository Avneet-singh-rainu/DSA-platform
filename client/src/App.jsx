import "./index.css";
import { Suspense, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Topics from "./pages/Topics";
import EachTopic from "./pages/EachTopic";
import CodeEditor from "./components/CodeEditor";
import DashBoard from "./components/DashBoard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

const App = () => {
    const [news, setNews] = useState(true);

    useEffect(() => {
        const tm = setTimeout(() => {
            setNews(false);
        }, 2500);

        return () => clearTimeout(tm);
    }, []);

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen min-w-full relative">
            <Navbar />
            {news ? (
                <div className="bg-gray-800 text-yellow-400 p-4 rounded-lg text-center mx-auto w-4/5 shadow-lg font-semibold text-lg animate-fadeIn mt-44">
                    <p>This website's backend is ready and will be deployed very soon.</p> <br />
                    <p>This website may contains some bugs for now.</p>
                </div>
            ) : (
                <div className="container min-w-full p-4">
                    <Suspense fallback={<div>...loading your content</div>}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/topics" element={<Topics />} />
                            <Route
                                path="/topics/:topicname"
                                element={<EachTopic />}
                            />
                            <Route
                                path="/topics/:topicname/:question"
                                element={<CodeEditor />}
                            />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </Suspense>
                </div>
            )}
        </div>
    );
};

export default App;
