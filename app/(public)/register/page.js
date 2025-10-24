"use client";

import { useState } from "react";
import { Button, Form } from "reactstrap";
import "../signin/Form.scss";
import * as Yup from "yup";
import Link from "next/link";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import "../../FormFields/sharedInput/Input.scss";
import GenericField from "@/app/FormFields/sharedInput";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { LocalServer } from "@/app/utils";
import ToastNotification from "@/app/utils/Toast";
import Image from "next/image";
import logo from "@/public/images/logo.svg";

const { ToastComponent } = ToastNotification;

// Helper function to get error message
const getErrorMessage = (error) => {
  return error?.response?.data?.message || "An error occurred. Please try again.";
};

const Register = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const payload = values;
        const response = await LocalServer.post("/api/register", payload);
        ToastComponent("success", response?.data?.message);
        router.push("/signin");
      } catch (error) {
        ToastComponent("error", getErrorMessage(error));
        setLoading(false);
      }
    },
  });

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
            <h1>Create Account</h1>
            <p>Get started with your Resume Maker account</p>
          </div>
          
          <Form onSubmit={formik.handleSubmit} className="signin-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <AiOutlineUser size={18} />
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-input ${formik.touched.name && formik.errors.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <span className="error-message">{formik.errors.name}</span>
              )}
            </div>
            
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
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <AiOutlineLock size={18} />
                </span>
                <input
                  type={show ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`form-input ${formik.touched.password && formik.errors.password ? 'error' : ''}`}
                  placeholder="Create a strong password"
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
            
            <div className="form-group">
              <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <AiOutlineLock size={18} />
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  id="password_confirmation"
                  name="password_confirmation"
                  className={`form-input ${formik.touched.password_confirmation && formik.errors.password_confirmation ? 'error' : ''}`}
                  placeholder="Confirm your password"
                  value={formik.values.password_confirmation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <AiOutlineEye size={18} /> : <AiOutlineEyeInvisible size={18} />}
                </button>
              </div>
              {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                <span className="error-message">{formik.errors.password_confirmation}</span>
              )}
            </div>
            
            <Button
              type="submit"
              className="signin-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
            
            <div className="signin-footer">
              <p>
                Already have an account? 
                <Link href="/signin" className="signup-link"> Sign in</Link>
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

export default Register;