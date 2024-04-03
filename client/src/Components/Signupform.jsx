import Input from "./Input.jsx";
import {useEffect, useState} from "react";

export default function Signupform(){

    const [email , setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    const [validEmail, setValidEmail] = useState(false);
    const [validPassword1, setValidPassword1] = useState(false);
    const [validPassword2, setValidPassword2] = useState(false);
    const [validRePassword, setValidRePassword] = useState(false);


    useEffect(() => {
        //lorem@lorem.lorem
        const parts = email.split("@");
        if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0)
        {
            setValidEmail(false);
            return;
        }
        const parts2 = parts[1].split(".");
        //This is a "BASIC" check for the end part for example lorem@lorem.ipsum.com
        if (parts2.length < 2 || parts2[parts2.length-1].length === 0 || parts2[0].length === 0)
        {
            setValidEmail(false);
            return;
        }
        setValidEmail(true);
    }, [email]);

    useEffect(() => {
        setValidRePassword(password === rePassword);
    }, [password,rePassword]);

    useEffect(() => {
        setValidPassword1(password.length > 7);
        let hasLower = false,
            hasUpper = false,
            hasNumber = false;
        for (const char of password)
        {
            if (!isNaN(char * 1))
            {
                hasNumber = true;
            }
            if (char.toUpperCase() === char)
            {
                hasUpper = true;
            }
            if (char.toLowerCase() === char)
            {
                hasLower = true;
            }
        }
        setValidPassword2(hasLower && hasUpper && hasNumber);
    }, [password]);

    return(
        <form className={"absolute card card-compact w-full bg-primary shadow-xl max-w-96 m-auto left-0 right-0 lg:w-96 lg:mr-10 mt-2"}>
            <div className={"card-body mx-8"}>
                <h1 className={"card-title btn-primary text-2xl"}>SignUp</h1>
                <Input placeholder={"loremipsum@lorem.ipsum"}
                       title={"Email address"}
                       onChange={e => setEmail(e.target.value)}
                >
                    {email !== "" && !validEmail && (
                        <div role="alert" className="alert alert-error my-1 flex font-bold">
                            <div className={"w-full flex items-center"}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                                <span>The email is invalid</span>
                            </div>
                        </div>
                    )}
                </Input>
                <Input placeholder={"********"}
                       title={"Password"}
                       ispassword={true}
                       onChange={e => setPassword(e.target.value)}
                >

                    {password !== "" && (!validPassword1 || !validPassword2) && (
                        <div role="alert" className="alert alert-error flex flex-wrap my-1 font-bold">
                            <div className="w-full flex items-center">
                                {validPassword1 ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 text-success">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                )}
                                <span>Min 8 characters</span>
                            </div>
                            <div className="w-full flex items-center">
                                {validPassword2 ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6 text-success">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                )}
                                <span>Must have: a-z, A-Z, 0-9</span>
                            </div>
                        </div>
                    )}
                </Input>
                <Input placeholder={"********"}
                       title={"Re-enter password"}
                       ispassword={true}
                       onChange={e => setRePassword(e.target.value)}
                >
                    {password !== "" && rePassword !== "" && !validRePassword && (
                        <div role="alert" className="alert alert-error my-1 flex font-bold">
                            <div className={"w-full flex items-center"}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                                <span>The password is not identical</span>
                            </div>
                        </div>
                    )}
                </Input>
                <div className="card-actions justify-end w-full">
                    <button className="btn text-lg mt-4" disabled={!validEmail || !validPassword1 || !validPassword2 || !validRePassword}>Signup</button>
                </div>
            </div>
        </form>
    );
}
