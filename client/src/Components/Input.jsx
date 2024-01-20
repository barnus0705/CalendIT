export default function Input({title, placeholder, ispassword}){
    return (
        <label className="form-control w-full max-w-xs ml-4 pt-2 pb-2 ">
            <div className="label">
                <span className="btn-primary text-base font-semibold">{title}</span>
            </div>
            <input type={ispassword ? "password" : "text"} placeholder={placeholder}
                   className={"input input-bordered w-64 md:w-full  max-w-xs "} />
        </label>
    );
}