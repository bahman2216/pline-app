import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Broadcast } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import YiiGridView from "../grid-view/YiiGridView";
import { backend_url, getRequest } from "../services/PlineTools";

const SoundTest = (props) => {
  const [state, setState] = useState({ items: [] });
  const [sortParams, setSortParams] = useState({ sort: "" });
  const [searchParams] = useState({});

  const columns = [
    {
      label: "ردیف",
      id: "#",
      search: false,
    },
    {
      label: "نام فایل صوتی",
      id: "name",
      search: true,
      sort: true,
    },
    {
      label: "شرح",
      id: "desc",
      search: true,
      sort: true,
    },
    {
      label: "پخش فایل صوتی",
      id: "file",
      value: (value) => {
        return (
          <div>
            <audio
              src={`${backend_url()}/uploads/${value}`}
              controls
              autoPlay={false}
            />
          </div>
        );
      },
    },
    {
      label: "تست",
      id: "id",
      value: (value) => {
        return (
          <Button variant="primary" as={Link} to={`/sounds/from-test/${value}`}>
            <Broadcast />
          </Button>
        );
      },
    },
  ];

  const getData = (href = "") => {
    if (href === "") {
      href = "/sounds?";
    }
    let searchUrl = "&" + new URLSearchParams(searchParams).toString();
    if (searchUrl === "&") searchUrl = "";

    if (sortParams.sort.trim() !== "") searchUrl += `&sort=${sortParams.sort}`;

    getRequest(`${href}${searchUrl}`)
      .then((data) => {
        data = data.data;
        setState(data);
      })
      .catch((error) => {
        toast.error(
          "هنگام اجرای درخواست شما خطایی روی داد است. لطفا با مدیر سیستم تماس بگیرید\n" +
            error
        );
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const search = (f, v) => {
    searchParams["TblSoundsSearch[" + f + "]"] = v;
    getData();
  };

  const sort = (f) => {
    setSortParams({ sort: f });
    getData();
  };

  return (
    <>
      <Row>
        <Col>
          <Button as={Link} to="/sounds/create">
            ایجاد صدا
          </Button>
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
          <YiiGridView
            Columns={columns}
            Data={state.items}
            Events={{
              first: () => {
                if (state._links.first?.href === undefined) return;
                getData(state._links.first?.href);
              },
              pre: () => {
                if (state._links.prev?.href === undefined) return;
                getData(state._links.prev?.href);
              },
              self: () => {
                if (state._links.self?.href === undefined) return;
                getData(state._links.self?.href);
              },
              next: () => {
                if (state._links.next?.href === undefined) return;
                getData(state._links.next?.href);
              },
              last: () => {
                if (state._links.last?.href === undefined) return;
                getData(state._links.last?.href);
              },
            }}
            Pagination={{
              totalCount: state._meta?.totalCount,
              pageCount: state._meta?.pageCount,
              currentPage: state._meta?.currentPage,
              perPage: state._meta?.perPage,
            }}
            SearchEvent={search}
            SortEvent={sort}
          />
        </Col>
      </Row>
    </>
  );
};

export default SoundTest;
