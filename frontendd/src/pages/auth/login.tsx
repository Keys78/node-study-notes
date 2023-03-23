import { useState } from 'react'
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { useAppDispatch, useAppSelector, } from "@/network/hooks";
import { loginUser } from "@/features/auth/authSlice";
import Logo from "@/components/Logo";
import Link from 'next/link';
import Google_logo from '@/components/assets/svg/Google_logo';
import { useRouter } from 'next/router';


export type LoginData = {
    email: string;
    password: string;
};

const Login = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [inputType, setInputType] = useState<string>('password');
    const dispatch = useAppDispatch();
    const router = useRouter();

    const { isSuccess, isLoading, isError } = useAppSelector((state) => state.auth);
    const user: any = useAppSelector((state) => state.user);
    console.log(user)




    const LoginValidation = yup.object().shape({
        email: yup
            .string()
            .email("Please provide a valid email address")
            .required("email is required"),
        password: yup
            .string()
            // .min(8, "password must be at least at 6 characters")
            .required("password is required"),
    });

    const handleToggle = () => {
        if (inputType === "password") {
            setInputType('text')
            setIsVisible(!isVisible)
        } else {
            setInputType('password')
            setIsVisible(!isVisible)
        }
    }


    return (
        <div className="max-w-[400px] w-full mx-auto my-5">
            <div className='mx-[16px]'>
                <Logo />
                <h1 className='pt-6 pb-8 font-bold text-xl text-center'>Welcome back</h1>

                <div>
                    <Formik
                        validationSchema={LoginValidation}
                        initialValues={{
                            email: "",
                            password: ""
                        }}

                        onSubmit={async (
                            values: LoginData,
                            { resetForm }: FormikHelpers<LoginData>
                        ) => {
                            const data = { ...values, };
                            dispatch(loginUser(data));
                            resetForm();
                            if (user) {
                                router.push('/user/dashboard')
                            }
                        }}


                    >
                        {(props) => (
                            <form onSubmit={props.handleSubmit}>

                                <div className="input-container">
                                    <label className='opacity-50 pl-2' htmlFor="email">Email</label>
                                    <input
                                        className="input-class"
                                        type="text"
                                        value={props.values.email}
                                        onBlur={props.handleBlur("email")}
                                        onChange={props.handleChange("email")}
                                    />
                                    <span className={"text-red-500 text-xs translate-x-2 animate-pulse transition-all"}>
                                        {props.touched.email && props.errors.email}
                                    </span>
                                </div>

                                <label className='opacity-50 pl-2' htmlFor="password">Password</label>
                                <div className='password-input'>
                                    <div>
                                        <input
                                            className="input-class-p"
                                            type={inputType}
                                            value={props.values.password}
                                            onBlur={props.handleBlur("password")}
                                            onChange={props.handleChange("password")}
                                            autoComplete={'off'}
                                        />

                                    </div>
                                    <div className='cursor-pointer' onClick={() => handleToggle()}>{!isVisible ? 'SHOW' : 'HIDE'}</div>
                                </div>
                                <span className={"text-red-500 text-xs translate-x-2 animate-pulse transition-all -mt-6 mb-6"}>
                                    {props.touched.password && props.errors.password}
                                </span>
                                <div className='py-2'>
                                    <Link href={'/auth/forgot_password'}><span className='text-[#635FC7]'>Forgot password?</span></Link>
                                </div>

                                <br />
                                <div className="my-2 lg:block flex justify-center items-center">
                                    <button
                                        type='submit'
                                        className='gen-btn-class w-full py-3 rounded-[5px] text-[18px]'
                                    >
                                        Log in
                                    </button>
                                </div>

                                <div className='text-center pt-4'>
                                    Don&apos;t have an account? &nbsp;
                                    <Link href={'/auth/signup'}><span className='text-[#635FC7]'>Sign up</span></Link>
                                </div>

                                <div className='divide text-center'>
                                    <hr />
                                    <span>OR</span>
                                </div>

                                <div className='flex items-center justify-center rounded-[5px] border border-[#635FC7] py-3 space-x-3 cursor-pointer'>
                                    <Google_logo />
                                    <span>Continue with Google</span>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default Login