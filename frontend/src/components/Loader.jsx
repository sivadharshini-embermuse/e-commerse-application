const Loader = () => {
    return (
        // <div className='w-full h-screen flex justify-center items-center'>
        //     <div className = "h-10 w-10 border-3 border-blue-500 rounded-full border-t-blue-100 animate-spin">
        //         <span className='sr-only'>Loading...</span>
        //     </div>
        // </div>
        <div className="flex justify-center items-center gap-2 h-screen">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
        <div className="w-4 h-4 bg-blue-200 rounded-full animate-bounce [animation-delay:0.2s]"></div>
        </div>
    )
}

export default Loader
