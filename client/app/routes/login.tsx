import { Form, useActionData, useNavigation, redirect } from "react-router";
import { api } from "../lib/api";
import { setToken } from "../lib/auth";
import type { Route } from "./+types/login";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await api.post<{
      message: string;
      token: string;
      user: { id: string; name: string; email: string };
    }>("/auth/login", { email, password });

    setToken(response.token);
    return redirect("/home");
  } catch (error: any) {
    return {
      error: error.message || "Login failed. Please try again.",
    };
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-preset-1 text-center text-grey-900">
            Sign in to your account
          </h2>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          {actionData?.error && (
            <div className="rounded-md bg-red p-4">
              <p className="text-preset-4 text-white">{actionData.error}</p>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-grey-300 placeholder-grey-500 text-grey-900 rounded-t-md focus:outline-none focus:ring-cyan focus:border-cyan focus:z-10 text-preset-4"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-grey-300 placeholder-grey-500 text-grey-900 rounded-b-md focus:outline-none focus:ring-cyan focus:border-cyan focus:z-10 text-preset-4"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-preset-3 rounded-md text-white bg-green hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-preset-4 text-grey-500">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-green hover:opacity-80"
              >
                Sign up
              </a>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
