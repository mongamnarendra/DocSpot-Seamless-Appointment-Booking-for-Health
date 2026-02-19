import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row, Table } from "antd";
import DoctorList from "../components/DoctorList";
import { useSelector } from "react-redux";

import "../styles/DashboardStyles.css";

const HomePage = () => {
    const { user } = useSelector((state) => state.user);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // login user data
    // ... (rest of search/getData remains same)
    const getUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                "/api/v1/admin/getAllDoctors",
                { headers: { Authorization: "Bearer " + token } }
            );
            if (res.data.success) {
                setDoctors(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getDoctorAppointments = async () => {
        try {
            const res = await axios.get("/api/v1/appointment/doctor-appointments", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (res.data.success) {
                const approvedAppointments = res.data.data.filter(app => app.status === "approved");
                setAppointments(approvedAppointments);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user?.isDoctor) {
            getDoctorAppointments();
        } else {
            getUserData();
        }
    }, [user]);

    const columns = [
        {
            title: "Patient",
            dataIndex: "userInfo",
            render: (text, record) => (
                <span style={{ fontWeight: 600 }}>{record.userInfo?.name}</span>
            )
        },
        {
            title: "Date",
            dataIndex: "date",
        },
        {
            title: "Time",
            dataIndex: "time",
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text) => (
                <span className={`status-badge status-${text.toLowerCase()}`}>
                    {text}
                </span>
            )
        },
    ];

    return (
        <Layout>
            <div className="dashboard-wrapper">
                <div className="welcome-banner">
                    <h1>Hello, {user?.name.split(' ')[0]}! 👋</h1>
                    <p>
                        {user?.isDoctor
                            ? "Manage your daily schedule and provide top-notch care to your patients effortlessly."
                            : "Find the best doctors and book your appointments in just a few clicks. Your health, simplified."}
                    </p>
                </div>

                {user?.isDoctor ? (
                    <div className="mt-4">
                        <div className="section-header d-flex justify-content-between align-items-center mb-4">
                            <h2 style={{ color: "#003366", fontWeight: 700 }}>Upcoming Appointments</h2>
                        </div>
                        <Table
                            columns={columns}
                            dataSource={appointments}
                            className="premium-table"
                            pagination={{ pageSize: 5 }}
                            rowKey="_id"
                        />
                    </div>
                ) : (
                    <div>
                        <div className="section-header mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                            <div>
                                <h2 style={{ color: "#003366", fontWeight: 700 }}>Available Specialists</h2>
                                <p style={{ color: "#64748b" }} className="mb-0">Choose from our network of certified medical professionals.</p>
                            </div>
                            <div className="search-container" style={{ minWidth: '400px' }}>
                                <div className="search-glass-container">
                                    <i className="fa-solid fa-magnifying-glass search-icon-float"></i>
                                    <input
                                        type="text"
                                        placeholder="Search by name or specialty..."
                                        className="search-input-elite"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {searchQuery && (
                                        <div className="clear-search-btn" onClick={() => setSearchQuery("")}>
                                            <i className="fa-solid fa-xmark"></i>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Row>
                            {doctors && doctors
                                .filter(doc =>
                                    doc.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    doc.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((doctor) => <DoctorList doctor={doctor} key={doctor._id} />)}

                            {doctors && doctors.filter(doc =>
                                doc.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                doc.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
                            ).length === 0 && (
                                    <div className="text-center w-100 py-5">
                                        <div className="mb-3">
                                            <i className="fa-solid fa-user-slash" style={{ fontSize: '3rem', color: '#cbd5e1' }}></i>
                                        </div>
                                        <h5 style={{ color: '#64748b' }}>No specialists found matching "{searchQuery}"</h5>
                                        <p className="text-muted">Try using different keywords or check back later.</p>
                                    </div>
                                )}
                        </Row>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default HomePage;
