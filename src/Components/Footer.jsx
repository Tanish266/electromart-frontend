import logo from "./../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="Footer">
        <div>
          <ul>Connect with Us</ul>
          <a href="" style={{ textDecoration: "none", color: "black" }}>
            <li>FaceBook</li>
          </a>
          <a href="" style={{ textDecoration: "none", color: "black" }}>
            <li>Instagram</li>
          </a>
          <a href="" style={{ textDecoration: "none", color: "black" }}>
            <li>Twitter</li>
          </a>
        </div>
        <div>
          <a href="" style={{ textDecoration: "none", color: "black" }}>
            <ul>Let Us Help You</ul>
          </a>
          <a
            href="/Your-Account"
            style={{ textDecoration: "none", color: "black" }}
          >
            <li>Your Account</li>
          </a>
          <a href="" style={{ textDecoration: "none", color: "black" }}>
            <li>Returns Centre</li>
          </a>
          <a href="" style={{ textDecoration: "none", color: "black" }}>
            <li>Recalls and Product Safety Alerts</li>
          </a>
          <a href="" style={{ textDecoration: "none", color: "black" }}>
            <li>100% Purchase Protection</li>
          </a>
          <a href="" style={{ textDecoration: "none", color: "black" }}>
            <li>Help</li>
          </a>
        </div>
      </div>

      <div className="FLOGO">
        <center>
          <Link to="/">
            <img className="Logo" src={logo} />
          </Link>
        </center>
      </div>
    </>
  );
};

export default Footer;
