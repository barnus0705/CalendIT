import Input from "./Input.jsx";

export default function Signupform(){
    return(
        <form className={"card card-compact w-full md:m-auto md:left-0 md:right-0 md:max-w-96 lg:w-96 bg-primary shadow-xl lg:mr-10 mt-2 absolute"}>
            <div className={"card-body"}>
                <h1 className={"card-title ml-4 btn-primary text-2xl"}>SignUp</h1>
                <Input placeholder={"loremipsum@lorem.ipsum"} title={"Email address"} />
                <Input placeholder={"********"} title={"Password"} ispassword={true} />
                <Input placeholder={"********"} title={"Re-enter password"} ispassword={true} />
                <div className="card-actions justify-end">
                    <button className="btn text-lg mr-4 mt-4">Submit</button>
                </div>
            </div>
        </form>
    );
}
