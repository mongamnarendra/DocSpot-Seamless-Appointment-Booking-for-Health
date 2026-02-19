import React from "react";
import { Form, Input, message } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "../styles/AuthStyles.css";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //form handler
    const onfinishHandler = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post("/api/v1/user/register", values);
            dispatch(hideLoading());
            if (res.data.success) {
                message.success("Register Successfully!");
                navigate("/login");
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error("Something Went Wrong");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-banner">
                <div className="banner-content">
                    <h2>Join Our Community</h2>
                    <p>Start your journey to better health. Register today to find and book appointments with world-class specialists.</p>
                </div>
            </div>
            <div className="auth-form-section">
                <div className="auth-card">
                    <h3>Create Account</h3>
                    <p>Fill in the details below to get started</p>
                    <Form
                        layout="vertical"
                        onFinish={onfinishHandler}
                    >
                        <Form.Item label="Full Name" name="name">
                            <Input type="text" required placeholder="John Doe" />
                        </Form.Item>
                        <Form.Item label="Email Address" name="email">
                            <Input type="email" required placeholder="example@mail.com" />
                        </Form.Item>
                        <Form.Item label="Phone Number" name="phone">
                            <Input type="text" required placeholder="+1 234 567 890" />
                        </Form.Item>
                        <Form.Item label="Password" name="password">
                            <Input type="password" required placeholder="Create a strong password" />
                        </Form.Item>
                        <button className="btn btn-primary" type="submit">
                            Register
                        </button>
                        <Link to="/login" className="auth-link">
                            Already have an account? Login here
                        </Link>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default Register;
