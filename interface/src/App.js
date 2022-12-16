import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function App() {
    const socket = io();

    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
        });

        // Listen for errors globally. This is used to display errors to the user
        socket.on("Error", (data) => {
            toast.error(data);
        });

        return () => {
            // Remove all the listeners
            socket.off("connect");
            socket.off("Error");
            socket.disconnect();
        };
    }, []);

    return (
        <>
            <Navbar />
            <div className="container body">
                {/* Pass the socket to the pages. Setup the outlet */}
                <Outlet context={[socket]} />
                <ToastContainer /> {/* Toasts */}
            </div>
            <Footer />
        </>
    );
}
