import {Navigate, redirect} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import UserContext from "../Auth/UserContext.jsx";

export default function RouteRedirect (){
    const {  notLoggedIn } = useContext(UserContext);

    return(
        <>
            {notLoggedIn && ( <Navigate to={"/"}/> )}
        </>);
}