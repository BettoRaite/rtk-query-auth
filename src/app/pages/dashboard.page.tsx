import { authSelector, clearAuth, setAuth } from "@/features/auth/authSlice";
import { useLogoutUserMutation, useRefreshMutation } from "@/services/auth";
import { useGetUserMutation } from "@/services/resource";
import { useAppDispatch, useAppSelector } from "@/store/typed";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import Loader from "../components/Loader";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, authState, accessToken } = useAppSelector(authSelector);
  const [getUser, { isError: isUserError, error: userError }] =
    useGetUserMutation();
  const [logoutUser, { isLoading: isLogoutLoading }] = useLogoutUserMutation();
  useEffect(() => {
    // Failed to fetch user
    if (isUserError) {
      const errorMessage = userError;
      if (errorMessage) {
        toast(errorMessage);
      }
      // Resetting auth and going back to login page
      dispatch(setAuth({ authState: "idle" }));
      navigate("/login");
    }
  }, [isUserError, userError, dispatch, navigate]);

  // Fetching user data
  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user, getUser]);

  function handleLogout() {
    logoutUser().catch(() => {
      dispatch(clearAuth());
    });
    navigate("/");
  }

  const { name, createdAt, email, emailVerified } = user ?? {};

  return (
    <main>
      {!user || isLogoutLoading ? (
        <Loader />
      ) : (
        <div className="bg-white shadow-md rounded-lg p-10 flex justify-center flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Welcome back, {name}!
          </h2>
          <div className="mb-4">
            <p className="text-gray-700">
              <strong>Email:</strong> {email}
            </p>
            <p className="text-gray-700">
              <strong>Email Verified At:</strong>{" "}
              {emailVerified ? emailVerified.toString() : "Not Verified"}
            </p>
            <p className="text-gray-700">
              <strong>Account Created At:</strong> {createdAt?.toString()}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              type="button"
            >
              Log Out
            </button>
            <Link
              to="/"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 flex items-center justify-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
