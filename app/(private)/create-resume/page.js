"use client";

import { useState } from "react";
import { Button, Form } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LocalServer } from "@/app/utils";
import ToastNotification from "@/app/utils/Toast";
import { getErrorMessage } from "@/app/utils/helper";
import "./CreateResume.scss";

const { ToastComponent } = ToastNotification;

const CreateResume = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const initialValues = {
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    photo   : null,
    address: "",
    city: "",
    state: "",
    country: "",
    linkedin: "",
    portfolio: "",
    description: "",
    date_of_birth: "",
    cnic: "",  
    marital_status: "",
    religion: "",   
    zipCode: "",   
    
    // Work Experience
    experiences: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        location: "",
        roles: [
          {
            role: "",
            responsibilities: ""
          }
        ]
      }
    ],
    
    // Education
    education: [
      {
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        current: false,
        gpa: "",
        location: ""
      }
    ],
    
    // Technical Skills
    technicalSkills: [],
    
    // Soft Skills
    softSkills: [],
    
    // Achievements
    achievements: [
      {
        title: "",
        description: "",
        date: "",
        organization: ""
      }
    ],
    
    // Hobbies
    hobbies: [],
    
    // Languages
    languages: [
      {
        language: "",
        proficiency: "",
        certification: ""
      }
    ],
    
    // Certifications
    certifications: [
      {
        name: "",
        issuer: "",
        date: "",
        expiryDate: "",
        credentialId: ""
      }
    ],
    
    // Projects
    projects: [
      {
        name: "",
        description: "",
        technologies: "",
        startDate: "",
        endDate: "",
        url: ""
      }
    ]
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    description: Yup.string().required("Professional description is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        console.log("Submitting resume with values:", values);
        console.log("Current token in localStorage:", localStorage.getItem("access_token"));
        const response = await LocalServer.post("/api/resume/create", values);
        console.log("Resume creation response:", response);
        if (response?.data?.success) {
          ToastComponent("success", "Resume created successfully!");
          // Redirect to dashboard or resume preview
        }
      } catch (error) {
        console.error("Error creating resume:", error);
        ToastComponent("error", getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addExperience = () => {
    formik.setFieldValue("experiences", [
      ...formik.values.experiences,
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        location: "",
        roles: [
          {
            role: "",
            responsibilities: ""
          }
        ]
      }
    ]);
  };

  const removeExperience = (index) => {
    const experiences = formik.values.experiences.filter((_, i) => i !== index);
    formik.setFieldValue("experiences", experiences);
  };

  const addEducation = () => {
    formik.setFieldValue("education", [
      ...formik.values.education,
      {
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        current: false,
        gpa: "",
        location: ""
      }
    ]);
  };

  const removeEducation = (index) => {
    const education = formik.values.education.filter((_, i) => i !== index);
    formik.setFieldValue("education", education);
  };

  const addTechnicalSkill = (skill) => {
    if (skill.trim() && !formik.values.technicalSkills.includes(skill.trim())) {
      formik.setFieldValue("technicalSkills", [...formik.values.technicalSkills, skill.trim()]);
    }
  };

  const removeTechnicalSkill = (skillToRemove) => {
    const skills = formik.values.technicalSkills.filter(skill => skill !== skillToRemove);
    formik.setFieldValue("technicalSkills", skills);
  };

  const addSoftSkill = (skill) => {
    if (skill.trim() && !formik.values.softSkills.includes(skill.trim())) {
      formik.setFieldValue("softSkills", [...formik.values.softSkills, skill.trim()]);
    }
  };

  const removeSoftSkill = (skillToRemove) => {
    const skills = formik.values.softSkills.filter(skill => skill !== skillToRemove);
    formik.setFieldValue("softSkills", skills);
  };

  const addAchievement = () => {
    formik.setFieldValue("achievements", [
      ...formik.values.achievements,
      {
        title: "",
        description: "",
        date: "",
        organization: ""
      }
    ]);
  };

  const removeAchievement = (index) => {
    const achievements = formik.values.achievements.filter((_, i) => i !== index);
    formik.setFieldValue("achievements", achievements);
  };

  const addHobby = (hobby) => {
    if (hobby.trim() && !formik.values.hobbies.includes(hobby.trim())) {
      formik.setFieldValue("hobbies", [...formik.values.hobbies, hobby.trim()]);
    }
  };

  const removeHobby = (hobbyToRemove) => {
    const hobbies = formik.values.hobbies.filter(hobby => hobby !== hobbyToRemove);
    formik.setFieldValue("hobbies", hobbies);
  };

  const addLanguage = () => {
    formik.setFieldValue("languages", [
      ...formik.values.languages,
      {
        language: "",
        proficiency: "",
        certification: ""
      }
    ]);
  };

  const removeLanguage = (index) => {
    const languages = formik.values.languages.filter((_, i) => i !== index);
    formik.setFieldValue("languages", languages);
  };

  const addCertification = () => {
    formik.setFieldValue("certifications", [
      ...formik.values.certifications,
      {
        name: "",
        issuer: "",
        date: "",
        expiryDate: "",
        credentialId: ""
      }
    ]);
  };

  const removeCertification = (index) => {
    const certifications = formik.values.certifications.filter((_, i) => i !== index);
    formik.setFieldValue("certifications", certifications);
  };

  const addProject = () => {
    formik.setFieldValue("projects", [
      ...formik.values.projects,
      {
        name: "",
        description: "",
        technologies: "",
        startDate: "",
        endDate: "",
        url: ""
      }
    ]);
  };

  const removeProject = (index) => {
    const projects = formik.values.projects.filter((_, i) => i !== index);
    formik.setFieldValue("projects", projects);
  };

  const addRole = (experienceIndex) => {
    const experiences = [...formik.values.experiences];
    experiences[experienceIndex].roles.push({
      role: "",
      responsibilities: ""
    });
    formik.setFieldValue("experiences", experiences);
  };

  const removeRole = (experienceIndex, roleIndex) => {
    const experiences = [...formik.values.experiences];
    experiences[experienceIndex].roles.splice(roleIndex, 1);
    formik.setFieldValue("experiences", experiences);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        formik.setFieldValue("photo", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label htmlFor="photo">Profile Image</label>
              <div className="image-upload-section">
                {formik.values.photo ? (
                  <div className="image-preview">
                    <img src={formik.values.photo} alt="Profile" />
                    <button
                      type="button"
                      onClick={() => formik.setFieldValue("photo", null)}
                      className="remove-image-btn"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div className="image-upload-placeholder">
                    <input
                      type="file"
                      id="photo"
                      name="photo"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="photo" className="upload-btn">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Upload Image
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.firstName && formik.errors.firstName ? 'error' : ''}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <span className="error-message">{formik.errors.firstName}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.lastName && formik.errors.lastName ? 'error' : ''}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <span className="error-message">{formik.errors.lastName}</span>
                )}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.email && formik.errors.email ? 'error' : ''}
                />
                {formik.touched.email && formik.errors.email && (
                  <span className="error-message">{formik.errors.email}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.phone && formik.errors.phone ? 'error' : ''}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <span className="error-message">{formik.errors.phone}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date_of_birth">Date of Birth </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formik.values.date_of_birth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.date_of_birth && formik.errors.date_of_birth ? 'error' : ''}
                />
                {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                  <span className="error-message">{formik.errors.date_of_birth}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="cnic"> ID Number</label>
                <input
                  type="tel"
                  id="cnic"
                  name="cnic"
                    value={formik.values.cnic}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={formik.touched.cnic && formik.errors.cnic ? 'error' : ''}
                />
                {formik.touched.cnic && formik.errors.cnic && (
                  <span className="error-message">{formik.errors.cnic}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="religion">Religion</label>
                <input
                  type="text"
                  id="religion"
                  name="religion"
                  value={formik.values.religion}
                  onChange={formik.handleChange}
                  placeholder="e.g., Islam, Christianity, etc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="marital_status">Marital Status</label>
                <select
                  id="marital_status"
                  name="marital_status"
                  value={formik.values.marital_status}
                  onChange={formik.handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>


            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="textarea"
                id="address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                placeholder="Street address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formik.values.zipCode}
                  onChange={formik.handleChange}
                />
              </div>
            </div>

           

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="portfolio">Portfolio</label>
                <input
                  type="url"
                  id="portfolio"
                  name="portfolio"
                  value={formik.values.portfolio}
                  onChange={formik.handleChange}
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn</label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  value={formik.values.linkedin}
                  onChange={formik.handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-section">
            <h3>Professional Description</h3>
            <div className="form-group">
              <label htmlFor="description">Professional Description *</label>
              <textarea
                id="description"
                name="description"
                rows="6"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.touched.description && formik.errors.description ? 'error' : ''}
                placeholder="Write a compelling description of your professional background, key skills, and career objectives..."
              />
              {formik.touched.description && formik.errors.description && (
                <span className="error-message">{formik.errors.description}</span>
              )}
            </div>

            <h3>Work Experience</h3>
            {formik.values.experiences.map((experience, index) => (
              <div key={index} className="experience-item">
                <div className="experience-header">
                  <h4>Experience {index + 1}</h4>
                  {formik.values.experiences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Job Title</label>
                    <input
                      type="text"
                      name={`experiences.${index}.position`}
                      value={experience.position}
                      onChange={formik.handleChange}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      name={`experiences.${index}.company`}
                      value={experience.company}
                      onChange={formik.handleChange}
                      placeholder="e.g., Tech Corp"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name={`experiences.${index}.startDate`}
                      value={experience.startDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      name={`experiences.${index}.endDate`}
                      value={experience.endDate}
                      onChange={formik.handleChange}
                      disabled={experience.current}
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name={`experiences.${index}.current`}
                        checked={experience.current}
                        onChange={formik.handleChange}
                      />
                      Currently working here
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Job Description</label>
                  <textarea
                    name={`experiences.${index}.description`}
                    value={experience.description}
                    onChange={formik.handleChange}
                    rows="4"
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>

                <div className="roles-section">
                  <div className="roles-header">
                    <h5>Roles & Responsibilities</h5>
                    <button
                      type="button"
                      onClick={() => addRole(index)}
                      className="add-role-btn"
                    >
                      + Add Role
                    </button>
                  </div>
                  
                  {experience.roles && experience.roles.map((role, roleIndex) => (
                    <div key={roleIndex} className="role-item">
                      <div className="role-header">
                        <h6>Role {roleIndex + 1}</h6>
                        {experience.roles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRole(index, roleIndex)}
                            className="remove-role-btn"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="form-group">
                        <label>Role Title</label>
                        <input
                          type="text"
                          name={`experiences.${index}.roles.${roleIndex}.role`}
                          value={role.role}
                          onChange={formik.handleChange}
                          placeholder="e.g., Senior Developer, Team Lead"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Responsibilities</label>
                        <textarea
                          name={`experiences.${index}.roles.${roleIndex}.responsibilities`}
                          value={role.responsibilities}
                          onChange={formik.handleChange}
                          rows="3"
                          placeholder="Describe your specific responsibilities in this role..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <button type="button" onClick={addExperience} className="add-btn">
              + Add Another Experience
            </button>
          </div>
        );

      case 3:
        return (
          <div className="form-section">
            <h3>Education</h3>
            {formik.values.education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="education-header">
                  <h4>Education {index + 1}</h4>
                  {formik.values.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Institution</label>
                    <input
                      type="text"
                      name={`education.${index}.institution`}
                      value={edu.institution}
                      onChange={formik.handleChange}
                      placeholder="e.g., University of Technology"
                    />
                  </div>
                  <div className="form-group">
                    <label>Degree</label>
                    <input
                      type="text"
                      name={`education.${index}.degree`}
                      value={edu.degree}
                      onChange={formik.handleChange}
                      placeholder="e.g., Bachelor of Science"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Field of Study</label>
                    <input
                      type="text"
                      name={`education.${index}.field`}
                      value={edu.field}
                      onChange={formik.handleChange}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div className="form-group">
                    <label>GPA</label>
                    <input
                      type="text"
                      name={`education.${index}.gpa`}
                      value={edu.gpa}
                      onChange={formik.handleChange}
                      placeholder="e.g., 3.8"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name={`education.${index}.startDate`}
                      value={edu.startDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      name={`education.${index}.endDate`}
                      value={edu.endDate}
                      onChange={formik.handleChange}
                      disabled={edu.current}
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name={`education.${index}.current`}
                        checked={edu.current}
                        onChange={formik.handleChange}
                      />
                      Currently studying
                    </label>
                  </div>
                </div>
              </div>
            ))}
            
            <button type="button" onClick={addEducation} className="add-btn">
              + Add Another Education
            </button>

            <h3>Technical Skills</h3>
            <div className="skills-section">
              <div className="form-group">
                <label>Add Technical Skills</label>
                <div className="skill-input-group">
                  <input
                    type="text"
                    placeholder="e.g., JavaScript, React, Python, AWS"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTechnicalSkill(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      addTechnicalSkill(input.value);
                      input.value = '';
                    }}
                    className="add-skill-btn"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="skills-list">
                {formik.values.technicalSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeTechnicalSkill(skill)}
                      className="remove-skill"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <h3>Soft Skills</h3>
            <div className="skills-section">
              <div className="form-group">
                <label>Add Soft Skills</label>
                <div className="skill-input-group">
                  <input
                    type="text"
                    placeholder="e.g., Leadership, Communication, Problem Solving"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSoftSkill(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      addSoftSkill(input.value);
                      input.value = '';
                    }}
                    className="add-skill-btn"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="skills-list">
                {formik.values.softSkills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSoftSkill(skill)}
                      className="remove-skill"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <h3>Achievements</h3>
            {formik.values.achievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <div className="achievement-header">
                  <h4>Achievement {index + 1}</h4>
                  {formik.values.achievements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Achievement Title</label>
                    <input
                      type="text"
                      name={`achievements.${index}.title`}
                      value={achievement.title}
                      onChange={formik.handleChange}
                      placeholder="e.g., Employee of the Year"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      name={`achievements.${index}.date`}
                      value={achievement.date}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Organization</label>
                  <input
                    type="text"
                    name={`achievements.${index}.organization`}
                    value={achievement.organization}
                    onChange={formik.handleChange}
                    placeholder="e.g., Company Name"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name={`achievements.${index}.description`}
                    value={achievement.description}
                    onChange={formik.handleChange}
                    rows="3"
                    placeholder="Describe your achievement..."
                  />
                </div>
              </div>
            ))}
            
            <button type="button" onClick={addAchievement} className="add-btn">
              + Add Another Achievement
            </button>

            <h3>Hobbies</h3>
            <div className="hobbies-section">
              <div className="form-group">
                <label>Add Hobbies</label>
                <div className="skill-input-group">
                  <input
                    type="text"
                    placeholder="e.g., Photography, Reading, Sports"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addHobby(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      addHobby(input.value);
                      input.value = '';
                    }}
                    className="add-skill-btn"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="skills-list">
                {formik.values.hobbies.map((hobby, index) => (
                  <span key={index} className="skill-tag">
                    {hobby}
                    <button
                      type="button"
                      onClick={() => removeHobby(hobby)}
                      className="remove-skill"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <h3>Languages</h3>
            {formik.values.languages.map((language, index) => (
              <div key={index} className="language-item">
                <div className="language-header">
                  <h4>Language {index + 1}</h4>
                  {formik.values.languages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLanguage(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Language</label>
                    <input
                      type="text"
                      name={`languages.${index}.language`}
                      value={language.language}
                      onChange={formik.handleChange}
                      placeholder="e.g., English, Spanish, French"
                    />
                  </div>
                  <div className="form-group">
                    <label>Proficiency</label>
                    <select
                      name={`languages.${index}.proficiency`}
                      value={language.proficiency}
                      onChange={formik.handleChange}
                    >
                      <option value="">Select Proficiency</option>
                      <option value="Native">Native</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Basic">Basic</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Certification (Optional)</label>
                  <input
                    type="text"
                    name={`languages.${index}.certification`}
                    value={language.certification}
                    onChange={formik.handleChange}
                    placeholder="e.g., TOEFL, IELTS"
                  />
                </div>
              </div>
            ))}
            
            <button type="button" onClick={addLanguage} className="add-btn">
              + Add Another Language
            </button>

            <h3>Certifications</h3>
            {formik.values.certifications.map((certification, index) => (
              <div key={index} className="certification-item">
                <div className="certification-header">
                  <h4>Certification {index + 1}</h4>
                  {formik.values.certifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Certification Name</label>
                    <input
                      type="text"
                      name={`certifications.${index}.name`}
                      value={certification.name}
                      onChange={formik.handleChange}
                      placeholder="e.g., AWS Certified Solutions Architect"
                    />
                  </div>
                  <div className="form-group">
                    <label>Issuing Organization</label>
                    <input
                      type="text"
                      name={`certifications.${index}.issuer`}
                      value={certification.issuer}
                      onChange={formik.handleChange}
                      placeholder="e.g., Amazon Web Services"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Issue Date</label>
                    <input
                      type="date"
                      name={`certifications.${index}.date`}
                      value={certification.date}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      name={`certifications.${index}.expiryDate`}
                      value={certification.expiryDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Credential ID</label>
                  <input
                    type="text"
                    name={`certifications.${index}.credentialId`}
                    value={certification.credentialId}
                    onChange={formik.handleChange}
                    placeholder="e.g., 12345-ABC-XYZ"
                  />
                </div>
              </div>
            ))}
            
            <button type="button" onClick={addCertification} className="add-btn">
              + Add Another Certification
            </button>

            <h3>Projects</h3>
            {formik.values.projects.map((project, index) => (
              <div key={index} className="project-item">
                <div className="project-header">
                  <h4>Project {index + 1}</h4>
                  {formik.values.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      name={`projects.${index}.name`}
                      value={project.name}
                      onChange={formik.handleChange}
                      placeholder="e.g., E-Commerce Platform"
                    />
                  </div>
                  <div className="form-group">
                    <label>Technologies Used</label>
                    <input
                      type="text"
                      name={`projects.${index}.technologies`}
                      value={project.technologies}
                      onChange={formik.handleChange}
                      placeholder="e.g., React, Node.js, MongoDB"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name={`projects.${index}.startDate`}
                      value={project.startDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      name={`projects.${index}.endDate`}
                      value={project.endDate}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name={`projects.${index}.description`}
                    value={project.description}
                    onChange={formik.handleChange}
                    rows="3"
                    placeholder="Describe your project..."
                  />
                </div>

                <div className="form-group">
                  <label>Project URL</label>
                  <input
                    type="url"
                    name={`projects.${index}.url`}
                    value={project.url}
                    onChange={formik.handleChange}
                    placeholder="https://github.com/yourusername/project"
                  />
                </div>
              </div>
            ))}
            
            <button type="button" onClick={addProject} className="add-btn">
              + Add Another Project
            </button>
          </div>
        );

      case 4:
        return (
          <div className="form-section">
            <h3>Review & Submit</h3>
            <div className="review-section">
              <h4>Personal Information</h4>
              <p><strong>Name:</strong> {formik.values.firstName} {formik.values.lastName}</p>
              <p><strong>Email:</strong> {formik.values.email}</p>
              <p><strong>Phone:</strong> {formik.values.phone}</p>
              {formik.values.date_of_birth && <p><strong>Date of Birth:</strong> {formik.values.date_of_birth}</p>}
              {formik.values.cnic && <p><strong>ID Number:</strong> {formik.values.cnic}</p>}
              {formik.values.religion && <p><strong>Religion:</strong> {formik.values.religion}</p>}
              {formik.values.marital_status && <p><strong>Marital Status:</strong> {formik.values.marital_status}</p>}
              {formik.values.address && <p><strong>Address:</strong> {formik.values.address}</p>}
            </div>

            <div className="review-section">
              <h4>Professional Description</h4>
              <p>{formik.values.description}</p>
            </div>

            <div className="review-section">
              <h4>Work Experience</h4>
              {formik.values.experiences.map((exp, index) => (
                <div key={index} className="review-item">
                  <h5>{exp.position} at {exp.company}</h5>
                  <p>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                  {exp.description && <p>{exp.description}</p>}
                </div>
              ))}
            </div>

            <div className="review-section">
              <h4>Education</h4>
              {formik.values.education.map((edu, index) => (
                <div key={index} className="review-item">
                  <h5>{edu.degree} in {edu.field}</h5>
                  <p>{edu.institution}</p>
                  <p>{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>

            <div className="review-section">
              <h4>Technical Skills</h4>
              <div className="skills-display">
                {formik.values.technicalSkills.map((skill, index) => (
                  <span key={index} className="skill-display">{skill}</span>
                ))}
              </div>
            </div>

            <div className="review-section">
              <h4>Soft Skills</h4>
              <div className="skills-display">
                {formik.values.softSkills.map((skill, index) => (
                  <span key={index} className="skill-display">{skill}</span>
                ))}
              </div>
            </div>

            <div className="review-section">
              <h4>Achievements</h4>
              {formik.values.achievements.map((achievement, index) => (
                <div key={index} className="review-item">
                  <h5>{achievement.title}</h5>
                  <p><strong>Organization:</strong> {achievement.organization}</p>
                  <p><strong>Date:</strong> {achievement.date}</p>
                  {achievement.description && <p>{achievement.description}</p>}
                </div>
              ))}
            </div>

            <div className="review-section">
              <h4>Hobbies</h4>
              <div className="skills-display">
                {formik.values.hobbies.map((hobby, index) => (
                  <span key={index} className="skill-display">{hobby}</span>
                ))}
              </div>
            </div>

            <div className="review-section">
              <h4>Languages</h4>
              {formik.values.languages.map((language, index) => (
                <div key={index} className="review-item">
                  <h5>{language.language}</h5>
                  <p><strong>Proficiency:</strong> {language.proficiency}</p>
                  {language.certification && <p><strong>Certification:</strong> {language.certification}</p>}
                </div>
              ))}
            </div>

            <div className="review-section">
              <h4>Certifications</h4>
              {formik.values.certifications.map((certification, index) => (
                <div key={index} className="review-item">
                  <h5>{certification.name}</h5>
                  <p><strong>Issuer:</strong> {certification.issuer}</p>
                  {certification.date && <p><strong>Issue Date:</strong> {certification.date}</p>}
                  {certification.expiryDate && <p><strong>Expiry Date:</strong> {certification.expiryDate}</p>}
                  {certification.credentialId && <p><strong>Credential ID:</strong> {certification.credentialId}</p>}
                </div>
              ))}
            </div>

            <div className="review-section">
              <h4>Projects</h4>
              {formik.values.projects.map((project, index) => (
                <div key={index} className="review-item">
                  <h5>{project.name}</h5>
                  {project.technologies && <p><strong>Technologies:</strong> {project.technologies}</p>}
                  {(project.startDate || project.endDate) && (
                    <p><strong>Duration:</strong> {project.startDate} - {project.endDate || 'Present'}</p>
                  )}
                  {project.description && <p>{project.description}</p>}
                  {project.url && <p><strong>URL:</strong> <a href={project.url} target="_blank" rel="noopener noreferrer">{project.url}</a></p>}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="create-resume-container">
      <div className="create-resume-header">
        <h1>Create Your Resume</h1>
        <p>Build a professional resume in just a few steps</p>
      </div>

      <div className="progress-bar">
        <div className="progress-steps">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className={`step ${i + 1 <= currentStep ? 'active' : ''}`}>
              <div className="step-number">{i + 1}</div>
              <div className="step-label">
                {i === 0 && 'Personal Info'}
                {i === 1 && 'Experience'}
                {i === 2 && 'Education & Skills'}
                {i === 3 && 'Review'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Form onSubmit={formik.handleSubmit} className="resume-form">
        <div className="form-content">
          {renderStepContent()}
        </div>

        <div className="form-actions">
          {currentStep > 1 && (
            <Button type="button" onClick={prevStep} className="btn-secondary">
              Previous
            </Button>
          )}
          
          {currentStep < totalSteps ? (
            <Button type="button" onClick={nextStep} className="btn-primary">
              Next
            </Button>
          ) : (
            <Button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Resume...' : 'Create Resume'}
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default CreateResume;
