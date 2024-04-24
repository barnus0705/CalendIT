import Calendit from "./Calendit.jsx";
import {useState} from "react";
import * as React from "react";

export default function UI(){
    const [data, setData] = useState([]);
    const [logged, isLogged] = useState(false);
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
            <button onClick={googleClick}>Login</button>
            <button onClick={uploadClick}>upload</button>
            <Calendit data={data}
                      setData={setData}
            />
        </>
    );
}