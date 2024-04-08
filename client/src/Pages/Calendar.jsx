import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";
import * as React from "react";
import RouteRedirect from "../RouteConfig/RouteRedirect.jsx";

export default function Calendar(){

    return(
        <>
            <RouteRedirect />
            <Navbar/>
            <Footer/>
        </>
        );
}