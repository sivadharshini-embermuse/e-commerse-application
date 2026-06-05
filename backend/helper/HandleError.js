class HandleError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = "HandleError";
        Error.captureStackTrace(this, this.constructor);
    }
}

export default HandleError;
