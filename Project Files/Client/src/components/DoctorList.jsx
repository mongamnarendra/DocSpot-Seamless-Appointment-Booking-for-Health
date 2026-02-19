import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardStyles.css";

const DoctorList = ({ doctor }) => {
    const navigate = useNavigate();
    return (
        <div className="col-md-4 col-lg-3 p-3">
            <div
                className="doctor-card"
                onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
                style={{ cursor: "pointer" }}
            >
                <div className="doctor-card-header">
                    <div className="doctor-avatar-circle p-0" style={{ overflow: 'hidden' }}>
                        {doctor.profileImage ? (
                            <img src={doctor.profileImage} alt="doctor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            doctor.firstName[0]
                        )}
                    </div>
                    <h3>Dr. {doctor.firstName} {doctor.lastName}</h3>
                    <div className="specialization">{doctor.specialization}</div>
                </div>
                <div className="doctor-card-body">
                    <div className="doc-info-row">
                        <span className="label"><i className="fa-solid fa-graduation-cap"></i> Experience</span>
                        <span className="value">{doctor.experience} Yrs</span>
                    </div>
                    <div className="doc-info-row">
                        <span className="label"><i className="fa-solid fa-money-bill-wave"></i> Fees</span>
                        <span className="value">₹{doctor.feesPerCunsaltation}</span>
                    </div>
                    <div className="doc-info-row">
                        <span className="label"><i className="fa-solid fa-clock"></i> Timings</span>
                        <span className="value">{doctor.timings[0]} - {doctor.timings[1]}</span>
                    </div>
                    <button className="btn-book-now" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/doctor/book-appointment/${doctor._id}`);
                    }}>
                        Book Now <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorList;
