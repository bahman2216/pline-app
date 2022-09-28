import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getRequest, patchRequest, postRequest } from "../services/PlineTools";
import { DatePicker } from "react-advance-jalaali-datepicker";

const TimeDateClass = {
  width: "150px",
  direction: "ltr",
  textAlign: "center !important",
};

const Week = [
  "شنبه",
  "یک شنبه",
  "دو شنبه",
  "سه شنبه",
  "چهار شنبه",
  "پنج شنبه",
  "جمعه",
];

const ScheduleForm = () => {
  const [state, setState] = useState({
    id: null,
    name: "",
    zones: [],
    sounds: [],
    schedules: {
      volume: 0,
      type: "date",
      date: {
        date: "",
        time: "",
      },
      week: {
        w0: {
          enable: false,
          time: "10:00",
        },
        w1: {
          enable: false,
          time: "10:00",
        },
        w2: {
          enable: false,
          time: "10:00",
        },
        w3: {
          enable: false,
          time: "10:00",
        },
        w4: {
          enable: false,
          time: "10:00",
        },
        w5: {
          enable: false,
          time: "10:00",
        },
        w6: {
          enable: false,
          time: "10:00",
        },
      },
    },
    enable: true,
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
        let options_sounds = [];
        result.data.sounds.forEach((data) => {
          options_sounds.push({ value: data.id, label: data.name });
        });

        let options_zones = [];
        result.data.zones.forEach((data) => {
          options_zones.push({ value: data.id, label: data.name });
        });

        let tmp = { ...options };
        tmp.sounds = options_sounds;
        tmp.zones = options_zones;
        setOptions(tmp);
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
          getRequest(`/schedules/${id}`)
            .then((result) => {
              let tmp = result.data;
              tmp.schedules = JSON.parse(tmp.schedules);
              tmp.zones = JSON.parse(tmp.zones);
              tmp.sounds = JSON.parse(tmp.sounds);
              setState(tmp);
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
      req = postRequest("/schedules", state);
    } else {
      req = patchRequest("/schedules/" + params.id, state);
    }

    req
      .then((data) => {
        if (data.length > 0) {
          data.forEach((value) => {
            toast.error(value.message);
          });
        }
        toast.success("اطلاعات با موفقیت ثبت شد");
        navigate("/schedules/index");
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
      <h3>زمانبندی پخش</h3>
      <hr />
      <Form onSubmit={saveData}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="enable">
              <Form.Check
                label={"فعال/غیرفعال"}
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
            <Form.Group className="mb-3">
              <Form.Label>نام</Form.Label>
              <Form.Control
                type="text"
                defaultValue={state?.name}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.name = e.target.value;
                  setState(tmp);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="zone">
              <Form.Label>{"ناحیه ها"}</Form.Label>
              <select
                value={state.zones}
                className={"form-select"}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.zones = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setState(tmp);
                }}
                multiple
              >
                <option value={0}>همه ناحیه ها</option>
                {options.zones.map((v, i) => {
                  return (
                    <option key={"op" + i} value={v.value}>
                      {v.label}
                    </option>
                  );
                })}
              </select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="sounds">
              <Form.Label>{"صدا ها"}</Form.Label>
              <select
                value={state.sounds}
                className={"form-select"}
                onChange={(e) => {
                  let tmp = { ...state };
                  tmp.sounds = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  setState(tmp);
                }}
                multiple
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
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="volume">
              <Form.Label>حجم صدا</Form.Label>
              <div dir="ltr">
                <Form.Range
                  min={-15}
                  max={15}
                  title={state.schedules.volume}
                  defaultValue={state.schedules.volume}
                  onChange={(e) => {
                    let tmp = { ...state };
                    tmp.schedules.volume = e.target.value;
                    setState(tmp);
                  }}
                />
                <div style={{ textAlign: "center" }}>
                  <Form.Label>({state.schedules.volume})</Form.Label>
                </div>
              </div>
            </Form.Group>
          </Col>
        </Row>
        <hr />
        {/* Start Tab */}
        <Row>
          <Col md={12}>
            <Tabs
              variant="pills"
              defaultActiveKey="date"
              id="tab"
              className="mb-3"
              onSelect={(e) => {
                let tmp = { ...state };
                tmp.schedules.type = e;
                setState(tmp);
              }}
              activeKey={state.schedules.type}
            >
              <Tab eventKey="date" title="تاریخ">
                <Row>
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId="date">
                      <Form.Label>{"تاریخ"}</Form.Label>
                      <DatePicker
                        inputComponent={(props) => {
                          return (
                            <Form.Control
                              type="text"
                              style={TimeDateClass}
                              maxLength={5}
                              {...props}
                            />
                          );
                        }}
                        placeholder="انتخاب تاریخ"
                        format="jYYYY/jMM/jDD"
                        inputTextAlign="center"
                        onChange={(unix, formatted) => {
                          let tmp = { ...state };
                          console.log(formatted);
                          tmp.schedules.date.date = formatted;
                          setState(tmp);
                        }}
                        preSelected={state.schedules.date.date}
                        controllValue
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3" controlId="time">
                      <Form.Label>{"ساعت"}</Form.Label>
                      <Form.Control
                        type="time"
                        style={TimeDateClass}
                        maxLength={5}
                        required={false}
                        onChange={(e) => {
                          let tmp = { ...state };
                          tmp.schedules.date.time = e.target.value;
                          setState(tmp);
                        }}
                        defaultValue={state.schedules.date.time}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey="week" title="روز هفته">
                {Week.map((val, index) => {
                  return (
                    <Row key={"R" + index}>
                      <Col md={3}>
                        <Form.Group className="mb-3" controlId={"week" + index}>
                          <Form.Check
                            label={val}
                            checked={state.schedules.week["w" + index].enable}
                            onChange={(e) => {
                              let tmp = { ...state };
                              tmp.schedules.week["w" + index].enable =
                                e.target.checked;
                              setState(tmp);
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3" controlId="time">
                          <Form.Control
                            type="time"
                            style={TimeDateClass}
                            maxLength={5}
                            required={false}
                            value={
                              state.schedules.week["w" + index].time
                            }
                            onChange={(e) => {
                              let tmp = { ...state };
                              tmp.schedules.week["w" + index].time =
                                e.target.value;

                              setState(tmp);
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  );
                })}
              </Tab>
            </Tabs>
          </Col>
        </Row>
        {/* End Tab */}
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
        <hr />
        <Row>
          <Col md={12}>
            <Button variant="primary" type="submit">
              ذخیره
            </Button>{" "}
            <Button
              variant="danger"
              onClick={() => {
                navigate("/schedules/index");
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

export default ScheduleForm;
