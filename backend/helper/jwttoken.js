
export const sendtoken = (user, statusCode, res, message = "Success") => {
    const token = user.getJWTToken();

    const options = {
        httpOnly: true,
        expires: new Date(
            Date.now() +
            process.env.EXPIRE_COOKIE * 24 * 60 * 60 * 1000
        ),
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        message,
        user,
        token,
    });
};