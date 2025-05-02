import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Unauthorized from "../Pages/Unauthorised";
import { Header } from "antd/es/layout/layout";
import { useNavigate, Link } from "react-router-dom";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { GetCurrentUser } from "../api/users";
import { SetUser } from "../redux/userSlice";
import { message, Layout, Menu } from "antd";
import { ShowLoading, HideLoading } from "../redux/loaderSlice";
import { isTokenValid } from "../Utils/auth";

function ProtectedRoute({ children ,allowedRoles=[]}) {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { Header, Content, Footer, Sider } = Layout;

  
    const getValidUser = async () => {
      try {
        dispatch(ShowLoading());
        const response = await GetCurrentUser();
        console.log("response", response);
        dispatch(HideLoading());
        dispatch(SetUser(response.data));
      } catch (err) {
        console.log(err);
        dispatch(SetUser(null));
        message.error(err.message);
      }
    };
    useEffect(() => {
      const checkToken = () => {
        const token = localStorage.getItem("token");
        if (!token || !isTokenValid()) {
          localStorage.removeItem("token");
          message.error("Session expired. Please log in again.");
          navigate("/login");
        } else {
          getValidUser(); // Fetch user details if token is valid
        }
      };
    
      checkToken();
    }, []);

    if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
      return <Unauthorized />;
    }
    
  const navItems = [
    {
      key: "home",
      label: "Home",
      icon: <HomeOutlined />,
      onClick:()=>{
        navigate("/");
      }
     
      
    },
    {
      key: "user",
      label: `${user ? user.name : ""}`,
      icon: <UserOutlined />,
      children: [
        {
          key: "profile",
          label: "My Profile",
          icon: <UserOutlined />,
          onClick:()=> {
              
              if (user && user.role === "admin") {
                navigate("/admin");
              } else if (user && user.role === "partner") {
                navigate("/partner");
              } else {
                navigate("/profile");
              }
            }
          
          
        },
        {
           key: "logout",
          label: "Logout",
          icon: <LogoutOutlined />,
          onClick: () => {
            localStorage.removeItem("token");
            navigate("/login");
          }
        },
      ],
    },
  ];

  return (
    user && (
      <>
        <Layout>
          <Header
            className="d-flex justify-content-between"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h3 className=" text-white m-0" style={{ color: "white" }}>
              Book My Show
            </h3>
            <Menu theme="dark" mode="horizontal" items={navItems} />
          </Header>
          <div style={{ padding: 24, minHeight: 380, background: "#fff" }}>
            {children}
          </div>
        </Layout>
      </>
    )
  );
}

export default ProtectedRoute;