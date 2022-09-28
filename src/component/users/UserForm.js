import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { getRequest, patchRequest, postRequest } from "../services/PlineTools";

const UserForm = () => {
  const [state, setState] = useState({
    l_name: "",
    f_name: "",
    enable: true,
    desc: "",
    password: "",
    id: null,
  });
  const navigate = useNavigate();
  const params = useParams();

  const load = () => {
    let id = params.id;
    if (id !== undefined) {
      const url = "/users/" + id;
      getRequest(url)
        .then((result) => {
          setState(result.data);
        })
        .catch(() => {
          toast.error("دریافت اطلاعات با خطا مواجح شد.");
        });
    }
  };

  const saveData = (e) => {
    e.preventDefault();
    let req = null;
    if (params.id === undefined) {
      req = postRequest("/users", state);
    } else {
      req = patchRequest("/users/" + params.id, state);
    }

    req
      .then((data) => {
        if (data.length > 0) {
          data.forEach((value) => {
            toast.error(value.message);
          });
        }
        toast.success("اطلاعات با موفقیت ثبت شد");
        navigate("/users/index");
      })
      .catch((error) => {
        if (error.response.status === 422) {
          error.response.data.forEach((value) => {
            toast.info(value.message);
          });
        }
      });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Container>
      <h3>کاربر</h3>
      <hr />
      <Form onSubmit={saveData}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="password">
              <Form.Check
                label={"وضعیت"}
                checked={state.enable}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.enable = e.target.checked;
                  setState(tmp);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="l_name">
              <Form.Label>{"نام"}</Form.Label>
              <Form.Control
                type="text"
                required={true}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.l_name = e.target.value;
                  setState(tmp);
                }}
                defaultValue={state.l_name}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="f_name">
              <Form.Label>{"نام خانوادگی"}</Form.Label>
              <Form.Control
                type="text"
                required={true}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.f_name = e.target.value;
                  setState(tmp);
                }}
                defaultValue={state.f_name}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>{"نام کاربری"}</Form.Label>
              <Form.Control
                type="text"
                style={{ direction: "ltr", textAlign: "center" }}
                required={true}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.username = e.target.value;
                  setState(tmp);
                }}
                defaultValue={state.username}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>{"کلمه عبور"}</Form.Label>
              <Form.Control
                type="text"
                required={params.id === undefined}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.password = e.target.value;
                  setState(tmp);
                }}
                defaultValue={""}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="id_number">
              <Form.Label>{"کد شناسایی"}</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.id_number = e.target.value;
                  setState(tmp);
                }}
                defaultValue={state.id_number}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="departeman">
              <Form.Label>{"واحد"}</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.departeman = e.target.value;
                  setState(tmp);
                }}
                defaultValue={state.departeman}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="desc">
              <Form.Label>{"شرح"}</Form.Label>
              <Form.Control
                as={"textarea"}
                rows={3}
                maxLength={1024}
                defaultValue={state.desc}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.desc = e.target.value;
                  setState(tmp);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Button variant="primary" type="submit">
              ذخیره
            </Button>{" "}
            <Button
              variant="danger"
              onClick={() => {
                navigate("/users/index");
              }}
            >
              انصراف
            </Button>{" "}
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default UserForm;
