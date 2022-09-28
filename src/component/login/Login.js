import React, { useState } from "react";
import "./Login.css";
import "../../App.css";
import Avatar from "./avatar_2x.png";
import { toast } from "react-toastify";
import { postRequest, ResponseStatus } from "../services/PlineTools";

function Login(props) {
  const [state] = useState({
    username: "",
    password: "",
    RememberMe: false,
  });

  const Login = (e) => {
    e.preventDefault();
    postRequest("/users/login", state).then((result) => {
      result = result.data;
      console.log(result);
      if (result.status === ResponseStatus.Success) {
        toast.success(result.messages);
        props.LoginAction(result);
      } else {
        result.messages.forEach((v) => {
          toast.error(v);
        });
      }
    });
  };

  return (
    <>
      <div className="container my-center">
        <div className="card card-container">
          <img
            id="profile-img"
            className="profile-img-card"
            src={Avatar}
            alt="Avatar"
          />
          <p id="profile-name" className="profile-name-card"></p>
          <form onSubmit={Login} className="form-signin">
            <span id="reauth-email" className="reauth-email"></span>
            <input
              type="text"
              className="form-control"
              placeholder="نام کاربری"
              required
              autoFocus
              autoComplete="off"
              defaultValue={state?.username}
              onChange={(e) => {
                state.username = e.target.value;
              }}
            />
            <input
              type="password"
              className="form-control"
              placeholder="کلمه عبور"
              required
              autoComplete="off"
              defaultValue={state?.password}
              onChange={(e) => {
                state.password = e.target.value;
              }}
            />
            <div id="remember" className="checkbox">
              <label>
                <input
                  type="checkbox"
                  defaultChecked={state?.RememberMe}
                  onChange={(e) => {
                    state.RememberMe = e.target.checked;
                  }}
                  onClick={(e) => {
                    state.RememberMe = e.target.checked;
                  }}
                />{" "}
                مرا به خاطر بسپار
              </label>
            </div>
            <button className="btn  btn-primary btn-block mt-2" type="submit">
              ورود
            </button>
          </form>
          {/* <a href="#" className="forgot-password">
            Forgot the password?
          </a> */}
        </div>
      </div>
    </>
  );
}

export default Login;
