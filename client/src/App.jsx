
import './App.css'
import * as React from "react";
import {BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes} from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Calendar from "./Pages/Calendar.jsx";
import About from "./Pages/About.jsx";
import UserContext from "./Auth/UserContext.jsx";
import {useCallback, useEffect, useState} from "react";

function App() {
    const [user, setUser] = useState(null);
    const [notLoggedIn , setNotLoggedIn] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser)
        {
            setUserCallback(JSON.parse(storedUser));
        }
        else
        {
            setUserCallback(null);
        }
    }, []);

    // To be improved
    const setUserCallback = useCallback(user => {
        setUser(user);
        if (user)
        {
            localStorage.setItem("user", JSON.stringify(user));
            setNotLoggedIn(false);
        }
        else
        {
            localStorage.removeItem("user");
            setNotLoggedIn(true);
        }

    }, []);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/main",
            element: <Calendar />
        },
        {
            path: "/about-us",
            element: <About />
        },
    ]);

    return (
        <UserContext.Provider value={{ notLoggedIn, user, setUser: setUserCallback }}>
            <RouterProvider router={router}/>
        </UserContext.Provider>
    );
}

export default App
