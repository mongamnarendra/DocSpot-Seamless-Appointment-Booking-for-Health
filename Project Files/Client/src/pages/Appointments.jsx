import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import moment from "moment";
import { Table } from "antd";

import "../styles/DashboardStyles.css";

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);

    const getAppointments = async () => {
        try {
            const res = await axios.get("/api/v1/appointment/user-appointments", {
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

    const columns = [
        {
            title: "Doctor",
            dataIndex: "doctorInfo",
            render: (text, record) => (
                <div className="d-flex align-items-center">
                    <div className="user-avatar-placeholder me-3" style={{ width: '35px', height: '35px', fontSize: '0.8rem' }}>
                        {record.doctorInfo?.firstName[0]}
                    </div>
                    <span style={{ fontWeight: 600 }}>Dr. {record.doctorInfo?.firstName} {record.doctorInfo?.lastName}</span>
                </div>
            ),
        },
        {
            title: "Specialization",
            dataIndex: "doctorInfo",
            render: (text, record) => (
                <span className="text-muted">{record.doctorInfo?.specialization}</span>
            )
        },
        {
            title: "Scheduled Date",
            dataIndex: "date",
            render: (text, record) => (
                <span className="text-muted"><i className="fa-solid fa-calendar-days me-2"></i>{record.date}</span>
            )
        },
        {
            title: "Time",
            dataIndex: "time",
            render: (text, record) => (
                <span className="text-muted"><i className="fa-solid fa-clock me-2"></i>{record.time}</span>
            )
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text) => (
                <span className={`status-badge status-${text.toLowerCase()}`}>
                    {text}
                </span>
            ),
        },
    ];

    return (
        <Layout>
            <div className="dashboard-wrapper">
                <div className="page-hero">
                    <h1>Your Appointments</h1>
                    <p>Track and manage your scheduled consultations with our specialist doctors.</p>
                </div>

                <div className=" premium-table-container">
                    <Table
                        columns={columns}
                        dataSource={appointments}
                        className="premium-table"
                        pagination={{ pageSize: 8 }}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Appointments;
