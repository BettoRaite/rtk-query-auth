import { authSelector, clearState } from "@/features/auth/authSlice";
import type { UserCredentials } from "@/lib/types/auth";
import { useSignupUserMutation } from "@/services/auth";
import { useAppDispatch, useAppSelector } from "@/store/typed";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [trigger, { data, isError, isLoading, error }] =
    useSignupUserMutation();
  const dispatch = useAppDispatch();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserCredentials>();
  const { authState } = useAppSelector(authSelector);
  const navigate = useNavigate();

  const onSubmit = (formData: UserCredentials) => {
    trigger(formData);
  };

  useEffect(() => {
    if (isError) {
      toast.error(error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (authState === "unauthenticated") {
      dispatch(clearState());
      navigate("/login");
    }
    if (authState === "authenticated") {
      console.log("authenticated leading to dash");
      navigate("/dashboard");
    }

    // if (error) {
    //   navigate("/");
    // }
  }, [authState, dispatch, navigate]);

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign Up to your account
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}
              method="POST"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    type="text"
                    {...register("username", { required: true })}
                    autoComplete="name"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    {...register("email", {
                      pattern: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/i,
                    })}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    {...register("password", { required: true })}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <title>loader</title>
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>

                      <p>Signing up</p>
                    </>
                  ) : (
                    <p> Sign up</p>
                  )}
                </button>
              </div>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or <Link to="/login">Login</Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
