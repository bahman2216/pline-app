import React from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getCookies, postRequest } from "../services/PlineTools";
import "./Header.css";

const Header = (props) => {
  const navDropdownTitle = (
    <>
      <PersonCircle /> {props.UserName}
    </>
  );

  return (
    <header className="header">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/home">
            داشبورد
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="پیجرها" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/zones/index">
                  ناحیه ها
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/pagers/index">
                  پیجرها
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="مدیریت فایل های صوتی" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/sounds/index">
                  بارگذاری فایل صوتی
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/sounds/test">
                  تست فایل صوتی
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/sounds/get-sounds/0">
                  صداهای مناجات قبل از اذان
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/sounds/get-sounds/1">
                  صداهای اذان
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/sounds/get-sounds/2">
                  صداهای مناجات بعد از اذان
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title="زمان بندی پخش فایل های صوتی"
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/sounds/manual">
                  پخش دستی فایل صوتی
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/schedules/index">
                  زمان بندی پخش
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/azans/index">
                  اذان و مناجات
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="ابزارها" id="basic-nav-dropdown">
                <NavDropdown.Item
                  onClick={() => {
                    if (window.confirm("برای قطع کلیه صدا ها مطمئن هستید؟")) {
                      postRequest("/manual-plays/hangup-all", {}).then(() => {
                        toast.success("در خواست قطع تماس ارسال شد");
                      });
                    }
                  }}
                >
                  قطع تمامی صداهای درحال پخش
                </NavDropdown.Item>
              </NavDropdown>
              {getCookies("user_id") === "1" && (
                <NavDropdown title="مدیریت کاربران" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/users/index">
                    تعریف کاربر سیستم
                  </NavDropdown.Item>
                  {/* <NavDropdown.Item as={Link} to="/pagers/index">
                    تعیین سطوح دسترسی
                  </NavDropdown.Item> */}
                </NavDropdown>
              )}
            </Nav>

            <Nav className="pull-right">
              <NavDropdown title={navDropdownTitle} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/user/change-password">
                  تغییر کلمه عبور
                </NavDropdown.Item>
                {/* <NavDropdown.Divider /> */}
              </NavDropdown>
              <Nav.Link onClick={props.LogoutAction}>خروج</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
