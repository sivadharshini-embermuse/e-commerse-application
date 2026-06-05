export const sendtoken = (user, statusCode, res) => {
    const token = user.getJWTToken();
    res.status(statusCode).cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.EXPIRE_COOKIE * 24 * 60 * 60 * 1000),
    }).json({
        success: true,
        user,
        token,  
    });
};