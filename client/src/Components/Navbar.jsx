import React, {useCallback, useContext, useEffect, useState} from "react";
import Loginform from "./Loginform.jsx";
import Signupform from "./Signupform.jsx";
import UserContext from "../Auth/UserContext.jsx";

export default function Navbar() {
    const [visiblePopUp, setVisiblePopUp] = useState("None");
    const { user, setUser } = useContext(UserContext);

    {/*Open the Hamburger*/}
    const [isOpen, setOpen] = useState(false);

    {/*Toggle between Dark and Light themes*/}
    const [theme, setTheme] = useState('dark');



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
                        {user != null && (<h1 className={"font-bold"}>{user.Email}</h1>)}
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
                    <li><a href={"/"}>Home</a></li>
                    <li><a href={"/about-us"}>About us</a></li>
                    {user !== null && (
                        <li><a href={"/main"}>Calendar</a></li>
                    )}
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
                            <a className={"hover:bg-primary hover:text-black"} onClick={() => setUser(null)}>LogOut</a>
                        </li>
                    )}

                </ul>
            </div>
            {visiblePopUp === "LogIn" && (<Loginform />)}
            {visiblePopUp === "SignUp" && (<Signupform />)}
        </>
    );

}