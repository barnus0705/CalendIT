export default function ImageWithText({direction, text, heading, subHeading,imageLink}){
    return(
        <section className={`page-width flex flex-wrap my-10 md:flex-nowrap ${direction === "right" ?  "raw-reverse":""}`}>
            <div className={"md:w-1/2 md:px-10 flex items-center justify-center md:justify-start w-full"}>
                <div>
                    <h2 className={"font-medium text-sm"}>{subHeading}</h2>
                    <h1 className={"font-bold text-6xl"}>{heading}</h1>
                    <p className={"mt-2 text-2xl"}>{text}</p>
                </div>
            </div>
            <div className={"w-full flex items-center justify-center mt-5 md:w-1/2"}>
                <img src={imageLink}/>
            </div>
        </section>
    );
}