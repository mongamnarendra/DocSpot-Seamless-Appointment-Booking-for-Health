import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Form, Input, Row, TimePicker, message, Button, Upload } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import { setUser } from "../../redux/features/userSlice";
import moment from "moment";
import "../../styles/DashboardStyles.css";

const Profile = () => {
    const { user } = useSelector((state) => state.user);
    const [doctor, setDoctor] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleUpload = async (info) => {
        const { file } = info;
        if (file.status === 'done' || file.originFileObj) {
            const base64 = await getBase64(file.originFileObj || file);
            setImageUrl(base64);
            // Updating the doctor state or letting the form handle it if needed
        }
    };

    // update doc ==========
    const handleFinish = async (values) => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
                "/api/v1/doctor/updateProfile",
                {
                    ...values,
                    userId: user._id,
                    profileImage: imageUrl || doctor.profileImage,
                    timings: [
                        moment(values.timings[0]).format("HH:mm"),
                        moment(values.timings[1]).format("HH:mm"),
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
                // Update local user state in Redux to reflect the new profile image in navbar
                dispatch(setUser({ ...user, profileImage: imageUrl || res.data.data.profileImage }));
                navigate("/");
            } else {
                message.error(res.data.success);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
            message.error("Something Went Wrong ");
        }
    };

    // getDoc Details
    const getDoctorInfo = async () => {
        try {
            const res = await axios.post(
                "/api/v1/doctor/getDoctorInfo",
                { userId: params.id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                setDoctor(res.data.data);
                if (res.data.data.profileImage) {
                    setImageUrl(res.data.data.profileImage);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDoctorInfo();
        // eslint-disable-next-line
    }, []);

    return (
        <Layout>
            <div className="dashboard-wrapper">
                <div className="page-hero">
                    <h1>Specialist Portal</h1>
                    <p>Manage your professional profile, availability, and consultation settings.</p>
                </div>

                {doctor && (
                    <div className="profile-tab-content elite-glass">
                        <div className="d-flex justify-content-center mb-5 mt-3">
                            <div className="text-center">
                                <Upload
                                    name="avatar"
                                    listType="picture-circle"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    onChange={handleUpload}
                                >
                                    {imageUrl ? (
                                        <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        <div className="d-flex flex-column align-items-center">
                                            <i className="fa-solid fa-camera mb-2" style={{ fontSize: '1.5rem', color: '#003366' }}></i>
                                            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#003366' }}>UPDATE PHOTO</div>
                                        </div>
                                    )}
                                </Upload>
                                <p className="mt-2 text-muted small fw-bold">Professional Recognition</p>
                            </div>
                        </div>

                        <Form
                            layout="vertical"
                            onFinish={handleFinish}
                            className="premium-form"
                            initialValues={{
                                ...doctor,
                                timings: doctor?.timings ? [
                                    moment(doctor.timings[0], "HH:mm"),
                                    moment(doctor.timings[1], "HH:mm"),
                                ] : [],
                            }}
                        >
                            <div className="section-title">
                                <i className="fa-solid fa-user-doctor"></i> Professional Identity
                            </div>
                            <Row gutter={24}>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="First Name" name="firstName" required rules={[{ required: true }]}>
                                        <Input className="premium-input" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Last Name" name="lastName" required rules={[{ required: true }]}>
                                        <Input className="premium-input" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Contact Phone" name="phone" required rules={[{ required: true }]}>
                                        <Input className="premium-input" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Professional Email" name="email" required rules={[{ required: true }]}>
                                        <Input className="premium-input" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Medical Website" name="website">
                                        <Input className="premium-input" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Clinic Address" name="address" required rules={[{ required: true }]}>
                                        <Input className="premium-input" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div className="section-title mt-5">
                                <i className="fa-solid fa-graduation-cap"></i> Specialist Credentials
                            </div>
                            <Row gutter={24}>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Specialization" name="specialization" required rules={[{ required: true }]}>
                                        <Input className="premium-input" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Experience (Years)" name="experience" required rules={[{ required: true }]}>
                                        <Input className="premium-input" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Consultation Fee (₹)" name="feesPerCunsaltation" required rules={[{ required: true }]}>
                                        <Input className="premium-input" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12} lg={8}>
                                    <Form.Item label="Active Timings" name="timings" required>
                                        <TimePicker.RangePicker format="HH:mm" className="premium-input w-100" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div className="d-flex justify-content-end mt-5 pt-4" style={{ borderTop: '1px solid #f1f5f9' }}>
                                <Button type="primary" className="form-submit-btn m-0 w-auto px-5" style={{ height: '50px' }} htmlType="submit">
                                    Update Specialist Profile <i className="fa-solid fa-rotate ms-2"></i>
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Profile;
