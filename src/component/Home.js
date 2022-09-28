import React, { useState } from "react";
import { useEffect } from "react";
import { Alert, Col, Row, Table, TabPane } from "react-bootstrap";
import { getRequest } from "./services/PlineTools";

const Home = () => {
  const [state, setState] = useState([]);
  const [timeDate, setTimeDate] = useState({
    date: "",
    time: "",
  });



  const update = () => {
    getRequest("/pagers/pager-status").then(result => {
      setState(result.data);
    }).catch(err => {
      setState([]);
    });
  }

  const getDateTime = () => {
    getRequest("/manual-plays/get-cur-date-time").then(result => {
      setTimeDate(result.data);
    }).catch(err => {
      setTimeDate({
        date: "خطا در ارتباط با سرور",
        time: "",
      });
    });;
  }

  useEffect(() => {
    const updateInterval = setInterval(update, 10 * 1000);
    update();
    const timedateInterval = setInterval(getDateTime, 1000);
    return function cleanup() {
      clearInterval(updateInterval);
      clearInterval(timedateInterval);
    }
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Alert key={0} variant={"primary"}>
            <h5>سامانه پیجینگ پیشگام ارتباط</h5>
          </Alert>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Alert key={0} variant={"success"}>
            <h5>امروز: {<span style={{ "direction": "ltr" }}>{timeDate.time}</span>} - {<span style={{ "direction": "ltr" }}>{timeDate.date}</span>}</h5>
          </Alert>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>{"ردیف"}</th>
                <th>{"وضعیت"}</th>
                <th>{"آدرس پیجر"}</th>
                <th>{"نوع پیجر"}</th>
                <th>{"شناسه پیجر"}</th>
              </tr>
            </thead>
            <tbody>
              {state.map((v, i) => {
                return (<tr key={"tr" + i}>
                  <td>{i + 1}</td>
                  <td>{v.status ? <img src={require('../images/status_green.png')} /> : <img src={require('../images/status_grey.png')} />}</td>
                  <td>{v.ip}</td>
                  <td>{v.type === 1 ? "SIP" : "ALSA"}</td>
                  <td>{v.username}</td>
                </tr>);
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
