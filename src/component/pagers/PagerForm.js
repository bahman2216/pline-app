import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { getRequest, patchRequest, postRequest } from "../services/PlineTools";

export const TypePager = [
  { value: 0, label: "ALSA" },
  { value: 1, label: "SIP" },
];

const PagerForm = () => {
  const [state, setState] = useState({
    username: "",
    password: "",
    type_pager: null,
    zone_id: 0,
    enable: true,
    desc: "",
    id: null,
    zone_list: [],
  });
  const navigate = useNavigate();
  const params = useParams();

  const load = () => {
    getRequest("/zones/all")
      .then((result) => {
        let z_list = [];
        result.data.forEach((v) => {
          z_list.push({ value: v.id, label: v.name });
        });

        let id = params.id;
        if (id !== undefined) {
          const url = "/pagers/" + id;
          getRequest(url)
            .then((result) => {
              result.data.zone_list = z_list;
              setState(result.data);
            })
            .catch(() => {
              toast.error("دریافت اطلاعات با خطا مواجح شد.");
            });
        } else {
          let tmp = { ...state };
          tmp.zone_list = z_list;
          setState(tmp);
        }
      })
      .catch(() => {
        toast.error("دریافت اطلاعات با خطا مواجح شد.");
      });
  };

  const saveData = (e) => {
    e.preventDefault();
    let req = null;
    if (params.id === undefined) {
      req = postRequest("/pagers", state);
    } else {
      req = patchRequest("/pagers/" + params.id, state);
    }

    req
      .then((data) => {
        if (data.length > 0) {
          data.forEach((value) => {
            toast.error(value.message);
          });
        }
        toast.success("اطلاعات با موفقیت ثبت شد");
        navigate("/pagers/index");
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
      <h3>پیجر</h3>
      <hr />
      <Form onSubmit={saveData}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="enable">
              <Form.Check
                label={"وضعیت"}
                checked={state.enable}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.enable = e.target.checked ? 1 : 0;
                  setState(tmp);
                }}
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
                required={false}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.password = e.target.value;
                  setState(tmp);
                }}
                defaultValue={state.password}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="pager_type">
              <Form.Label>{"نوع پیجر"}</Form.Label>
              <select
                className={"form-select"}
                value={state.type_pager}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.type_pager = e.target.value;
                  setState(tmp);
                }}
              >
                <option value={null}>انتخاب کنید...</option>
                {TypePager.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="zone_list">
              <Form.Label>{"ناحیه کاربری"}</Form.Label>
              <select
                className={"form-select"}
                value={state.zone_id}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.zone_id = e.target.value;
                  setState(tmp);
                }}
              >
                <option value={0}>انتخاب کنید...</option>
                {state.zone_list.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
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
                navigate("/pagers/index");
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

export default PagerForm;
