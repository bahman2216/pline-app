import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { getRequest, postRequest } from "../services/PlineTools";

const SoundTestForm = () => {
  const [state, setState] = useState({
    data: [],
    selected: 0,
    volume: 0,
  });
  const navigate = useNavigate();
  const param = useParams();

  const load = () => {
    getRequest("/pagers/all")
      .then((result) => {
        let options = [];
        result.data.forEach((data) => {
          options.push({ value: data.id, label: data.username });
        });
        setState({ data: options, selected: 0, volume: 0 });
      })
      .catch((error) => {
        if (error.response.status === 422) {
          error.response.data.forEach((value) => {
            toast.error(value.message);
          });
        }
      });
  };

  const play = () => {
    if (state.selected === undefined || state.selected === 0) {
      toast.error("پیجری برای پخش انتخاب نشده است. لطفا یک پیجر انتخاب کنید");
      return;
    }

    postRequest("/sounds/test", {
      sound: param.id,
      pager: state.selected,
      volume: state.volume,
    })
      .then((result) => {
        toast.success("شروع پخش صدا");
      })
      .catch((error) => {
        if (error.response.status === 422) {
          error.response.data.forEach((value) => {
            toast.error(value.message);
          });
        }
      });
  };

  const hangup = () => {
    if (state.selected === undefined || state.selected === 0) {
      toast.error("پیجری برای پخش انتخاب نشده است. لطفا یک پیجر انتخاب کنید");
      return;
    }

    postRequest("/sounds/hangup", { pager: state.selected })
      .then((result) => {
        toast.success(result.data.message);
      })
      .catch((error) => {
        if (error.response.status === 422) {
          error.response.data.forEach((value) => {
            toast.error(value.message);
          });
        }
      });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Container>
      <h3>تست صدا</h3>
      <hr />
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="zone">
            <Form.Label>{"پیجر"}</Form.Label>
            <Select
              options={state.data}
              isMulti={false}
              onChange={(e) => {
                let tmp = { ...state };
                tmp.selected = e.value;
                setState(tmp);
              }}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="volume">
            <Form.Label>حجم صدا</Form.Label>
            <div dir="ltr">
              <Form.Range
                min={-15}
                max={15}
                title={state.volume}
                defaultValue={state.volume}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.volume = e.target.value;
                  setState(tmp);
                }}
              />
              <div style={{ textAlign: "center" }}>
                <Form.Label>({state.volume})</Form.Label>
              </div>
            </div>
          </Form.Group>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col md={12}>
          <Button onClick={play} variant="primary">
            شروع تست
          </Button>{" "}
          <Button onClick={hangup} variant="warning">
            قطع صدا
          </Button>{" "}
          <Button
            variant="danger"
            onClick={() => {
              navigate("/sounds/test");
            }}
          >
            انصراف
          </Button>{" "}
        </Col>
      </Row>
    </Container>
  );
};

export default SoundTestForm;
