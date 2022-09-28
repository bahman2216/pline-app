import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "./component/Home";
import Footer from "./component/layout/Footer";
import NotFound from "./component/errors/NotFound";
import { ToastContainer } from "react-toastify";
import Login from "./component/login/Login";
import React, { useState, useEffect } from "react";
import PrivateRoute from "./component/private-route/PrivateRoute";
import ChangePassword from "./component/users/ChangePassword";

import {
  getCookies,
  removeCookies,
  setCookies,
} from "./component/services/PlineTools";
import Zones from "./component/zones/Zones";
import ZoneForm from "./component/zones/ZoneForm";
import Pagers from "./component/pagers/Pagers";
import PagerForm from "./component/pagers/PagerForm";
import Sounds from "./component/sounds/Sounds";
import SoundForm from "./component/sounds/SoundForm";
import SoundTest from "./component/sounds/SoundTest";
import SoundTestForm from "./component/sounds/SoundTestForm";
import ManualPlay from "./component/schedules/ManualPlay";
import Schedules from "./component/schedules/Schedules";
import ScheduleForm from "./component/schedules/ScheduleForm";
import Azans from "./component/azans/Azans";
import AzanForm from "./component/azans/AzanForm";
import CsvUpload from "./component/azans/CsvUpload";
import Users from "./component/users/Users";
import UserForm from "./component/users/UserForm";
import OtherSounds from "./component/sounds/OtherSounds";

const App = () => {
  const navigate = useNavigate();
  const [, setState] = useState({ menuHide: false });

  useEffect(() => {
    setState({ menuHide: getCookies("isAuth") });
  }, []);

  const login = (result) => {
    setCookies("auth", true);
    setCookies("username", result.username);
    setCookies("user_id", result.user_id);
    setCookies("token", result.token);
    setState({});
    navigate("/");
  };

  const logout = () => {
    removeCookies("auth");
    removeCookies("username");
    removeCookies("token");
    removeCookies("user_id");

    setCookies("name", "");
    setCookies("username", "");
    setCookies("token", "");
    setCookies("user_id", "");

    setState({});
    navigate("/login");
  };

  return (
    <div dir="rtl">
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        Row
        theme="colored"
      />
      <Container style={{ paddingBottom: "3.5vw" }}>
        <Routes>
          <Route element={<PrivateRoute LogoutAction={logout} />}>
            <Route exact path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/user/change-password" element={<ChangePassword />} />

            <Route path="/zones/index" element={<Zones />} />
            <Route path="/zones/create" element={<ZoneForm />} />
            <Route path="/zones/edit/:id" element={<ZoneForm />} />

            <Route path="/pagers/index" element={<Pagers />} />
            <Route path="/pagers/create" element={<PagerForm />} />
            <Route path="/pagers/edit/:id" element={<PagerForm />} />

            <Route path="/sounds/index" element={<Sounds />} />
            <Route path="/sounds/create" element={<SoundForm />} />
            <Route path="/sounds/test" element={<SoundTest />} />
            <Route path="/sounds/from-test/:id" element={<SoundTestForm />} />
            <Route path="/sounds/manual" element={<ManualPlay />} />
            <Route path="/sounds/get-sounds/:id" element={<OtherSounds />} />

            <Route path="/schedules/index" element={<Schedules />} />
            <Route path="/schedules/create" element={<ScheduleForm />} />
            <Route path="/schedules/edit/:id" element={<ScheduleForm />} />

            <Route path="/azans/index" element={<Azans />} />
            <Route path="/azans/create" element={<AzanForm />} />
            <Route path="/azans/edit/:id" element={<AzanForm />} />
            <Route path="/azans/upload-csv" element={<CsvUpload />} />

            <Route path="/users/index" element={<Users />} />
            <Route path="/users/create" element={<UserForm />} />
            <Route path="/users/edit/:id" element={<UserForm />} />
          </Route>

          <Route path="/login" element={<Login LoginAction={login} />} />
          <Route path="/notfound" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/notfound" />} />
        </Routes>
        <Footer />
      </Container>
    </div>
  );
};

export default App;
