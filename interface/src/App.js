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

        socket.on("Error", (data) => {
            toast.error(data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <>
            <Navbar />
            <div className="container body">
                <Outlet context={[socket]} />
                <ToastContainer />
            </div>
            <Footer />
        </>
    );
}
