import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Col,
  Container,
  Form,
  Row,
  Button,
  ProgressBar,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  getRequest,
  patchRequest,
  postRequest,
  uploadFile,
} from "../services/PlineTools";

const SoundForm = () => {
  const [state, setState] = useState({
    name: "",
    file: "",
    desc: "",
    id: null,
  });
  const [upload, setUpload] = useState({
    upload: 0,
    max: 0,
    max_byte: 0,
    disable: false,
  });
  const navigate = useNavigate();
  const params = useParams();

  const load = () => {
    getRequest("/sounds/max-upload-size").then((max) => {
      setUpload({
        upload: 0,
        max: max.data.max,
        max_byte: max.data.max_byte,
      });
      let id = params.id;
      if (id !== undefined) {
        const url = "/sounds/" + id;
        getRequest(url)
          .then((result) => {
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
      req = postRequest("/sounds", state);
    } else {
      req = patchRequest("/sounds/" + params.id, state);
    }

    req
      .then((data) => {
        if (data.length > 0) {
          data.forEach((value) => {
            toast.error(value.message);
          });
        }
        toast.success("اطلاعات با موفقیت ثبت شد");
        navigate("/sounds/index");
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
      <h3>صدا</h3>
      <hr />
      <Form onSubmit={saveData}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="file">
              <Form.Label>{"فایل صدا"}</Form.Label>
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
                    "/sounds/upload",
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
                      tmp.file = result.data.file_name;
                      tmp.name = e.target.files[0].name;
                      tmp.desc =
                        "شرح پیش فرض\n" +
                        ".:: " +
                        e.target.files[0].name +
                        " ::.";
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
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>{"نام صدا"}</Form.Label>
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
            <Button disabled={upload.disable} variant="primary" type="submit">
              ذخیره
            </Button>{" "}
            <Button
              variant="danger"
              onClick={() => {
                navigate("/sounds/index");
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

export default SoundForm;
