import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IsLoggedInContext } from '../App.js';
import styles from "../styles.css";

export default function AdminLoginPage() {
  const { setIsLoggedIn, setIsAdmin } = useContext(IsLoggedInContext);

  const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);
  const [isLoginButtonActive, setIsLoginButtonActive] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  const handleEmailChange = (e) => {
    setLoginInfo({ ...loginInfo, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setLoginInfo({ ...loginInfo, password: e.target.value });
  };

  const navigate = useNavigate();

  const Login = async () => {
    try {
      console.log(loginInfo);

      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        setIsAdmin(true);
        navigate('/admin-dashboard');
        return true;
      } else {
        console.log("invalid credentials");
        return false;
      }
    } catch (error) {
      console.error("error detected: ", error);
      return false;
    }
  };

  const LoginButton = () => {
    const handleClick = () => {
      setIsLoginButtonActive(false);
      Login().then((isSuccess) => {
        if (isSuccess) {
          navigate("/admin-dashboard", {});
        } else {
          setIsInvalidCredentials(true);
          setIsLoginButtonActive(true);
        }
      });
    };

    return (
      <button className="button1" onClick={handleClick} disabled={!isLoginButtonActive}>
        LOGIN
      </button>
    );
  };

  const ValidateAllFields = () => {
    if (loginInfo.email.length <= 0 || loginInfo.password.length <= 0) {
      setIsLoginButtonActive(false);
    } else if (emailRef.current.validity.valid && passwordRef.current.validity.valid) {
      setIsLoginButtonActive(true);
    } else {
      setIsLoginButtonActive(false);
    }
  };

  const ToggleShowPassword = () => {
    if (passwordRef.current.type === "password") {
      passwordRef.current.type = "text";
    } else {
      passwordRef.current.type = "password";
    }
  };

  const InvalidCredentialsMessage = () => (
    isInvalidCredentials && <p className="warningText">&#9888; The email or password entered is invalid.</p>
  );

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", margin: "0px",
      paddingTop: "150px", paddingBottom: "150px", backgroundColor: "#c8e6b2" }}>
      <div style={{ width: "60%", display: "inline-block", lineHeight: "40px" }}>
        <h1>Administrator Login</h1>
        <InvalidCredentialsMessage />
        <p>Email:</p>
        <input className="input1"
          required type="email"
          placeholder="Email"
          ref={emailRef}
          value={loginInfo.email}
          onChange={handleEmailChange}
          onInput={ValidateAllFields}
        />
        <p>Password:</p>
        <input className="input1" required
          type="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          placeholder="Password" ref={passwordRef}
          value={loginInfo.password}
          onChange={handlePasswordChange}
          onInput={ValidateAllFields}
        /><br />
        <input type="checkbox" onClick={ToggleShowPassword} /> Show Password
        <br />
        <div style={{ marginTop: '20px' }}>
          <LoginButton />
        </div>
      </div>
    </div>
  );
}

