"use client";

import "./Home.scss";
import { useSelector } from "react-redux";
import { LocalServer } from "@/app/utils";
import { useState } from "react";
import ToastNotification from "@/app/utils/Toast";
import { getErrorMessage } from "@/app/utils/helper";

const { ToastComponent } = ToastNotification;

function Home() {
  const { user } = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [loader, setloader] = useState(true);
  const [userData, setUserData] = useState(null);

  const fetchData = async () => {
    if (user?.user?.role_slug === "super_admin") {
      try {
        const response = await LocalServer.get(`/api/stats`);
        const data = response?.data;
        if (data.success) {
          setData(data);
          setloader(false);
        }
      } catch (error) {
        setloader(false);
        ToastComponent("error", getErrorMessage(error));
      }
    }
  };

  return (
    <div className="home-page">
      <div className="home-page__subheader text-center py-5">
        <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">
          Welcome to Dashboard
        </h1>
        <p className="text-gray-600 text-sm mt-2">
          Manage your users
        </p>
      </div>
    </div>
  );
}
export default Home;
