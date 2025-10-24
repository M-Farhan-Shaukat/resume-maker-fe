"use client";

import { useState, useEffect } from "react";
import { Button, Form } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import "./auth-styles.css";
import * as Yup from "yup";
import Link from "next/link";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/redux/slice/authSlice";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import Image from "next/image";
import logo from "@/public/images/logo.png";

// Helper function to get error message
const getErrorMessage = (error) => {
  return error?.response?.data?.message || "An error occurred. Please try again.";
};

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
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-logo">
          <Image 
            src={logo} 
            alt="CV Maker Logo" 
            width={120} 
            height={40}
            priority
          />
        </div>
        
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </div>
          
          <Form onSubmit={formik.handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-icon">
                  <AiOutlineMail size={20} />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>
            
            <div className="form-group">
              <div className="d-flex justify-content-between">
                <label htmlFor="password" className="form-label">Password</label>
                <Link href="/forget" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <div className="input-group">
                <span className="input-icon">
                  <AiOutlineLock size={20} />
                </span>
                <input
                  type={show ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShow(!show)}
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">{formik.errors.password}</div>
              )}
            </div>
            
            <Button
              type="submit"
              className="btn-primary w-100"
              disabled={!formik.isValid || loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            
            <div className="auth-divider">
              <span>OR</span>
            </div>
            
            <div className="auth-footer">
              <p>Don't have an account? <Link href="/register" className="auth-link">Sign up</Link></p>
            </div>
          </Form>
        </div>
        
        <div className="auth-copyright">
          {new Date().getFullYear()} CV Maker. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SignIn;
