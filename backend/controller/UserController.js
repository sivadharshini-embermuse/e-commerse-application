import User from "../model/UserModels.js";
import HandleError from "../helper/HandleError.js";
import { sendtoken } from "../helper/jwttoken.js";
import sendEmail from "../helper/sendEmail.js";
import crypto from "crypto";


//user registration
export const userRegistration = async (req, res, next) => {
    const { name, email, phone, password, avatar } = req.body; 
    if (!name) {
        return next(new HandleError("Name can not be empty", 400));
    }
    if (!email) {
        return next(new HandleError("Email can not be empty", 400));
    }
    if (!phone) {
        return next(new HandleError("Phone number can not be empty", 400));
    }
    if (!password) {
        return next(new HandleError("Password can not be empty", 400));
    }

    const user = await User.create({
        name,
        email,
        phone,
        password,
        avatar: {
            public_id: "avatar",
            url: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        },
    });
    sendtoken(user, 201, res);
    
    // const token = user.getJWTToken();

    // res.status(201).json({  
    //     success: true,
    //     user,
    //     token,
    // });  
};

//login user
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email) {
        return next(new HandleError("Email can not be empty", 400));
    }
    if (!password) {
        return next(new HandleError("Password can not be empty", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new HandleError("Invalid email or password!!!", 401));
    }   
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new HandleError("Invalid email or password", 401));
    }

    sendtoken(user, 200, res);
    
    // const token = user.getJWTToken();

    // res.status(200).json({  
    //     success: true,
    //     user,
    //     token,
    // });  
};

//logout user by clearing cookie
export const logoutUser = async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

//ethula erukura code just with text email
// export const forgotPassword = async (req, res, next) => {
//     const {email} = req.body;
//     const user = await User.findOne({email});
//     if(!user){
//         return next(new HandleError("User not found with this email", 404));
//     }
//     let resetToken;
//     try {
//         resetToken = user.createPasswordResetToken();
//         await user.save(); 
//         // console.log(resetToken);
//     } catch (error) {
//         console.log(error);
//         return next(new HandleError("could not save reset password try again later", 500));
//     }   

//     const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
//     const message = `Resetyour password with this link below :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it.`;   
//     try{
//         await sendEmail(user.email, "Password Reset Request", message);
        
//         res.status(200).json({
//             success: true,
//             message: `Email sent to ${user.email} successfully`,
//         });
//     }   
//     catch(error){
//         user.resetpasswordtoken = undefined;
//         user.resetpasswordexpire = undefined;
//         await user.save();
//         return next(new HandleError("Email could not be sent", 500));
//     }
// };

//ethula erukura code with html email template
export const forgotPassword = async (req, res, next) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return next(new HandleError("User not found with this email", 404));
    }
    let resetToken;
    try {
        resetToken = user.createPasswordResetToken();
        await user.save(); 
        // console.log(resetToken);
    } catch (error) {
        console.log(error);
        return next(new HandleError("could not save reset password try again later", 500));
    }   

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/reset/${resetToken}`;
    const message = `Resetyour password with this link below :- \n\n ${resetPasswordUrl} \n\n This link will expire in 30 minutes.\n\n If you have not requested this email then, please ignore it.`;   
    const messagehtml =`
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
        <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px;">

            <h2 style="color: #333;">Password Reset Request</h2>

            <p>Hello,</p>

            <p>
                You requested to reset your password. Click the button below to continue:
            </p>

            <a href="${resetPasswordUrl}"
            style="display: inline-block;
                    padding: 12px 20px;
                    background: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 10px;">
                Reset Password
            </a>

            <p style="margin-top: 20px;">
                Or copy and paste this link in your browser:<br>
                <a href="${resetPasswordUrl}">
                    ${resetPasswordUrl}
                </a>
            </p>

            <p style="color: red; font-weight: bold;">
                This link will expire in 30 minutes.
            </p>

            <p>
                If you didn't request a password reset, please ignore this email.
            </p>

            <br>

            <p>
                Regards,<br>
                Your Website Team
            </p>

        </div>
    </div>`;
    
    try{
        await sendEmail(user.email, "Password Reset Request", message, messagehtml);
        
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    }   
    catch(error){
        user.resetpasswordtoken = undefined;
        user.resetpasswordexpire = undefined;
        await user.save({validateBeforeSave: false});
        return next(new HandleError("Email could not be sent", 500));
    }
};

//reset password for user who forgot password
export  const resetPassword = async (req, res, next) => {
    const resetToken = req.params.token;
    const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const user = await User.findOne({
        resetpasswordtoken: resetPasswordToken,
        resetpasswordexpire: { $gt: Date.now() },
    }); 
    if(!user){
        return next(new HandleError("Reset password token is invalid or has expired", 400));
    }
    const {password, confirmpassword} = req.body;
    if (password !== confirmpassword){
        return next(new HandleError("Password doesn't match", 400));
    }
    user.password = password;
    user.resetpasswordtoken = undefined;
    user.resetpasswordexpire = undefined;
    await user.save();
    sendtoken(user, 200, res);  
};

//get user profile details for already logged in user
export const profile = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
};

//update password for already logged in user
export const updatePassword = async (req, res, next) => {
    
    const {oldpassword, newpassword, confirmpassword} = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!oldpassword || !newpassword || !confirmpassword) {
        return next(new HandleError("Please enter all fields", 400));
    }
    const isPasswordMatched = await user.comparePassword(oldpassword);
    if (!isPasswordMatched) {
        return next(new HandleError("Old password is incorrect", 400));
    }
    if (newpassword !== confirmpassword) {
        return next(new HandleError("Password doesn't match", 400));
    }
    user.password = newpassword;
    await user.save();
    sendtoken(user, 200, res);
};

//update profile for already logged in user
export const updateProfile = async (req, res, next) => {
    const {name, email, avatar} = req.body;

    const newUser={
        name, email,
    };
    if (avatar){
        newUser.avatar={
            public_id: avatar.public_id || "sample_id",
            url: avatar.url || avatar,
        };
    }
    const user = await User.findByIdAndUpdate(
        req.user.id,
        newUser,
        { new: true, runValidators: true }
    );
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
    });
};

export const getUsers = async (req, res) => {
    const user = await User.find();
    res.status(200).json({
        success: true,
        user,
    })
};

export const getsingleuser= async (req, res, next) =>{
    const id = req.params.id;
    const user = await User.findById(id);
    if(!user){
        return next(new HandleError("User not found with this id", 404));
    }   
    res.status(200).json({
        success: true,
        user,
    })
};

export const updateuserrole = async (req, res, next) => {
    const id = req.params.id;
    const {role} = req.body;
    const user = await User.findByIdAndUpdate(
        id,
        { role },  
        { new: true, runValidators: true }
    );  
    if(!user){
        return next(new HandleError("User not found with this id", 404));
    }
    res.status(200).json({
        success: true,
        message: "User role updated successfully",
        user,
    });
};

export const deleteuser = async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if(!user){
        return next(new HandleError("User not found with this id", 404));
    }
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
};
