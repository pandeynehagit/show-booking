import React, { useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../api/users";

import { useLocation } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();  // To access the current route

  // Handle login form submission
  const onFinish = async (values) => {
    try {
      const response = await LoginUser(values);  
      console.log("the login response is",response);
      //  Call the LoginUser function
      if (response?.success) {
        // success
        message.success(response.message);
        console.log(response.message);
        localStorage.setItem("token", response.data);
        navigate("/");  // Navigate to homepage after successful login
      } else {
        message.error(response.message);
        console.log(response.message);
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  useEffect(() => {
    // Only redirect if token exists and not on /login or /register
    if (localStorage.getItem('token') && location.pathname !== '/login' && location.pathname !== '/register') {
      navigate('/');  // Redirect to home if token is found
    }
  }, [location.pathname, navigate]);

  return (
    <>
      <main className="App-header">
        <h1>Login to BookMyShow</h1>
        <section className="mw-500 text-center px-3">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              htmlFor="email"
              name="email"
              className="d-block"
              rules={[
                { required: true, message: "Please enter your Email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input id="email" type="text" placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              label="Password"
              htmlFor="password"
              name="password"
              className="d-block"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input id="password" type="password" placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                block
                htmlType="submit"
                style={{ fontSize: "1rem", fontWeight: "600" }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          <div>
            <p>
              New user? <Link to="/register">Register here</Link>
            </p>
            <p>
              forgot password? <Link to="/Forgot">click here</Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Login;
