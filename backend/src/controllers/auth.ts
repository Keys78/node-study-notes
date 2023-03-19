import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import BlacklistToken from "../models/blacklistToken";
import jwt, { JwtPayload }  from 'jsonwebtoken';

interface createUser {
    username?: string,
    email?: string,
    password?:string
}

export const signup: RequestHandler< unknown, unknown, createUser, unknown> = async ( req, res, next) => {
    const { username, email, password } = req.body

    try {

        const isUserRegistered = await UserModel.findOne({ email })
        if (isUserRegistered) {
            throw createHttpError(401, "account already exist, try login")
        }

        const user = await UserModel.create({
            username: username,
            email: email,
            password: password
        });

        // const token = await new Token({
        //     userId: user._id,
        //     token: crypto.randomBytes(32).toString("hex"),
        // }).save();

        // const url = `${process.env.BASE_URL}user/${user.id}/verify/${token.token}`;


        // await sendEmail({
        //     to: user.email,
        //     subject: "Email Verification",
        //     text: confirmEmailMessage(url)
        // });

        res.json({
            success: true, message: `Hi ${user.username}, your signup was successful, Kindly confirm the verification email sent to you.`, status: 201
        })


    } catch (error) {
        next(error);
    }
};



export const login: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw (createHttpError(400, 'Please provide an email and password'))
    }

    try {
        const user = await UserModel.findOne({ email }).select("+password")

        if (!user) {
            // throw (createHttpError (401, 'Invalid Credentials'))
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await user.matchPasswords(password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }


        // if (!user.verified) {
        //     const unusedToken = await Token.findOne({
        //         userId: user._id,
        //     });

        //     if(unusedToken !== null) {
        //         await unusedToken.remove();
        //     }

            
        //     const token = await new Token({
        //         userId: user._id,
        //         token: crypto.randomBytes(32).toString("hex"),
        //     }).save();

        //     const url = `${process.env.BASE_URL}user/${user.id}/verify/${token.token}`;

        //     await sendEmail({
        //         to: user.email,
        //         subject: "Email Verification",
        //         text: confirmEmailMessage(url)
        //     });


        //     return next(new ErrorResponse('please confirm the verification email sent to you.', 401))

        // }

        
        sendToken(user, 200, res);

    } catch (error) {
        next(error)
    }
};


// const sendToken = async (user, statusCode, res) => {
//     const token = user.getSignedToken();
//     const blacklistToken = new BlacklistToken({
//         token,
//         user: user._id,
//         expiresAt: new Date(decoded.exp * 1000),
//       });

//       await blacklistToken.save();

//     res.status(statusCode).json({ success: true, data: user.username, token })
// }const jwt = require('jsonwebtoken');

// const sendToken = async (user, statusCode, res) => {
//   const token = user.getSignedToken();
//   const decoded = jwt.decode(token);
//   const blacklistToken = new BlacklistToken({
//     token,
//     user: user._id,
//     expiresAt: new Date(decoded.exp * 1000),
//   });

//   await blacklistToken.save();

//   res.status(statusCode).json({ success: true, data: user.username, token });
// };


const sendToken = async (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({ success: true, data: user.username, token });
};

