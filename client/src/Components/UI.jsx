import Calendit from "./Calendit.jsx";
import {useContext, useEffect, useState} from "react";
import * as React from "react";
import UserContext from "../Auth/UserContext.jsx";

export default function UI(){
    const [data, setData] = useState([]);
    const [showButton, setShowbutton] = useState(false);
    const { user } = React.useContext(UserContext);
    useEffect(() =>{
        if (!user)return;
        setShowbutton(user.Admin);
    },[user])

    const googleClick = () =>{
        window.location.href = "http://localhost:5000/auth/google"
    };
    const uploadClick = async () => {
        const params = new URLSearchParams(window.location.search);
        // fetchRequest to send data
        // post data with body
        // put the access token to body as well, not into url
        await fetch('http://localhost:5000/auth/google/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: params.get('token'),
                data: data
            })
        })
    };


    return(
        <>
            {showButton === true && (
                <div className={"flex"}>
                    <button className={"flex bg-white rounded-2xl items-center p-2 m-2"} onClick={googleClick}>
                        <img className="w-6 h-6 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
                        <span className={"text-black"}>Login with Google</span>
                    </button>
                    <button className={"btn m-2 btn-primary"} onClick={uploadClick}>Upload</button>
                </div>
            )}
            <Calendit data={data}
                      setData={setData}
            />
        </>
    );
}