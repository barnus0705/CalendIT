import setLogOpen from "./Loginform.jsx";
import React, {useCallback, useContext, useEffect, useState} from "react";
import Loginform from "./Loginform.jsx";
import Signupform from "./Signupform.jsx";
import {Navigate} from "react-router-dom";
import UserContext from "../Auth/UserContext.jsx";
import userContext from "../Auth/UserContext.jsx";
export default function Navbar() {
    const [visiblePopUp, setVisiblePopUp] = useState("None");
    const { user, setUser } = useContext(UserContext);

    {/*Open the Hamburger*/}
    const [isOpen, setOpen] = useState(false);

    {/*Toggle between Dark and Light themes*/}
    const [theme, setTheme] = useState('dark');
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };


    React.useEffect(() => {
        document.querySelector('html').setAttribute('data-theme', theme);
    }, [theme]);


    return (
        <>
            <div className="navbar bg-base-100">
                <div className={"navbar-start"}>
                    <div className="flex-none md:hidden">
                        <button className="btn btn-square btn-ghost" onClick={() => setOpen(open => !open)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                    </div>
                    <div className="flex">
                        <a className="btn btn-ghost text-xl font-bold">CalendIT</a>
                    </div>
                </div>
                <div className={"navbar-center menu menu-horizontal space-x-10 hidden md:flex"}>
                    <div><a href={"/"} className={"w-32 font-semibold hover:bg-base-200 hover:text-white py-2 px-4"}>Home</a></div>
                    <div><a href={"/about-us"} className={"w-32 font-semibold hover:bg-base-200 hover:text-white py-2 px-4"}>About us</a></div>
                    { user !== null && (
                        <div><a href={"/main"} className={"w-32 font-semibold hover:bg-base-200 hover:text-white py-2 px-4"}>Calendar</a></div>
                    )}
                </div>
                <div className={"navbar-end"}>
                    <div className={"flex md:mr-10"}>
                        <label className="flex cursor-pointer gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                            <input type="checkbox" value="synthwave" className="toggle theme-controller" onClick={toggleTheme} />
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
                        </label>
                    </div>
                    <div className="flex mr-4">
                        { user === null && (
                            <button className={"mr-4 btn bg-primary btn-primary hidden md:flex"}
                                    onClick={() => setVisiblePopUp(popup => popup === "SignUp" ? "None" : "SignUp")}>SignUp</button>
                        )}
                        { user === null && (
                            <button className={"mr-4 btn bg-primary btn-primary hidden md:flex"}
                                    onClick={() => setVisiblePopUp(popup => popup === "LogIn" ? "None" : "LogIn")}>LogIn</button>
                        )}

                        { user !== null && (
                            <button className={"mr-4 btn bg-primary btn-primary hidden md:flex"} onClick={() => setUser(null)}>LogOut</button>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <ul className={isOpen ? "block md:hidden menu bg-base-200 w-auto rounded-box mr-4 text-2xl mt-4" : "hidden"}>
                    <li><a>Home</a></li>
                    <li><a>About us</a></li>
                    <li><a>Calendar</a></li>
                    <hr className={`my-2 mx-0.5 border-1 ${theme === "dark" ? "border-white" : "border-black"}`}/>
                    { user === null && (
                        <li>
                            <a className={"hover:bg-primary hover:text-black"}
                               onClick={() => setVisiblePopUp(popup => popup === "LogIn" ? "None" : "LogIn")}>LogIn</a>
                        </li>
                    )}
                    { user === null && (
                        <li>
                            <a className={"hover:bg-primary hover:text-black"}
                               onClick={() => setVisiblePopUp(popup => popup === "SignUp" ? "None" : "SignUp")}>SignUp</a>
                        </li>
                    )}

                    { user !== null && (
                        <li>
                            <a className={"hover:bg-primary hover:text-black"}>LogOut</a>
                        </li>
                    )}

                </ul>
            </div>
            {visiblePopUp === "LogIn" && (<Loginform />)}
            {visiblePopUp === "SignUp" && (<Signupform />)}
        </>
    );

}