import {useContext} from "react";
import UserContext from "../Auth/UserContext.jsx";

export default function Footer(){
    const { user, setUser } = useContext(UserContext);

    return(
        <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
            <nav className="grid grid-flow-col gap-4">
                <a href={"/"} className="link link-hover">Home</a>
                <a href={"about-us"} className="link link-hover">About us</a>
                {user !== null && (
                    <a href={"/main"} className="link link-hover">Calendar</a>
                )}
            </nav>
            <aside>
                <p>Copyright © 2024 - All right reserved by ACME Industries Ltd</p>
            </aside>
        </footer>
    );
}