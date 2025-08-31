import logo from "./../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="Footer">
        <div className="footer-section">
          <h3>Connect with Us</h3>
          <a href="#">
            <li>Facebook</li>
          </a>
          <a href="#">
            <li>Instagram</li>
          </a>
          <a href="#">
            <li>Twitter</li>
          </a>
        </div>

        <div className="footer-section">
          <h3>Let Us Help You</h3>
          <Link to="/Your-Account">
            <li>Your Account</li>
          </Link>
          <a href="#">
            <li>Returns Centre</li>
          </a>
          <a href="#">
            <li>Recalls and Product Safety Alerts</li>
          </a>
          <a href="#">
            <li>100% Purchase Protection</li>
          </a>
          <a href="#">
            <li>Help</li>
          </a>
        </div>
      </div>

      <div className="FLOGO">
        <center>
          <Link to="/">
            <img className="Logo00" src={logo} alt="Logo" />
          </Link>
        </center>
      </div>
    </>
  );
};

export default Footer;
