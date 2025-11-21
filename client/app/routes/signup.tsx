import { Form, useActionData, useNavigation, Link, useNavigate } from "react-router";
import { api } from "../lib/api";
import { setToken } from "../lib/auth";
import type { Route } from "./+types/signup";
import authIllustration from "../images/illustration-authentication.svg"
import logoLarge from "../images/logo-large.svg"
import hidePass from "../images/icon-hide-password.svg"
import showPass from "../images/icon-show-password.svg"
import { useState, useEffect } from "react";


export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await api.post<{
      message: string;
      token: string;
      user: { id: string; name: string; email: string };
    }>("/auth/signup", { name, email, password });

    // Return token in response - will be handled client-side
    return {
      success: true,
      token: response.token,
      user: response.user,
    };
  } catch (error: any) {
    return {
      error: error.message || "Signup failed. Please try again.",
    };
  }
}

export default function SignUp() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  // Handle successful signup client-side
  useEffect(() => {
    if (actionData?.success && actionData.token && typeof window !== 'undefined') {
      setToken(actionData.token);
      navigate("/", { replace: true });
    }
  }, [actionData, navigate]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-4 lg:py-5 lg:px-5 bg-beige-100">
        <div className="bg-grey-900 py-6 rounded-b-lg lg:hidden">
            <img src={logoLarge} alt="Logo" className="mx-auto"/>
        </div>
        <div 
            className="w-[560px] h-[95vh] p-10 hidden lg:flex flex-col justify-between rounded-xl"
            style={{
                backgroundImage: `url(${authIllustration})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div>
                <img src={logoLarge} alt="Logo" className=""/>
            </div>
            <div className="text-white space-y-4">
                <h2 className="text-preset-1">Keep track of your money and save for your future</h2>
                <p className="text-preset-4">Personal finance app puts you in control of your spending. Track transactions, set budgets, and add to savings pots easily.</p>
            </div>
        </div>
        <div className="flex items-center justify-center flex-1 px-4 lg:px-0">
            <div className="bg-white rounded-xl py-6 px-5 flex flex-col gap-8 w-full lg:w-140 max-w-140">
                <h2 className="text-grey-900 text-preset-1">Sign Up</h2>
                <Form method="post" className="">
                    {actionData?.error && (
                            <div className="rounded-md bg-red-50 p-4 mb-4">
                            <p className="text-preset-5-bold text-red-800">{actionData.error}</p>
                            </div>
                    )}
                <div className="flex flex-col gap-1 mb-4">
                        <label htmlFor="name" className="text-grey-500 text-preset-5-bold">Name</label>
                        <input
                            id="name"
                            name="name"
                            autoComplete="name"
                            required 
                            type="text"
                            className="border border-beige-500 rounded-lg py-3 px-5 text-preset-4 text-grey-900 cursor-pointer" />
                    </div>
                    <div className="flex flex-col gap-1 mb-4">
                        <label htmlFor="email" className="text-grey-500 text-preset-5-bold">Email</label>
                        <input
                            id="email"
                            name="email"
                            autoComplete="email"
                            required 
                            type="email"
                            className="border border-beige-500 rounded-lg py-3 px-5 text-preset-4 text-grey-900 cursor-pointer" />
                    </div>
                    <div className="flex flex-col gap-1 mb-8">
                        <label htmlFor="password" className="text-grey-500 text-preset-5-bold">Create Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                autoComplete="current-password"
                                required 
                                type={isPasswordShown ? "text" : "password"}
                                className="border border-beige-500 rounded-lg py-3 px-5 text-preset-4 text-grey-900 cursor-pointer w-full -z-10" />

                                <button 
                                    onClick={() => setIsPasswordShown(!isPasswordShown)}
                                    className="absolute z-10 top-1/2 -translate-y-1/2 right-5 cursor-pointer"
                                    aria-label="Toggle to show or hide password">
                                    <img src={isPasswordShown ? hidePass : showPass} alt="password visibility icon" className=""/>
                                </button>
                        </div>
                        <p className="text-right text-grey-500 text-preset-5">Passwords must be at least 6 characters</p>
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-grey-900 hover:bg-grey-500 text-white text-center py-4 text-preset-4-bold rounded-lg cursor-pointer mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </button>
                    <div className="flex gap-2 justify-center">
                        <p className="text-grey-500 text-preset-4">Already have an account?</p>
                        <Link to="/login" className="text-grey-900 underline underline-offset-4 text-preset-4-bold mr-2">Login</Link>
                    </div>
                </Form>
            </div>
        </div>
       
    </div>
  );
}
