import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { getRequest, patchRequest, postRequest } from "../services/PlineTools";

const ZoneForm = () => {
  const [state, setState] = useState({
    name: "",
    value: "",
    desc: "",
    id: null,
  });
  const navigate = useNavigate();
  const params = useParams();

  const load = () => {
    let id = params.id;
    if (id !== undefined) {
      const url = "/zones/" + id;
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
      req = postRequest("/zones", state);
    } else {
      req = patchRequest("/zones/" + params.id, state);
    }

    req
      .then((data) => {
        if (data.length > 0) {
          data.forEach((value) => {
            toast.error(value.message);
          });
        }
        toast.success("اطلاعات با موفقیت ثبت شد");
        navigate("/zones/index");
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
      <h3>ناحیه</h3>
      <hr />
      <Form onSubmit={saveData}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>{"نام ناحیه"}</Form.Label>
              <Form.Control
                type="text"
                required={true}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.name = e.target.value;
                  setState(tmp);
                }}
                defaultValue={state.name}
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
                navigate("/zones/index");
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

export default ZoneForm;
