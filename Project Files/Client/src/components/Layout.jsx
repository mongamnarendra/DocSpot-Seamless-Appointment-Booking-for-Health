import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu, doctorMenu } from "../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";

const Layout = ({ children }) => {
    const { user } = useSelector((state) => state.user);
    const location = useLocation();
    const navigate = useNavigate();

    // logout funtion
    const handleLogout = () => {
        localStorage.clear();
        message.success("Logout Successfully");
        navigate("/login");
    };

    // rendering menu list
    const SidebarMenu = user?.isAdmin
        ? adminMenu
        : user?.isDoctor
            ? doctorMenu
            : userMenu;

    // Doctor menu profile path fix
    if (user?.isDoctor) {
        const profileItem = doctorMenu.find(item => item.name === 'Profile');
        if (profileItem) profileItem.path = `/doctor/profile/${user?._id}`;
    }
    return (
        <>
            <div className="main">
                <div className="layout">
                    <div className="sidebar">
                        <div className="logo">
                            <h6>DocSpot</h6>
                            <hr />
                        </div>
                        <div className="menu">
                            {SidebarMenu.map((menu) => {
                                const isActive = location.pathname === menu.path || (menu.name === 'Profile' && location.pathname.includes('/doctor/profile'));
                                return (
                                    <div
                                        className={`menu-item ${isActive && "active"}`}
                                        key={menu.name}
                                        onClick={() => navigate(menu.path)}
                                    >
                                        <i className={menu.icon}></i>
                                        <Link to={menu.path}>{menu.name}</Link>
                                    </div>
                                );
                            })}
                            <div className={`menu-item `} onClick={handleLogout}>
                                <i className="fa-solid fa-right-from-bracket"></i>
                                <Link to="/login">Logout</Link>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="header">
                            <div className="header-content">
                                <Badge
                                    count={user && user.notification.length}
                                    onClick={() => {
                                        navigate("/notification");
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <i className="fa-solid fa-bell"></i>
                                </Badge>

                                <Link to={user?.isDoctor ? `/doctor/profile/${user?._id}` : "/profile"}>
                                    {user?.name}
                                    {user?.profileImage ? (
                                        <img src={user?.profileImage} alt="profile" className="user-avatar" />
                                    ) : (
                                        <div className="user-avatar-placeholder">
                                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </div>
                                    )}
                                </Link>
                            </div>
                        </div>
                        <div className="body">{children}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Layout;
