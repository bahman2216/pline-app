import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import "./ChangePassword.css";
import { postRequest, removeCookies, setCookies } from "../services/PlineTools";

function ChangePassword() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    oldPass: "",
    newPass: "",
    repNewPass: "",
  });

  const saveData = (e) => {
    e.preventDefault();

    postRequest("/users/change-password", state)
      .then(() => {
        window.alert(
          "کلمه عبور با موفقیت تغییر کرد. برای ادامه کار مجددا وارد شوید"
        );
        removeCookies("auth");
        removeCookies("username");
        removeCookies("token");
        removeCookies("user_id");

        setCookies("name", "");
        setCookies("username", "");
        setCookies("token", "");
        setCookies("user_id", "");
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 422) {
          error.response.data.forEach((value) => {
            toast.info(value.message);
          });
        }
      });
  };

  return (
    <div className="cng-pass">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h3>تغییر کلمه عبور</h3>
          <hr />
          <Form onSubmit={saveData}>
            <Form.Group className="mb-3">
              <Form.Label>کلمه عبور فعلی</Form.Label>
              <Form.Control
                type="password"
                required
                name="oldPass"
                defaultValue={state?.oldPass}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.oldPass = e.target.value;
                  setState(tmp);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>کلمه عبور جدید</Form.Label>
              <Form.Control
                name="newPass"
                required
                type="password"
                defaultValue={state?.newPass}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.newPass = e.target.value;
                  setState(tmp);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>تکرار کلمه عبور جدید</Form.Label>
              <Form.Control
                name="repNewPass"
                required
                type="password"
                defaultValue={state?.repNewPass}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.repNewPass = e.target.value;
                  setState(tmp);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-5">
              <Button variant="primary" type="submit">
                ذخیره
              </Button>{" "}
              <Button
                onClick={() => {
                  navigate("/home");
                }}
                variant="danger"
                type="button"
              >
                بازگشت
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default ChangePassword;
