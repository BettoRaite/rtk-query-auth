import { useRefreshMutation } from "@/services/auth";
import { useAppDispatch } from "@/store/typed";
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
  // Doing a check whether user has already been signed in
  // And has an active account, which we need to load.
  useEffect(() => {
    // By default in dev mode react remounts component.
    // In order to prevent potential bugs with useEffect
    // This in turn introduces a problem for us
    // Which is making a req to auth server with the same refresh token
    if (!isError) {
      trigger();
    }
  }, [trigger, isError]);

  return (
    <div className="flex justify-center items-center min-h-dvh  bg-gray-50">
      <Outlet />
      <Toaster position="bottom-right" />
    </div>
  );
}
