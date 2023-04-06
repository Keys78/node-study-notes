/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { NextFunction, RequestHandler, Response, Request } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import UsersModel from "../models/user";


export const getAllUsers: RequestHandler = async (req, res, next) => {

    try {
        const users = await UsersModel.find().exec();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};



interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}


export const getUser: RequestHandler<{}, any, any, { id?: string }> = async (req: AuthRequest, res: Response<any>, next: NextFunction) => {
    const id = req.user?.id;

    try {
        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(404, "invalid user id");
        }

        const user = await UsersModel.findById(id)
            .populate({
                path: 'boards',
                select: 'title',
                // populate: {
                //     path: 'notes',
                //     select: 'title description status subTasks '
                // }
            })
            .exec();

        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
}



export const changePassword: RequestHandler = async (req, res, next) => {
    try {
      const { newPassword, password } = req.body;
      const { userId } = req.params;

      if (!req.params.userId) {
        return res.status(400).send({ message: 'User ID is missing' });
      }
  
      const user = await UsersModel.findById(userId).select('+password');
  
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
    
      console.log('password:', password);

      const isMatch = await user.matchPasswords(password);
  
      if (!isMatch) {
        return res.status(400).send({ message: 'Please enter correct old password' });
      }
  
      user.password = newPassword;
      await user.save();
  
      return res.json({ message: 'Password change was successful' });
    } catch (err) {
      next(err);
    }
  };
  