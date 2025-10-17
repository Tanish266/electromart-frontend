import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Signup from "./Components/Signup.jsx";
import SignIn from "./Components/SignIn.jsx";
import YourProfile from "./Components/YourProfile.jsx";
import { Provider } from "react-redux";
import store from "./Redux/store.jsx";
import Buy_Now from "./Components/BuyNow.jsx";
import Login_Security from "./Components/Login&Security.jsx";
import NameLogin from "./Components/NameLogin";
import EmailLogin from "./Components/EmailLogin.jsx";
import MobileLogin from "./Components/MobileLogin.jsx";
import PassLogin from "./Components/PassLogin.jsx";
import AddressLogin from "./Components/AddressLogin.jsx";
import PrivacyPolicy from "./Components/PrivacyPolicy.jsx";
import Termsofuse from "./Components/Termsofuse.jsx";
import SingleProductView from "./Components/SingleProductView.jsx";
import UserOrders from "./Components/UserOrders.jsx";
import SearchPage from "./Components/SearchPage.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/Signup", element: <Signup /> },
  { path: "/SignIn", element: <SignIn /> },
  { path: "/Buy-Now", element: <Buy_Now /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/Your-Account", element: <YourProfile /> },
  { path: "/Your-Account/Login_Security", element: <Login_Security /> },
  { path: "/Your-Account/Login_Security/Name-Login", element: <NameLogin /> },
  { path: "/Your-Account/Login_Security/Email-Login", element: <EmailLogin /> },
  { path: "/Your-Account/Login_Security/Pass-Login", element: <PassLogin /> },
  { path: "/Your-Account/AddressLogin", element: <AddressLogin /> },
  { path: "/Your-Account/UserOrders", element: <UserOrders /> },
  { path: "/Singup/PrivacyPolicy", element: <PrivacyPolicy /> },
  { path: "/Singup/Termsofuse", element: <Termsofuse /> },
  {
    path: "/Single-Product-View/:type/:id",
    element: <SingleProductView />,
  },
  {
    path: "/Your-Account/Login_Security/Mobile-Login",
    element: <MobileLogin />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
