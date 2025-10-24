import axios from "axios";
import { logoutUser } from "../redux/slice/authSlice";
import { store } from "../redux/store/store";

export const baseURL = `${process.env.BASEURL_BACKEND}`;

// const getCookie = (name) => {
//   const match =
//     typeof window !== "undefined" &&
//     document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
//   return match ? decodeURIComponent(match[2]) : null;
// };

export const base64ToBlob = (base64, mimeType = null) => {
  const response = typeof base64 === "string" ? base64 : base64?.file;
  const matches = response?.split(":")[1];
  const extractedMime = matches ? matches?.split(";")[0] : null;
  const finalMimeType = mimeType || extractedMime || "application/octet-stream";

  const byteCharacters = atob(response?.split(",")[1]); // Remove metadata
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters?.length; i++) {
    byteNumbers[i] = byteCharacters?.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {
    type: finalMimeType,
    name: "",
  });

  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
};

const API = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

API.interceptors.request.use((config) => {
  /*const lastSuccessTime = getCookie("lastSuccessTime");
  if (lastSuccessTime) {
    config.headers["lastSuccessTime"] = lastSuccessTime;
  }*/
  return config;
});

export default API;

export const LocalServer = axios.create({
  baseURL: typeof window !== "undefined" ? `${window.origin}` : undefined,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
});

// LocalServer.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       document.cookie = "authToken=; path=/; samesite=strict;";
//       document.cookie = "userType=; path=/; samesite=strict;";
//       store.dispatch(logoutUser());
//       if (typeof window !== "undefined") {
//         localStorage.clear();
//         sessionStorage.clear();
//         window.location.href = "/signin";
//       }
//     }
//     return Promise.reject(
//       error.response
//         ? {
//             message: error.response.data?.message || "Unknown error",
//             status: error.response.status,
//           }
//         : { message: error.message || "Network error" }
//     );
//   }
// );

LocalServer.interceptors.request.use((config) => {
  // Add authorization header if token exists
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

LocalServer.interceptors.response.use(
  (response) => {
    // Store current date-time in cookies on successful response
    /*const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 GMT
    const currentTime = currentDate.toUTCString(); // "Mon, 07 Apr 2025 00:00:00 GMT"
    document.cookie = `lastSuccessTime=${currentTime}; path=/; samesite=strict;`;*/

    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        document.cookie = "authToken=; path=/; samesite=strict;";
        document.cookie = "userType=; path=/; samesite=strict;";
      }
      store.dispatch(logoutUser());

      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/signin";
      }
    }
    return Promise.reject(
      error.response
        ? {
            message: error.response.data?.message || "Unknown error",
            status: error.response.status,
          }
        : { message: error.message || "Network error" }
    );
  }
);

export const LocalServerFD = axios.create({
  baseURL: typeof window !== "undefined" && `${window.origin}`,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "multipart/form-data",
    Accept: "*/*",
  },
});

// LocalServerFD.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       document.cookie = "authToken=; path=/; samesite=strict;";
//       document.cookie = "userType=; path=/; samesite=strict;";
//       store.dispatch(logoutUser());
//       if (typeof window !== "undefined") {
//         localStorage.clear();
//         sessionStorage.clear();
//         window.location.href = "/signin";
//       }
//     }
//     return Promise.reject(
//       error.response
//         ? {
//             message: error.response.data?.message || "Unknown error",
//             status: error.response.status,
//           }
//         : { message: error.message || "Network error" }
//     );
//   }
// );

LocalServerFD.interceptors.response.use(
  (response) => {
    // Store current date-time in cookies on successful response
    /*const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 GMT
    const currentTime = currentDate.toUTCString(); // "Mon, 07 Apr 2025 00:00:00 GMT"
    document.cookie = `lastSuccessTime=${currentTime}; path=/; samesite=strict;`;*/

    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        document.cookie = "authToken=; path=/; samesite=strict;";
        document.cookie = "userType=; path=/; samesite=strict;";
      }
      store.dispatch(logoutUser());

      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/signin";
      }
    }
    return Promise.reject(
      error.response
        ? {
            message: error.response.data?.message || "Unknown error",
            status: error.response.status,
          }
        : { message: error.message || "Network error" }
    );
  }
);
