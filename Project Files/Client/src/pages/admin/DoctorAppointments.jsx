import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import moment from "moment";
import { message, Table, Select, DatePicker } from "antd";

import "../../styles/DashboardStyles.css";

const { Option } = Select;

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterDate, setFilterDate] = useState(null);

    const getAppointments = async () => {
        try {
            const res = await axios.get("/api/v1/appointment/doctor-appointments", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.data.success) {
                setAppointments(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAppointments();
    }, []);

    const handleStatus = async (record, status) => {
        try {
            const res = await axios.post(
                "/api/v1/appointment/update-status",
                { appointmentsId: record._id, status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                message.success(res.data.message);
                getAppointments();
            }
        } catch (error) {
            console.log(error);
            message.error("Something Went Wrong");
        }
    };

    // Filtering Logic
    const filteredAppointments = appointments.filter((app) => {
        const matchesStatus = filterStatus === "all" || app.status.toLowerCase() === filterStatus.toLowerCase();
        const matchesDate = !filterDate || app.date === filterDate.format("DD-MM-YYYY");
        return matchesStatus && matchesDate;
    });

    const columns = [
        {
            title: "Patient",
            dataIndex: "userInfo",
            render: (text, record) => (
                <div className="d-flex align-items-center">
                    <div className="user-avatar-placeholder me-3" style={{ width: '35px', height: '35px', fontSize: '0.8rem' }}>
                        {record.userInfo?.name[0]}
                    </div>
                    <span style={{ fontWeight: 600 }}>{record.userInfo?.name}</span>
                </div>
            ),
        },
        {
            title: "Scheduled Date",
            dataIndex: "date",
            render: (text) => (
                <span className="text-muted"><i className="fa-solid fa-calendar me-2"></i>{text}</span>
            )
        },
        {
            title: "Time Slot",
            dataIndex: "time",
            render: (text) => (
                <span className="text-muted"><i className="fa-solid fa-clock me-2"></i>{text}</span>
            )
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
        {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
                <div className="d-flex">
                    {record.status === "pending" && (
                        <div className="d-flex gap-2">
                            <button
                                className="status-badge status-approved border-0"
                                onClick={() => handleStatus(record, "approved")}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="fa-solid fa-check me-1"></i> Approve
                            </button>
                            <button
                                className="status-badge status-rejected border-0"
                                onClick={() => handleStatus(record, "reject")}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="fa-solid fa-xmark me-1"></i> Reject
                            </button>
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (
        <Layout>
            <div className="dashboard-wrapper">
                <div className="page-hero d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                    <div>
                        <h1>Patient Appointments</h1>
                        <p className="mb-0">Manage your upcoming consultations and review patient requests.</p>
                    </div>

                    {/* Elite Filtering Controls */}
                    <div className="search-container d-flex flex-wrap gap-3" style={{ minWidth: '450px' }}>
                        <div className="search-glass-container py-1 px-3" style={{ flex: 1 }}>
                            <i className="fa-solid fa-filter search-icon-float" style={{ opacity: 0.7 }}></i>
                            <Select
                                defaultValue="all"
                                className="search-input-elite w-100"
                                onChange={(value) => setFilterStatus(value)}
                                bordered={false}
                                suffixIcon={null}
                                style={{ background: 'transparent' }}
                            >
                                <Option value="all">All Statuses</Option>
                                <Option value="approved">Approved</Option>
                                <Option value="pending">Pending</Option>
                                <Option value="reject">Rejected</Option>
                            </Select>
                        </div>
                        <div className="search-glass-container py-1 px-3" style={{ flex: 1.2 }}>
                            <i className="fa-solid fa-calendar-day search-icon-float" style={{ opacity: 0.7 }}></i>
                            <DatePicker
                                className="search-input-elite w-100"
                                placeholder="Filter by date..."
                                format="DD-MM-YYYY"
                                bordered={false}
                                onChange={(date) => setFilterDate(date)}
                                allowClear={true}
                                suffixIcon={null}
                                style={{ background: 'transparent' }}
                            />
                            {filterDate && (
                                <div className="clear-search-btn" onClick={() => setFilterDate(null)}>
                                    <i className="fa-solid fa-xmark"></i>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredAppointments}
                    className="premium-table"
                    pagination={{ pageSize: 8 }}
                />
            </div>
        </Layout>
    );
};

export default DoctorAppointments;
