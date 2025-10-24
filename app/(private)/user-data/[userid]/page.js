"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Spinner } from "reactstrap";
import * as Yup from "yup";
import Image from "next/image";
import { Alert } from "@/public/images";
import "../user-data.scss";
import { useFormik } from "formik";
import { fields } from "@/app/utils/constants";
import ToastNotification from "@/app/utils/Toast";
import { ButtonX, SubHeader } from "@/app/shared";
import TooltipX from "@/app/shared/TooltipX";
import { debounce, getErrorMessage } from "@/app/utils/helper";
import { useParams, useRouter } from "next/navigation";
import { CloseButton, UserIcon } from "@/public/icons";
import GenericField from "@/app/FormFields/sharedInput";
import { base64ToBlob, LocalServer, LocalServerFD } from "@/app/utils";
import { FaPlus, FaTrash, FaInfoCircle } from "react-icons/fa";
import { updateUser, updateUserInfo } from "@/app/redux/slice/authSlice";
import { FocusError } from "focus-formik-error";
import { ConfirmationPopover } from "@/app/shared/DeleteConfirmation";

const { ToastComponent } = ToastNotification;

export default function UserData() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userid } = useParams();
  const [loading, setLoading] = useState(false);
  const [loader, setloader] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState({
    modal: false,
    index: null,
    action: "",
  });

  const { user } = useSelector((state) => state.user);
  const fetchUser = async () => {
    setloader(true);
    try {
      const response = await LocalServer.get(
        `/api/user/edit?user_id=${userid}`
      );
      const data = response?.data;
// console.log(data);
      formik.setValues({
        name: data?.name || "",
        logo: data?.image,
        email: data?.email,
      });
      setloader(false);
    } catch (error) {
      ToastComponent("error", getErrorMessage(error));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userid) fetchUser();
  }, [userid]);

  const initialValues = {
    name: "",
    logo: null,
    email: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .nullable() // Allows empty values
      .test("is-valid-email", "Invalid email format", (value) => {
        if (!value) return true; // Allow empty values
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      console.log(values)
      if (Object.keys(formik.errors).length > 0) {
        // Find the first invalid field based on the name attribute
        const firstErrorField = Object.keys(formik.errors)[0];
        const errorElement = document.querySelector(
          `[name="${firstErrorField}"]`
        );

        if (errorElement) {
          // Use requestAnimationFrame to ensure smooth scrolling
          setTimeout(() => {
            errorElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            errorElement.focus();
          }, 100);
        }

        return; // Prevent form submission
      }

      try {
        setLoading(true);
        const formData = new FormData();

        for (const key in values) {
          if (values[key]) {
              formData.append(key, values[key]);
            }
        }
        formData.append("user_id", userid);

        const response = await LocalServerFD.put(
          `/api/user/update?user_id=${userid}`,
          formData
        );

        ToastComponent("success", response?.data?.message);
        if (user?.user?.role_slug !== "super_admin") {
          dispatch(updateUser(userid));
        }
   
        let redirect = localStorage.getItem("redirect");
        let redirectId = localStorage.getItem("redirect_id");
        localStorage.removeItem("redirect");
        localStorage.removeItem("redirect_id");
        if (redirect && redirect === "doctors")
          router.push(`/users/${redirectId}`);
        else if (redirect && redirect === "users") router.push(`/users`);
        else router.push(`/`);
      } catch (error) {
        ToastComponent("error", getErrorMessage(error));
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const num = Number(formik.values.number_of_insurance);
    if (!num || num < 1) {
      formik.setFieldValue("bumber_of_insorunce", []);
      return;
    }

    const newFields = Array.from({ length: num }, (_, index) => ({
      insurance_name:
        formik.values.bumber_of_insorunce[index]?.insurance_name || "",
      insurance_id:
        formik.values.bumber_of_insorunce[index]?.insurance_id || "",
    }));

    formik.setFieldValue("bumber_of_insorunce", newFields);
  }, [formik.values.number_of_insurance]);

  let formValues = formik.values;

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        ToastComponent("error", "File size must be less than or equal to 1MB");
        return;
      }
      formik.setFieldValue("logo", file);
    }
  };

  const debouncedCheckEmail = useCallback(
    debounce(async (email) => {
      await formik.setFieldValue("email", email);
      await formik.validateField("email");

      if (!formik.errors.email && email) {
        try {
          await LocalServer.post(`/api/check-email/`, { email });
        } catch (error) {
          ToastComponent("error", getErrorMessage(error));
        }
      }
    }, 500), // Adjust debounce delay as needed
    []
  );

  const handleCheckEmail = async (event) => {
    const email = event?.target.value;
    await formik.setFieldValue("email", email);
    debouncedCheckEmail(email);
  };

  const addField = () => {
    formik.setFieldValue("business_addresses", [
      ...(formik.values.business_addresses || []),
      {
        phone: "",
        fax: "",
        email: "",
        practice_address: "",
        mailing_address: "",
      },
    ]);
  };

  // Function to remove an object dynamically
  const removeField = (index) => {
    const newFields = [...formik?.values?.business_addresses];
    newFields.splice(index, 1);
    formik.setFieldValue("business_addresses", newFields);
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////

  const handleAddInsurance = () => {
    formik.setValues((prevValues) => ({
      ...prevValues,
      insurances: [...(prevValues.insurances || []), { name: "" }],
    }));
  };
  const handleRemoveInsurance = (index) => {
    const updatedInsurances = [...(formik.values.insurances || [])];
    updatedInsurances.splice(index, 1);

    formik.setFieldValue("insurances", updatedInsurances);
  };

  const togglePopover = () => {
    setPopoverOpen({
      modal: false,
      index: null,
      action: "",
    });
  };

  const handleConfirm = () => {
    if (popoverOpen?.action === "reset-all") {
      formik.resetForm();
      togglePopover();
    } else if (popoverOpen?.action === "remove-adress") {
      removeField(popoverOpen?.index);
      togglePopover();
    } else if (popoverOpen?.action === "remove-ins") {
      handleRemoveInsurance(popoverOpen?.index);
      togglePopover();
    } else {
      togglePopover();
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="provider-data-form--outer">
      <ConfirmationPopover
        popoverOpen={popoverOpen?.modal}
        togglePopover={togglePopover}
        handleConfirm={handleConfirm}
        loading={loading}
      />
      <div className="sub-header--main">
        <SubHeader
          SubHeaderLogo={UserIcon}
          headerTitle="User Data"
          HeaderText="Required fields are indicated with a red asterik, All other fields are optional."
        />
      </div>
      {/* Ending the sub header */}
      {loader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <Spinner type="grow" style={{ color: "#6b3fa0" }} />
        </div>
      ) : (
        <div className="provider-form--main">
          <div className="row">
            <div className="col-md-4 col-lg-4">
              <div className="provider-data-sidebar">
                <ButtonX className="btn-quote">Completion Rate</ButtonX>

                <div className="section">
                  <ul className="list-unstyled">
                    {fields.map((field, index) => (
                      <li
                        key={index}
                        className="d-flex align-items-center gap-3"
                      >
                        <span
                          className={`status ${
                            formValues[field.value] !== ""
                              ? "status-success"
                              : formValues[field.value] === "" &&
                                (field.value === "name" ||
                                  field.value === "provider_npi")
                              ? "status-danger"
                              : "status-neutral"
                          }`}
                        ></span>
                        <span>{field.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-8 col-lg-8 provider-form-scroll-container">
              <div className="provider-data-form--main">
                <div className="provider-data-form--inner">
                  <div className="provider-data-form--header d-flex justify-content-between">
                    <h5>Update User</h5>
                    {user?.user?.role_slug === "super_admin" && (
                      <div className="cross-button" role="button">
                        <Image
                          src={CloseButton}
                          alt="cross icon"
                          onClick={() => history.back()}
                        />
                      </div>
                    )}
                  </div>
                  <div className="provider-data-form--inner">
                    <Form onSubmit={formik.handleSubmit}>
                      <FocusError formik={formik} />
                      <div className="d-flex flex-wrap">
                        <div
                          className={`flex-fill d-flex mb-40 relative`}
                        >
                          {!formik.values?.logo ? (
                            <GenericField
                              type="file"
                              name="logo"
                              label="Logo Upload"
                              onChange={handleLogoChange}
                              className={`custom-input `}
                            />
                          ) : (
                            <>
                              <div className="cross-button" role="button">
                                <FaTrash
                                  onClick={() =>
                                      formik.setFieldValue("logo", "")
                                  }
                                  className="del delete_icon"
                                />
                              </div>
                              <Image
                                src={
                                  typeof formik.values?.logo === "string" &&
                                  formik.values?.logo.includes("base64")
                                    ? base64ToBlob(formik.values?.logo)
                                    : formik.values?.logo instanceof File
                                    ? URL.createObjectURL(formik.values?.logo)
                                    : null
                                }
                                alt="Uploaded Image"
                                width={120}
                                height={120}
                                className="uploaded-image mb-3"
                                style={{
                                  height: 120,
                                  width: 120,
                                  borderRadius: "50%",
                                }}
                              />
                            </>
                          )}
                        </div>
                        <div className="flex-fill w-100">
                          <GenericField
                            type="text"
                            name="name"
                            className={`custom-input`}
    
                            label={
                              <div className="d-flex align-items-center">
                                Name 
                                <Image
                                  src={Alert}
                                  alt="alert-icon"
                                  className="ms-2"
                                />
                              </div>
                            }
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && formik.errors.name}
                          />
                        </div>
                        <div className="flex-fill w-100">
                          <GenericField
                            type="email"
                            name="email"
                            // placeholder="0000000"
                            label="Email"
                            disabled
                            value={formik.values.email}
                            onChange={(event) => handleCheckEmail(event)}
                            error={
                              formik.touched.email &&
                              formik.errors.email
                            }
                          />
                        </div>
                      </div>
                  
                     
                      <hr
                        className="hr hr-blurry"
                        style={{ margin: "25px 0" }}
                      />
                     
                

                      
                      <div className="provider-data-form--actions d-flex justify-content-center align-items-center">
                        <ButtonX
                          className=" btn-clear"
                          clickHandler={() => {
                            setPopoverOpen({
                              modal: true, // Open popover
                              index: null, // Store index of the item
                              action: "reset-all", // Store action type (e.g., 'delete', 'edit', etc.)
                            });
                          }}
                        >
                          Clear All
                        </ButtonX>
                        <ButtonX
                          type="submit"
                          disabled={loading}
                          className=" btn-default btn-quote btn-quote--hover"
                        >
                          Submit & Continue
                        </ButtonX>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
