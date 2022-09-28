import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import YiiGridView from "../grid-view/YiiGridView";
import { deleteRequest, getRequest } from "../services/PlineTools";

const Azans = (props) => {
  const [state, setState] = useState({ items: [] });
  const [sortParams, setSortParams] = useState({ sort: "" });
  const [searchParams] = useState({});
  const navigate = useNavigate();

  const columns = [
    {
      label: "ردیف",
      id: "#",
      search: false,
    },
    {
      label: "تاریخ",
      id: "date",
      search: true,
      sort: true,
    },
    {
      label: "وضعیت اذان صبح",
      id: "enable1",
      search: true,
      sort: true,
      filter: [
        { value: "1", label: "فعال" },
        { value: "0", label: "غیر فعال" },
      ],
      value: (v) => {
        return v ? "فعال" : "غیرفعال";
      },
    },
    {
      label: "اذان صبح",
      id: "time1",
      search: true,
      sort: true,
    },
    {
      label: "وضعیت اذان ظهر",
      id: "enable2",
      search: true,
      sort: true,
      filter: [
        { value: "1", label: "فعال" },
        { value: "0", label: "غیر فعال" },
      ],
      value: (v) => {
        return v ? "فعال" : "غیرفعال";
      },
    },
    {
      label: "اذان ظهر",
      id: "time2",
      search: true,
      sort: true,
    },
    {
      label: "وضعیت اذان مغرب",
      id: "enable3",
      search: true,
      sort: true,
      filter: [
        { value: "1", label: "فعال" },
        { value: "0", label: "غیر فعال" },
      ],
      value: (v) => {
        return v ? "فعال" : "غیرفعال";
      },
    },
    {
      label: "اذان مغرب",
      id: "time3",
      search: true,
      sort: true,
    },
    {
      label: "ویرایش",
      id: "id",
      value: (value) => {
        return (
          <p
            className="edit"
            onClick={() => {
              Edit(value);
            }}
          >
            <PencilSquare />
          </p>
        );
      },
    },
    {
      label: "حذف",
      id: "id",
      value: (value) => {
        return (
          <p
            className="delete"
            variant="danger"
            onClick={() => {
              Delete(value);
            }}
          >
            <Trash />
          </p>
        );
      },
    },
  ];

  const getData = (href = "") => {
    if (href === "") {
      href = "/prayers?";
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

  const Delete = (id) => {
    if (window.confirm("برای حذف این اذان مطمئن هستید؟")) {
      deleteRequest("/prayers/" + id)
        .then((result) => {
          toast.success("اذان مورد نظر حذف شد.");
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

  const Edit = (id) => {
    navigate("/azans/edit/" + id);
  };

  useEffect(() => {
    getData();
  }, []);

  const search = (f, v) => {
    searchParams["TblAzansSearch[" + f + "]"] = v;
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
          <Button as={Link} to="/azans/create">
            ایجاد اذان
          </Button>
          {"    "}
          <Button as={Link} to="/azans/upload-csv">
            ایجاد اذان از فایل csv
          </Button>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <h4>لیست اذان ها</h4>
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

export default Azans;
