import React from "react";
import "./Footer.scss";
const Footer = ({ className }) => {
  return (
    <footer className={`footer  ${className} `}>
      <div className="container-1 footer-container">
        <div className="footer-section first-column d-flex align-items-center">
          <div className="main-logo">Footer</div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
