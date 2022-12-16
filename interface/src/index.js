import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "./App.css";
import "./css/Classroom.css";
import "./css/Footer.css";
import "./index.css";
import Classroom from "./pages/Classroom";
import Homepage from "./pages/Homepage";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";

// import the store
let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));


// Create the router with the routes to the pages
const router = createBrowserRouter([
    {
        path: "/",
        element: (
            // Wrap the app with the redux store
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <App />
                </PersistGate>
            </Provider>
        ),
        children: [
            {
                path: "/",
                element: <Homepage />,
            },
            {
                path: "/classroom/:classroomId",
                element: <Classroom />,
            },
        ],
    },
]);

root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
