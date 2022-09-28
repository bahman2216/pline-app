import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { getRequest, patchRequest, postRequest } from "../services/PlineTools";
import { DatePicker } from "react-advance-jalaali-datepicker";
import "./Azans.css";

const AzanTimes = ["اذان صبح", "اذان ظهر", "اذان مغرب"];

const AzanForm = () => {
  const [state, setState] = useState({
    id: null,
    date: "",

    time1: "00:00:00",
    zones1: [0],
    sound1: 0,
    befor_sound1: -1,
    after_sound1: 0,
    volume1: 0,
    enable1: false,

    time2: "00:00:00",
    zones2: [0],
    sound2: 0,
    befor_sound2: -1,
    after_sound2: 0,
    volume2: 0,
    enable2: false,

    time3: "00:00:00",
    zones3: [0],
    sound3: 0,
    befor_sound3: -1,
    after_sound3: 0,
    volume3: 0,
    enable3: false,

    desc: "",
  });
  const [options, setOptions] = useState({
    sounds: [],
    zones: [],
  });
  const navigate = useNavigate();
  const params = useParams();

  const load = () => {
    getRequest("/manual-plays/all-zones-and-sounds")
      .then((result) => {
        let options_sounds = [
          { value: -1, label: "بدون صدا" },
          { value: 0, label: "اتوماتیک" },
        ];
        result.data.sounds.forEach((data) => {
          options_sounds.push({ value: data.id, label: data.name });
        });

        let options_zones = [{ value: 0, label: "همه ناحیه ها" }];
        result.data.zones.forEach((data) => {
          options_zones.push({ value: data.id, label: data.name });
        });

        let tmp = { ...options };
        tmp.sounds = options_sounds;
        tmp.zones = options_zones;
        setOptions(tmp);
      })
      .then(() => {
        getRequest("/prayers/cur-date")
          .then((result) => {
            let tmp = { ...state };
            tmp.date = result.data.date;
            setState(tmp);
          })
          .catch((error) => {
            if (error.response.status === 422) {
              error.response.data.forEach((value) => {
                toast.error(value.message);
              });
            }
          });
      })
      .catch((error) => {
        if (error.response.status === 422) {
          error.response.data.forEach((value) => {
            toast.error(value.message);
          });
        }
      })
      .finally(() => {
        const id = params.id;
        if (id !== undefined) {
          getRequest(`/prayers/${id}`)
            .then((result) => {
              result.data.zones1 = JSON.parse(result.data.zones1);
              result.data.zones2 = JSON.parse(result.data.zones2);
              result.data.zones3 = JSON.parse(result.data.zones3);
              setState(result.data);
            })
            .catch(() => {
              toast.error("دریافت اطلاعات با خطا مواجح شد.");
            });
        }
      });
  };

  const saveData = (e) => {
    e.preventDefault();
    let req = null;
    if (params.id === undefined) {
      req = postRequest("/prayers", state);
    } else {
      req = patchRequest("/prayers/" + params.id, state);
    }

    req
      .then((data) => {
        if (data.length > 0) {
          data.forEach((value) => {
            toast.error(value.message);
          });
        }
        toast.success("اطلاعات با موفقیت ثبت شد");
        navigate("/azans/index");
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
      <h3>اذان</h3>
      <hr />
      <Form onSubmit={saveData}>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="date">
              <Form.Label>{"تاریخ"}</Form.Label>
              <DatePicker
                className="form-control"
                placeholder="انتخاب تاریخ"
                format="jYYYY/jMM/jDD"
                inputTextAlign="center"
                onChange={(unix, formatted) => {
                  let tmp = { ...state };
                  tmp.date = formatted;
                  setState(tmp);
                }}
                preSelected={state.date}
                controllValue
              />
            </Form.Group>
          </Col>
        </Row>

        {AzanTimes.map((v, i) => {
          i++;
          return (
            <Row key={i}>
              <div className="separator">{` ${v} `}</div>
              <Row>
                <Col md={2}>
                  <Form.Group className="mb-3" controlId={"enable" + i}>
                    <Form.Check
                      label={v}
                      checked={state[`enable${i}`]}
                      onChange={(e) => {
                        let tmp = { ...state };
                        tmp[`enable${i}`] = e.target.checked ? 1 : 0;
                        setState(tmp);
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="time"
                      step="1"
                      className="timeDateClass"
                      value={state[`time${i}`]}
                      onChange={(e) => {
                        let tmp = { ...state };
                        tmp[`time${i}`] = e.target.value;
                        setState(tmp);
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="sounds">
                  <Form.Label>{"صدای قبل اذان"}</Form.Label>
                  <select
                    value={state[`befor_sound${i}`]}
                    className={"form-select"}
                    onChange={(e) => {
                      let tmp = { ...state };
                      tmp[`befor_sound${i}`] = e.target.value;
                      setState(tmp);
                    }}
                    multiple={false}
                  >
                    {options.sounds.map((v, i) => {
                      return (
                        <option key={"op" + i} value={v.value}>
                          {` ${v.label}`}
                        </option>
                      );
                    })}
                  </select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="sounds">
                  <Form.Label>{"صدای اذان"}</Form.Label>
                  <select
                    value={state[`sound${i}`]}
                    className={"form-select"}
                    onChange={(e) => {
                      let tmp = { ...state };
                      tmp[`sound${i}`] = e.target.value;
                      setState(tmp);
                    }}
                    multiple={false}
                  >
                    {options.sounds.map((v, i) => {
                      return (
                        <option key={"op" + i} value={v.value}>
                          {v.label}
                        </option>
                      );
                    })}
                  </select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="sounds">
                  <Form.Label>{"صدای بعد اذان"}</Form.Label>
                  <select
                    value={state[`after_sound${i}`]}
                    className={"form-select"}
                    onChange={(e) => {
                      let tmp = { ...state };
                      tmp[`after_sound${i}`] = e.target.value;
                      setState(tmp);
                    }}
                    multiple={false}
                  >
                    {options.sounds.map((v, i) => {
                      return (
                        <option key={"op" + i} value={v.value}>
                          {v.label}
                        </option>
                      );
                    })}
                  </select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="zone">
                  <Form.Label>{"ناحیه ها"}</Form.Label>
                  <select
                    value={state[`zones${i}`]}
                    className={"form-select"}
                    onChange={(e) => {
                      let tmp = { ...state };
                      tmp[`zones${i}`] = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setState(tmp);
                    }}
                    multiple
                  >
                    {options.zones.map((v, i) => {
                      return (
                        <option key={"op" + i} value={v.value}>
                          {v.label}
                        </option>
                      );
                    })}
                  </select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="volume">
                  <Form.Label>حجم صدا</Form.Label>
                  <div dir="ltr">
                    <Form.Range
                      min={-15}
                      max={15}
                      title={state[`volume${i}`]}
                      defaultValue={state[`volume${i}`]}
                      onChange={(e) => {
                        let tmp = { ...state };
                        tmp[`volume${i}`] = e.target.value;
                        setState(tmp);
                      }}
                    />
                    <div style={{ textAlign: "center" }}>
                      <Form.Label>({state[`volume${i}`]})</Form.Label>
                    </div>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          );
        })}
        <hr />
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
                navigate("/azans/index");
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

export default AzanForm;
