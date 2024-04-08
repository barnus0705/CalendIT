import Input from "./Input.jsx";
import {useCallback, useContext, useState} from "react";
import {Navigate} from "react-router-dom";
import UserContext from "../Auth/UserContext.jsx";

export default function Loginform() {
    const [email , setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);
    const [loginHappened, setLoginHappened] = useState(false);
    const { user, setUser } = useContext(UserContext);


    const logIn = useCallback(() => {
        fetch("http://localhost:5000/login",{
            method:"post",
            body:JSON.stringify({
                email,
                password
            }),
            headers:{
                "Content-Type" : "application/json",
                "Accept" : "application/json"
            }
        }).then((response) => {
            if(response.status === 500){
                setLoginFailed(true);
            }
            else if(response.status === 200){
                response.json().then(json => {
                    setUser(json);
                    setLoginHappened(true);
                });
            }
        })
    },[email,password])
    return(
        <div>
            {loginFailed === true && (
                <div className={"sticky card card-compact w-full bg-error shadow-xl max-w-96 m-auto left-0 right-0 lg:w-96 lg:mr-10 mt-2"}>
                    <div className={"card-body items-center text-white"}>
                        <p className={"text-2xl font-semibold"}>Email or Password is incorrect</p>
                    </div>
                </div>
            )}
            {loginHappened === true && ( <Navigate to={"/main"} /> )}
            <div className={"absolute card card-compact w-full bg-primary shadow-xl max-w-96 m-auto left-0 right-0 lg:w-96 lg:mr-10 mt-2"}>
                <div className={"card-body mx-8"}>
                    <h1 className={"card-title btn-primary text-2xl"}>LogIn</h1>
                    <Input placeholder={"loremipsum@lorem.ipsum"} title={"Email address"} onChange={e => setEmail(e.target.value)} />
                    <Input placeholder={"********"} title={"Password"} ispassword={true} onChange={e => setPassword(e.target.value)}/>
                    <a href={"#"} className="underline text-black text-base font-semibold">Forgot Password?</a>
                    <div className="card-actions justify-end">
                        <button className="btn text-lg mt-4" onClick={logIn}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
