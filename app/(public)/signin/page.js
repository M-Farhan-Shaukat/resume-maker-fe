"use client";

import { useState, useEffect } from "react";
import { Button, Form } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import "./Form.scss";
import * as Yup from "yup";
import Link from "next/link";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import "../../FormFields/sharedInput/Input.scss";
import GenericField from "@/app/FormFields/sharedInput";
import { loginUser } from "@/app/redux/slice/authSlice";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import Image from "next/image";
import logo from "@/public/images/logo.svg";

const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const { user, loading, Tfa } = useSelector((state) => state.user);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      dispatch(loginUser(values))
        .then((res) => {
          localStorage.setItem("email", values?.email);
          localStorage.setItem(
            "verify_through",
            res?.payload?.verified_through
          );
        })
        .catch((err) => {
          console.error("Login error:", err);
        });
    },
  });

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    if (user?.token) router.push("/");
  }, [user]);

  useEffect(() => {
    if (Tfa) router.push("/twofactorauthentication");
  }, [user, Tfa]);

  return (
    <div className="signin-container">
      <div className="signin-wrapper">
        <div className="signin-logo">
          <Image 
            src={logo} 
            alt="Resume Maker" 
            width={140} 
            height={50}
            priority
          />
        </div>
        
        <div className="signin-card">
          <div className="signin-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your Resume Maker account</p>
          </div>
          
          <Form onSubmit={formik.handleSubmit} className="signin-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <AiOutlineMail size={18} />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${formik.touched.email && formik.errors.email ? 'error' : ''}`}
                  placeholder="Enter your email address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <span className="error-message">{formik.errors.email}</span>
              )}
            </div>
            
            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="password" className="form-label">Password</label>
                <Link href="/forget" className="forgot-link">
                  Forgot Password?
                </Link>
              </div>
              <div className="input-wrapper">
                <span className="input-icon">
                  <AiOutlineLock size={18} />
                </span>
                <input
                  type={show ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`form-input ${formik.touched.password && formik.errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShow(!show)}
                >
                  {show ? <AiOutlineEye size={18} /> : <AiOutlineEyeInvisible size={18} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <span className="error-message">{formik.errors.password}</span>
              )}
            </div>
            
            <div className="form-options">
              <label className="checkbox-wrapper">
                <input type="checkbox" id="remember" />
                <span className="checkmark"></span>
                <span className="checkbox-label">Remember me</span>
              </label>
            </div>
            
            <Button
              type="submit"
              className="signin-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            
            <div className="signin-footer">
              <p>
                Don't have an account? 
                <Link href="/register" className="signup-link"> Create one</Link>
              </p>
            </div>
          </Form>
        </div>
        
        <div className="signin-copyright">
          © {new Date().getFullYear()} Resume Maker. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SignIn;