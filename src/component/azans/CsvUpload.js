import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Col,
  Container,
  Form,
  Row,
  Button,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { getRequest, postRequest, uploadFile } from "../services/PlineTools";
import { Table } from "react-bootstrap";

const CsvUpload = () => {
  const [state, setState] = useState({
    old_delete: false,
    data: [],
  });
  const [upload, setUpload] = useState({
    upload: 0,
    max: 0,
    max_byte: 0,
    disable: false,
  });
  const navigate = useNavigate();

  const load = () => {
    getRequest("/sounds/max-upload-size").then((max) => {
      setUpload({
        upload: 0,
        max: max.data.max,
        max_byte: max.data.max_byte,
      });
    });
  };

  const saveData = (e) => {
    postRequest("/prayers/save-csv", state)
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
      <h3>بارگذاری فایل اذان</h3>
      <hr />
      <Alert variant={"info"}>
        <ul>
          <li>فایل انتخاب شده باید از نوع CSV باشد</li>
          <li>
            ردیف اول فایل به عنوان نام ستون در نظر گرفته شده و خوانده نمی شود
          </li>
        </ul>
      </Alert>
      <hr />
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="file">
            <Form.Label>{"فایل CSV"}</Form.Label>
            <Form.Control
              type="file"
              required={true}
              onChange={(e) => {
                if (e.target.files[0].size > upload.max_byte) {
                  toast.warning(
                    `حجم فایل انتخابی باید کمتر از ${upload.max} باشد`,
                    { style: { color: "black", direction: "rtl" } }
                  );
                  e.target.value = "";
                  return;
                }
                let up_tmp = { ...upload };
                up_tmp.upload = 0;
                setUpload(up_tmp);
                uploadFile(
                  "/prayers/upload",
                  "file",
                  e.target.files[0],
                  (p) => {
                    let prog = (p / e.target.files[0].size) * 100;
                    prog = Math.round(prog);
                    if (prog > 100) prog = 100;
                    let tmp = { ...upload };
                    tmp.upload = prog;
                    tmp.disable = true;
                    setUpload(tmp);
                  }
                )
                  .then((result) => {
                    let tmp = { ...state };
                    tmp.data = result.data.result;
                    setState(tmp);
                    toast.success(`فایل آپلود شد`);
                    let up_tmp = { ...upload };
                    up_tmp.disable = false;
                    up_tmp.upload = 100;
                    setUpload(up_tmp);
                  })
                  .catch((error) => {
                    if (error.response.status === 422) {
                      error.response.data.forEach((value) => {
                        toast.info(value.message);
                      });
                    }
                    e.target.value = "";
                  });
              }}
              defaultValue={state.name}
            />
          </Form.Group>
          <div dir="ltr">
            <ProgressBar label={`${upload.upload}%`} now={upload.upload} />
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={12}>
          <Form.Group className="mb-3" controlId="delete">
            <Form.Check
              label={"آیا مایل به حذف کلیه اذان های گذشته هستید؟"}
              defaultChecked={state.old_delete}
              onChange={(e) => {
                let tmp = { ...state };
                tmp.old_delete = e.target.checked;
                setState(tmp);
              }}
            />
          </Form.Group>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col md={12}>
          <Button
            disabled={upload.disable}
            variant="primary"
            type="button"
            onClick={saveData}
          >
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

      {state.data.length > 0 && (
        <Row className="mt-3">
          <Col md={12}>
            <Table responsive="md" striped bordered hover>
              <thead>
                <tr>
                  <th>تاریخ</th>
                  <th>
                    <input
                      type={"checkbox"}
                      defaultChecked={true}
                      onChange={(e) => {
                        let tmp = { ...state };
                        for (let i = 0; i < tmp.data.length; i++) {
                          tmp.data[i].enable1 = e.target.checked;
                        }
                        setState(tmp);
                      }}
                    />{" "}
                    وضعیت اذان صبح
                  </th>
                  <th>اذان صبح</th>
                  <th>
                    <input
                      type={"checkbox"}
                      defaultChecked={true}
                      onChange={(e) => {
                        let tmp = { ...state };
                        for (let i = 0; i < tmp.data.length; i++) {
                          tmp.data[i].enable2 = e.target.checked;
                        }
                        setState(tmp);
                      }}
                    />{" "}
                    وضعیت اذان ظهر
                  </th>
                  <th>اذان ظهر</th>
                  <th>
                    <input
                      type={"checkbox"}
                      defaultChecked={true}
                      onChange={(e) => {
                        let tmp = { ...state };
                        for (let i = 0; i < tmp.data.length; i++) {
                          tmp.data[i].enable3 = e.target.checked;
                        }
                        setState(tmp);
                      }}
                    />{" "}
                    وضعیت اذان مغرب
                  </th>
                  <th>اذان مغرب</th>
                </tr>
              </thead>
              <tbody>
                {state.data.map((r, ri) => {
                  return (
                    <tr key={"r" + ri}>
                      <td>{r.date}</td>
                      <td>
                        <input
                          type={"checkbox"}
                          checked={r.enable1}
                          onChange={(e) => {
                            let tmp = { ...state };
                            tmp.data[ri].enable1 = e.target.checked;
                            setState(tmp);
                          }}
                        />
                      </td>
                      <td>{r.time1}</td>
                      <td>
                        <input
                          type={"checkbox"}
                          checked={r.enable2}
                          onChange={(e) => {
                            let tmp = { ...state };
                            tmp.data[ri].enable2 = e.target.checked;
                            setState(tmp);
                          }}
                        />
                      </td>
                      <td>{r.time2}</td>
                      <td>
                        <input
                          type={"checkbox"}
                          checked={r.enable3}
                          onChange={(e) => {
                            let tmp = { ...state };
                            tmp.data[ri].enable3 = e.target.checked;
                            setState(tmp);
                          }}
                        />
                      </td>
                      <td>{r.time3}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CsvUpload;
