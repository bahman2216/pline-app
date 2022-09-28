import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { backend_url, deleteRequest, getRequest } from "../services/PlineTools";

const Folders = [
  'before-azans',
  'azans',
  'after-azans'
];

const OtherSounds = (props) => {
  const [state, setState] = useState([]);
  const params = useParams();

  const getData = (href = "") => {
    getRequest("/sounds/get-sounds?id=" + params.id).then(result => {
      setState(result.data);
    });
  };

  const Delete = (id) => {
    if (window.confirm("برای حذف این صدا مطمئن هستید؟")) {
      deleteRequest("/sounds?id=" + id)
        .then((result) => {
          toast.success("صدای مورد نظر حذف شد");
          getData();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            error.response.data.forEach((value) => {
              toast.error(value.message);
            });
          }
        });
    }
  };

  useEffect(() => {
    getData();
  }, [params]);

  return (
    <>
      <Row>
        <Col>
          {/* <Button as={Link} to="/sounds/create">
            ایجاد صدا
          </Button> */}
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <h4>لیست صدا ها</h4>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>{"ردیف"}</th>
                <th>{"نام فایل صوتی"}</th>
                <th>{"پخش صدا"}</th>
                {/* <th>{"حذف"}</th> */}
              </tr>
            </thead>
            <tbody>
              {state.map((v, i) => {
                return (<tr key={"tr" + i}>
                  <td>{i + 1}</td>
                  <td>{v}</td>
                  <td> <audio
                    src={`${backend_url()}/${Folders[params.id]}/${v}`}
                    controls
                    autoPlay={false}
                  /></td>
                  {/* <td>{v}</td> */}
                </tr>);
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};

export default OtherSounds;
