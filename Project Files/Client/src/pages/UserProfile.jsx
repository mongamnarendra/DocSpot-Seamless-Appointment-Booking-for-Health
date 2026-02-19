import React, { useState } from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { Row, Col, Badge } from "antd";
import "../styles/DashboardStyles.css";

const UserProfile = () => {
    const { user } = useSelector((state) => state.user);
    const [activeTab, setActiveTab] = useState("overview");

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <div className="fade-in">
                        <div className="member-card">
                            <div className="member-card-logo">
                                <i className="fa-solid fa-house-medical"></i>
                            </div>
                            <div className="member-card-chip"></div>
                            <div className="member-details">
                                <div className="member-number">DOC-SP-2026-{user?._id?.slice(-4).toUpperCase()}</div>
                                <div className="member-name">{user?.name?.toUpperCase()}</div>
                            </div>
                            <div className="member-footer">
                                <div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>MEMBER SINCE</div>
                                    <div style={{ fontWeight: 600 }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase() : "MAR 2024"}</div>
                                </div>
                                <div className="text-end">
                                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>STATUS</div>
                                    <div style={{ fontWeight: 600 }}>{user?.isDoctor ? "PHYSICIAN" : user?.isAdmin ? "ADMINISTRATOR" : "PATIENT"}</div>
                                </div>
                            </div>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-widget">
                                <div className="stat-icon" style={{ background: '#f0fdf4', color: '#15803d' }}>
                                    <i className="fa-solid fa-bell"></i>
                                </div>
                                <div className="stat-value">{user?.notification?.length || 0}</div>
                                <div className="stat-label">Pending Notifications</div>
                            </div>
                            <div className="stat-widget">
                                <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                                    <i className="fa-solid fa-envelope-open"></i>
                                </div>
                                <div className="stat-value">{user?.seennotification?.length || 0}</div>
                                <div className="stat-label">Read History</div>
                            </div>
                        </div>
                    </div>
                );
            case "identity":
                return (
                    <div className="fade-in">
                        <div className="identity-card elite-glass">
                            <div className="identity-card-header">
                                <i className="fa-solid fa-address-card"></i>
                                <h5>Identity Profile</h5>
                            </div>
                            <div className="p-4">
                                <Row gutter={[40, 30]}>
                                    <Col xs={24} md={12}>
                                        <div className="data-row mb-4">
                                            <div className="data-label text-primary fw-bold mb-1" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>FULL NAME</div>
                                            <div className="data-value h5 mb-0" style={{ color: '#1e293b', fontWeight: 700 }}>{user?.name}</div>
                                        </div>
                                        <div className="data-row">
                                            <div className="data-label text-primary fw-bold mb-1" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>PRIMARY EMAIL</div>
                                            <div className="data-value h6 mb-0" style={{ color: '#475569', fontWeight: 600 }}>{user?.email}</div>
                                        </div>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <div className="data-row mb-4">
                                            <div className="data-label text-primary fw-bold mb-1" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>REGISTERED PHONE</div>
                                            <div className="data-value h5 mb-0" style={{ color: '#1e293b', fontWeight: 700 }}>{user?.phone || "N/A"}</div>
                                        </div>
                                        <div className="data-row">
                                            <div className="data-label text-primary fw-bold mb-1" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>SYSTEM ROLE</div>
                                            <div className="data-value h6 mb-0" style={{ color: '#475569', fontWeight: 600 }}>{user?.isDoctor ? "Healthcare Provider" : user?.isAdmin ? "Administrator" : "Standard Patient"}</div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="dashboard-wrapper profile-container">
                <div className="page-hero">
                    <h1>Executive Command Center</h1>
                    <p>Orchestrate your medical journey and professional profile with precision.</p>
                </div>

                <div className="profile-layout-wrapper">
                    <div className="profile-internal-sidebar elite-glass">
                        <div
                            className={`profile-tab-item ${activeTab === "overview" ? "active" : ""}`}
                            onClick={() => setActiveTab("overview")}
                        >
                            <i className="fa-solid fa-gauge-high"></i> Overview
                        </div>
                        <div
                            className={`profile-tab-item ${activeTab === "identity" ? "active" : ""}`}
                            onClick={() => setActiveTab("identity")}
                        >
                            <i className="fa-solid fa-address-card"></i> Identity Profile
                        </div>
                    </div>

                    <div className="profile-main-content">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UserProfile;
