import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import { getRequest, postRequest } from "../services/PlineTools";

const ManualPlay = () => {
  const [state, setState] = useState({
    zones: [],
    sounds: [],
    select_sounds: [],
    select_zones: [],
    volume: 0,
    isRun: false,
  });
  const navigate = useNavigate();

  const load = () => {
    getRequest("/manual-plays/all-zones-and-sounds")
      .then((result) => {
        let options_sounds = [];
        result.data.sounds.forEach((data) => {
          options_sounds.push({ value: data.id, label: data.name });
        });

        let options_zones = [];
        result.data.zones.forEach((data) => {
          options_zones.push({ value: data.id, label: data.name });
        });

        let tmp = { ...state };
        tmp.sounds = options_sounds;
        tmp.zones = options_zones;
        setState(tmp);
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
    if (state.select_zones === undefined || state.select_zones.length === 0) {
      toast.error(
        "ناحیه ای برای پخش انتخاب نشده است. لطفا یک ناحیه انتخاب کنید"
      );
      return;
    }

    if (state.select_sounds === undefined || state.select_sounds.length === 0) {
      toast.error("صدای برای پخش انتخاب نشده است. لطفا یک صدا انتخاب کنید");
      return;
    }

    postRequest("/manual-plays/play", {
      sounds: state.select_sounds,
      zones: state.select_zones,
      volume: state.volume,
    })
      .then(() => {
        toast.success("درخواست پخش صدا صادر شد");
        let tmp = { ...state };
        tmp.isRun = true;
        setState(tmp);
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
            <Form.Label>{"ناحیه ها"}</Form.Label>
            <Select
              options={state.zones}
              isMulti={true}
              isSearchable
              onChange={(e) => {
                let tmp = { ...state };
                tmp.select_zones = [];
                e.forEach((v) => {
                  tmp.select_zones.push(v.value);
                });
                setState(tmp);
              }}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="sounds">
            <Form.Label>{"صدا ها"}</Form.Label>
            <Select
              options={state.sounds}
              isMulti={true}
              isSearchable
              onChange={(e) => {
                console.log(e);
                let tmp = { ...state };
                tmp.select_sounds = [];
                e.forEach((v) => {
                  tmp.select_sounds.push(v.value);
                });
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
            شروع پخش
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

export default ManualPlay;
