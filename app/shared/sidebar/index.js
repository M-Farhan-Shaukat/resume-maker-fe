"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, Avatar, Logout, HomeIcon } from "@/public/images";
import "./sidebar.scss";
import Link from "next/link";
import Image from "next/image";
import ButtonX from "../ButtonX";
import { useRouter, usePathname } from "next/navigation";
import { logoutUser } from "@/app/redux/slice/authSlice";
import { FaBars } from "react-icons/fa";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { base64ToBlob, LocalServer } from "@/app/utils";
import { AiFillEdit } from "react-icons/ai";

export default function Sidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  console.log("user", user);
  const handleLogout = async () => {
    const response = await LocalServer.post(`/api/logout`, {});
    if (response?.data?.success) {
      if (typeof window !== "undefined") {
        document.cookie = "authToken=; path=/; samesite=strict;";
        document.cookie = "userType=; path=/; samesite=strict;";
        document.cookie = "twoFA=; path=/; samesite=strict;";
      }
      dispatch(logoutUser());
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }
      router.push("/signin");
    }
  };
  const NavLink = ({ href, children }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`d-flex align-items-center  position-relative text-decoration-none ${
          isActive ? "active-page" : ""
        }`}
      >
        {children}
      </Link>
    );
  };

  function sidebarHandler() {
    setIsSidebarOpen((prev) => !prev);
  }

  return (
    <>
      {typeof window !== "undefined" && window.innerWidth <= "1366" && (
        <div className="hamburger-btn" role="button" onClick={sidebarHandler}>
          <FaBars />
        </div>
      )}

      <div
        className={`marklab-sidebar d-flex flex-column ${
          typeof window !== "undefined" &&
          window.innerWidth <= 1366 &&
          isSidebarOpen
            ? "show"
            : ""
        }`}
      >
        <div className="d-flex align-items-center sidebarInfo">
          <div className="avatarImage rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
            <label htmlFor="fileUpload" className="cursor-pointer">
              <Image
                src={
                  user?.user?.image ? base64ToBlob(user?.user?.image) : Avatar
                }
                width={50}
                height={50}
                alt="user pic"
                priority
                className="img-fluid"
              />
            </label>
          </div>
          {user?.user?.role_id === 1 && (
            <div className="userInfo">
              <strong className="text-break">Super Admin</strong>
            </div>
          )}
          {user?.user?.role_id !== "super_admin" && (
            <div className="userInfo">
              <p className="mb-0">
                Hi, <span>{user?.user?.name}</span>
              </p>
              <strong className="text-break">{user?.user?.email}</strong>
              <Link href={`user-data/${user?.user?.id}`}>
                <AiFillEdit />
              </Link>
            </div>
          )}
        </div>
        <ul className="list-unstyled marklabList p-0 m-0">
          <li>
            <NavLink href="/home">
              <Image className="me-3" src={HomeIcon} alt="home icon" />
              <span>Home</span>
            </NavLink>
          </li>

          {user?.user?.role_id === 1 && (
            <li>
              <NavLink href="/users">
                <Image className="me-3" src={User} alt="user icon" />
                <span>User</span>
                <span className="notificationBadge successBadge"></span>
              </NavLink>
            </li>
          )}
        </ul>
        <div className="d-flex flex-column mt-auto">
          <ButtonX
            className="btn-logout d-flex align-items-center"
            size="medium"
            logo={Logout}
            clickHandler={handleLogout}
          >
            Logout
          </ButtonX>
        </div>
      </div>
    </>
  );
}
