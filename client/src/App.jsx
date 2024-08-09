import "./index.css";
import { Suspense } from "react";
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
    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen min-w-full relative">
            <Navbar />
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
        </div>
    );
};

export default App;
