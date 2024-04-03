export default function Input({title, placeholder, ispassword, onChange, onFocus, onFocusOut, children}){
    return (
        <label className="form-control w-full pt-2 pb-2 ">
            <div className="label">
                <span className="btn-primary text-base font-semibold">{title}</span>
            </div>
            {children}
            <input type={ispassword ? "password" : "text"} placeholder={placeholder} onChange={onChange}
                   onFocus={onFocus} onBlur={onFocusOut} className={"input input-bordered w-full"} data-lpignore="true" />
        </label>
    );
}