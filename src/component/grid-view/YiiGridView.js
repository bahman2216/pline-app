import React, { useState } from "react";
import { Col, Row, Table, Pagination } from "react-bootstrap";
import { SortAlphaDown, SortAlphaDownAlt } from "react-bootstrap-icons";
import "./GridView.css";

//"totalCount": 2088,
//"pageCount": 105,
//"currentPage": 1,
//"perPage": 20
//نمایش ۳۱ تا ۴۰ مورد از کل ۶۵۲ مورد.

const YiiGridView = (props) => {
  const [state] = useState({ sort: "-" });

  return (
    <div style={{ marginBottom: "3vw" }} className="border">
      <Row>
        <Col>
          <p>
            <span>ردیف</span>{" "}
            {(props.Pagination.currentPage - 1) * props.Pagination.perPage + 1}{" "}
            <span>از</span>{" "}
            {props.Pagination.currentPage * props.Pagination.perPage}
            {" ["}
            <span>تعداد کل رکورد ها</span> {props.Pagination.totalCount}
            {"]"}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table responsive="md" striped bordered hover>
            <thead>
              <tr>
                {props.Columns.map((v, i) => {
                  return (
                    <th className="table-dark" key={i}>
                      {v.sort === true ? (
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            if (v.sort) {
                              if (state.sort.startsWith("-")) {
                                state.sort = v.id;
                              } else {
                                state.sort = "-" + v.id;
                              }
                              props?.SortEvent(state.sort);
                            }
                          }}
                        >
                          {state.sort.indexOf(v.id) >= 0 ? (
                            <>
                              {state.sort.startsWith("-") ? (
                                <SortAlphaDownAlt />
                              ) : (
                                <SortAlphaDown />
                              )}
                            </>
                          ) : (
                            ""
                          )}{" "}
                          {v.label}
                        </span>
                      ) : (
                        v.label
                      )}
                    </th>
                  );
                })}
              </tr>
              <tr>
                {props.Columns.map((v, i) => {
                  return (
                    <td key={i}>
                      {v.search &&
                        (v.filter === undefined ? (
                          <input
                            type="text"
                            className="form-control"
                            onChange={(e) => {
                              props?.SearchEvent(v.id, e.target.value);
                            }}
                          />
                        ) : (
                          <select
                            className="form-select"
                            onChange={(e) => {
                              props?.SearchEvent(v.id, e.target.value);
                            }}
                          >
                            <option></option>
                            {v.filter.map((opt, oi) => {
                              return (
                                <option key={"op" + oi} value={opt.value}>
                                  {opt.label}
                                </option>
                              );
                            })}
                          </select>
                        ))}
                    </td>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {props.Data.map((row, iR) => {
                return (
                  <tr key={iR}>
                    {props.Columns.map((col, iC) => {
                      return (
                        <td key={iC}>
                          {col.value === undefined
                            ? col.id === "#"
                              ? iR +
                              (props.Pagination.currentPage - 1) *
                              props.Pagination.perPage +
                              1
                              : row[col.id]
                            : col.value(row[col.id])}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <Pagination>
            <Pagination.Item
              disabled={props.Events.first === undefined}
              onClick={props.Events.first}
            >
              {"صفحه اول"}
            </Pagination.Item>
            <Pagination.Item
              disabled={props.Events.pre === undefined}
              onClick={props.Events.pre}
            >
              {"صفحه قبل"}
            </Pagination.Item>
            <Pagination.Item
              disabled={props.Events.self === undefined}
              active
              onClick={props.Events.self}
            >
              {"صفحه "}
              {props.Pagination.currentPage}
            </Pagination.Item>
            <Pagination.Item
              disabled={props.Events.next === undefined}
              onClick={props.Events.next}
            >
              {"صفحه بعد"}
            </Pagination.Item>
            <Pagination.Item
              disabled={props.Events.last === undefined}
              onClick={props.Events.last}
            >
              {"صفحه آخر"}
            </Pagination.Item>
          </Pagination>
        </Col>
      </Row>
    </div>
  );
};

export default YiiGridView;
