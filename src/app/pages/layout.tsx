import { useRefreshMutation } from "@/services/auth";
import { useAppDispatch } from "@/store/typed";
import { retry } from "@reduxjs/toolkit/query";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Outlet } from "react-router";

export async function clientLoader() {
  return null;
}

export default function Layout() {
  const dispatch = useAppDispatch();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [trigger, { error, isError }] = useRefreshMutation();

  // It's important that we get an access token as soon as user
  // open
  // biome-ignore lint/correctness/useExhaustiveDependencies: <do not need track the fn>
  useEffect(() => {
    // Making a refresh request, if there is no error
    trigger();
  }, []);

  useEffect(() => {
    if (!isOnline) {
      toast.error("No internet connection");
      return;
    }
    if (error) {
      toast.error(error);
    }
  }, [isOnline, error]);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-dvh  bg-gray-50">
      <Outlet />
      <Toaster position="bottom-right" />
    </div>
  );
}
