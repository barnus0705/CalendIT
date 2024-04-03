import Input from "./Input.jsx";
import {useState} from "react";

export default function Loginform() {
    return(
        <form className={"absolute card card-compact w-full bg-primary shadow-xl max-w-96 m-auto left-0 right-0 lg:w-96 lg:mr-10 mt-2"}>
            <div className={"card-body mx-8"}>
                <h1 className={"card-title btn-primary text-2xl"}>LogIn</h1>
                <Input placeholder={"loremipsum@lorem.ipsum"} title={"Email address"} />
                <Input placeholder={"********"} title={"Password"} ispassword={true}/>
                <a href={"#"} className="underline text-black text-base font-semibold">U forgor Password?</a>
                <div className="card-actions justify-end">
                    <button className="btn text-lg mt-4">Login</button>
                </div>
            </div>
        </form>
    );
}
