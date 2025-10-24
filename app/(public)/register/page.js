"use client";

import { useState } from "react";
import { Button, Form } from "reactstrap";
import "../signin/Form.scss";
import * as Yup from "yup";
import Link from "next/link";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import "../../FormFields/sharedInput/Input.scss";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { LocalServer } from "@/app/utils";
import ToastNotification from "@/app/utils/Toast";
import Image from "next/image";
import logo from "@/public/images/logo.png";

const { ToastComponent } = ToastNotification;
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
            <h1>Create an Account</h1>
            <p>Get started with your CV Maker account</p>
          </div>
          
          <Form onSubmit={formik.handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-icon">
                  <AiOutlineUser size={20} />
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                  placeholder="John Doe"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <div className="invalid-feedback">{formik.errors.name}</div>
              )}
            </div>
            
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
                  placeholder="you@example.com"
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
              <label htmlFor="password" className="form-label">Password</label>
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
              <small className="form-text text-muted">
                Must be at least 8 characters long
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
              <div className="input-group">
                <span className="input-icon">
                  <AiOutlineLock size={20} />
                </span>
                <input
                  type={showConfirm ? "text" : "password"}
                  id="password_confirmation"
                  name="password_confirmation"
                  className={`form-control ${formik.touched.password_confirmation && formik.errors.password_confirmation ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  value={formik.values.password_confirmation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                </button>
              </div>
              {formik.touched.password_confirmation && formik.errors.password_confirmation && (
                <div className="invalid-feedback">{formik.errors.password_confirmation}</div>
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
            
            <div className="auth-divider">
              <span>OR</span>
            </div>
            
            <div className="auth-footer">
              <p>Already have an account? <Link href="/signin" className="auth-link">Sign in</Link></p>
            </div>
          </Form>
        </div>
        
        <div className="auth-copyright">
          {new Date().getFullYear()} CV Maker. All rights reserved.
        </div>
      </div>
      <ToastComponent />
    </div>
  );
};

export default Register;
