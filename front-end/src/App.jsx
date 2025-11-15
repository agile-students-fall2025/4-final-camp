import React, { useState } from "react";
import { authUtils } from "./utils/auth.js";

import HomePage from "./pages/HomePage";
import FilterAndSearchPage from "./pages/FilterAndSearchPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import ReserveDateTimePage from "./pages/ReserveDateTimePage";
import ReservationConfirmedPage from "./pages/ReservationConfirmedPage";
import WaitlistConfirmedPage from "./pages/WaitlistConfirmedPage";
import BrowserCataloguePage from "./pages/BrowserCataloguePage";
import FacilityItemsPage from "./pages/FacilityItemsPage";
import MyBorrowalsPage from "./pages/MyBorrowalsPage";
import ProfileAndSettingsPage from "./pages/ProfileAndSettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import FinesPage from "./pages/FinesPage";
import PayFinePage from "./pages/PayFinePage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import HelpAndPoliciesPage from "./pages/HelpAndPoliciesPage";

import StaffDashboard from "./pages/staff/StaffDashboard.jsx";
import Inventory from "./pages/staff/Inventory.jsx";
import CheckOut from "./pages/staff/CheckOut.jsx";
import CheckIn from "./pages/staff/CheckIn.jsx";
import Reservations from "./pages/staff/Reservations.jsx";
import Overdue from "./pages/staff/Overdue.jsx";
import AutomatedAlerts from "./pages/staff/AutomatedAlerts.jsx";
import ManageFines from "./pages/staff/ManageFines.jsx";
import AddItem from "./pages/staff/AddItem.jsx";
import EditItem from "./pages/staff/EditItem.jsx";

import LandingPage from "./pages/landingpage.jsx";
import StudentLoginPage from "./pages/StudentLoginPage.jsx";
import StudentRegisterPage from "./pages/StudentRegisterPage.jsx";
import StaffLoginPage from "./pages/staff/StaffLoginPage.jsx";

export default function App() {
  const [role, setRole] = useState(null);
  const [authPage, setAuthPage] = useState(null); // 'studentLogin', 'studentRegister', 'staffLogin', or null
  const [currentPage, setCurrentPage] = useState("home");

  const [selectedItem, setSelectedItem] = useState(null);
  const [reservationData, setReservationData] = useState(null);
  const [waitlistData, setWaitlistData] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedFine, setSelectedFine] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  const handleLogout = () => {
    // Clear auth data from localStorage
    authUtils.clearAuth();
    setRole(null);
    setAuthPage(null);
    setCurrentPage("home");
  };

  const handleSelectRole = (selectedRole) => {
    if (selectedRole === "student") {
      setAuthPage("studentLogin");
    } else if (selectedRole === "staff") {
      setAuthPage("staffLogin");
    }
  };

  const handleStudentLogin = () => {
    setRole("student");
    setAuthPage(null);
    setCurrentPage("home");
  };

  const handleStudentRegister = () => {
    setRole("student");
    setAuthPage(null);
    setCurrentPage("home");
  };

  const handleStaffLogin = () => {
    setRole("staff");
    setAuthPage(null);
    setCurrentPage("dashboard");
  };

  const handleBackToLanding = () => {
    setAuthPage(null);
    setRole(null);
  };

  // Show landing page if no role selected
  if (!role && !authPage) {
    return <LandingPage onSelectRole={handleSelectRole} />;
  }

  // Show authentication pages
  if (authPage === "studentLogin") {
    return (
      <StudentLoginPage
        onLogin={handleStudentLogin}
        onBack={handleBackToLanding}
        onNavigateToRegister={() => setAuthPage("studentRegister")}
      />
    );
  }

  if (authPage === "studentRegister") {
    return (
      <StudentRegisterPage
        onRegister={handleStudentRegister}
        onBack={handleBackToLanding}
        onNavigateToLogin={() => setAuthPage("studentLogin")}
      />
    );
  }

  if (authPage === "staffLogin") {
    return (
      <StaffLoginPage
        onLogin={handleStaffLogin}
        onBack={handleBackToLanding}
      />
    );
  }

  // Staff portal
  if (role === "staff") {
    const onNavigate = (page, data) => {
      if (data?.item) setSelectedItem(data.item);
      if (data && !data.item) setSelectedItem(data);
      setCurrentPage(page);
    };

    const shared = { onNavigate, selectedItem, setSelectedItem };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 bg-white shadow-sm flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">C.A.M.P Staff Portal</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="p-4">
          {currentPage === "dashboard" && <StaffDashboard {...shared} />}
          {currentPage === "inventory" && <Inventory {...shared} />}
          {currentPage === "checkout" && <CheckOut {...shared} />}
          {currentPage === "checkin" && <CheckIn {...shared} />}
          {currentPage === "reservations" && <Reservations {...shared} />}
          {currentPage === "overdue" && <Overdue {...shared} />}
          {currentPage === "alerts" && <AutomatedAlerts {...shared} />}
          {currentPage === "fines" && <ManageFines {...shared} />}
          
          {currentPage === "additem" && <AddItem {...shared} />}
          {currentPage === "edititem" && <EditItem {...shared} itemData={selectedItem} />}

          {currentPage === "home" && <StaffDashboard {...shared} />}
        </div>
      </div>
    );
  }

  // Student portal
  if (role === "student") {
    return (
      <div className="min-h-screen relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg shadow-sm transition-colors z-50"
        >
          Logout
        </button>

        {currentPage === "home" && <HomePage onNavigate={setCurrentPage} />}
        {currentPage === "filter" && (
          <FilterAndSearchPage onNavigate={setCurrentPage} setSelectedItem={setSelectedItem} />
        )}
        {currentPage === "itemDetail" && (
          <ItemDetailPage
            onNavigate={setCurrentPage}
            selectedItem={selectedItem}
            setWaitlistData={setWaitlistData}
          />
        )}
        {currentPage === "reserveDateTime" && (
          <ReserveDateTimePage
            onNavigate={setCurrentPage}
            selectedItem={selectedItem}
            setReservationData={setReservationData}
          />
        )}
        {currentPage === "reservationConfirmed" && (
          <ReservationConfirmedPage onNavigate={setCurrentPage} reservationData={reservationData} />
        )}
        {currentPage === "waitlistConfirmed" && (
          <WaitlistConfirmedPage onNavigate={setCurrentPage} waitlistData={waitlistData} />
        )}
        {currentPage === "catalogue" && (
          <BrowserCataloguePage onNavigate={setCurrentPage} setSelectedFacility={setSelectedFacility} />
        )}
        {currentPage === "facilityItems" && (
          <FacilityItemsPage
            onNavigate={setCurrentPage}
            selectedFacility={selectedFacility}
            setSelectedItem={setSelectedItem}
          />
        )}
        {currentPage === "borrowals" && <MyBorrowalsPage onNavigate={setCurrentPage} />}
        {currentPage === "profile" && <ProfileAndSettingsPage onNavigate={setCurrentPage} />}
        {currentPage === "notifications" && <NotificationsPage onNavigate={setCurrentPage} />}
        {currentPage === "fines" && (
          <FinesPage onNavigate={setCurrentPage} setSelectedFine={setSelectedFine} />
        )}
        {currentPage === "payFine" && (
          <PayFinePage
            onNavigate={setCurrentPage}
            selectedFine={selectedFine}
            setPaymentResult={setPaymentResult}
          />
        )}
        {currentPage === "paymentSuccess" && (
          <PaymentSuccessPage onNavigate={setCurrentPage} paymentResult={paymentResult} />
        )}
        {currentPage === "paymentHistory" && <PaymentHistoryPage onNavigate={setCurrentPage} />}
        {currentPage === "help" && <HelpAndPoliciesPage onNavigate={setCurrentPage} />}
      </div>
    );
  }
}
