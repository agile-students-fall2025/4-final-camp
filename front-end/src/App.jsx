import React, { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";

import HomePage from "./pages/HomePage";
import FilterAndSearchPage from "./pages/FilterAndSearchPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import ReserveDateTimePage from "./pages/ReserveDateTimePage";
import ReservationConfirmedPage from "./pages/ReservationConfirmedPage";
import WaitlistConfirmedPage from "./pages/WaitlistConfirmedPage";
import MyBorrowalsPage from "./pages/MyBorrowalsPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import ProfileAndSettingsPage from "./pages/ProfileAndSettingsPage";
import FinesPage from "./pages/FinesPage";
import PayFinePage from "./pages/PayFinePage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import HelpAndPoliciesPage from "./pages/HelpAndPoliciesPage";

import StaffDashboard from "./pages/staff/StaffDashboard.jsx";
import Inventory from "./pages/staff/Inventory.jsx";
import CheckOut from "./pages/staff/CheckOut.jsx";
import CheckIn from "./pages/staff/CheckIn.jsx";
import Reservations from "./pages/staff/Reservations.jsx";
import Overdue from "./pages/staff/Overdue.jsx";
import ManageFines from "./pages/staff/ManageFines.jsx";
import AddItem from "./pages/staff/AddItem.jsx";
import EditItem from "./pages/staff/EditItem.jsx";

import LandingPage from "./pages/landingpage.jsx";
import StudentLoginPage from "./pages/StudentLoginPage.jsx";
import StudentRegisterPage from "./pages/StudentRegisterPage.jsx";
import StaffLoginPage from "./pages/staff/StaffLoginPage.jsx";
import Protected from "./components/Protected.jsx";

export default function App() {
  const { role, logout, isAuthenticated, initializing } = useAuth();
  const [authPage, setAuthPage] = useState(null); // 'studentLogin', 'studentRegister', 'staffLogin', or null
  const [currentPage, setCurrentPage] = useState("home");

  const [selectedItem, setSelectedItem] = useState(null);
  const [reservationData, setReservationData] = useState(null);
  const [waitlistData, setWaitlistData] = useState(null);
  const [selectedFine, setSelectedFine] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [staffPrefillData, setStaffPrefillData] = useState(null);

  const handleLogout = () => {
    logout();
    setAuthPage(null);
    setCurrentPage("home");
  };

  const handleSelectRole = (selectedRole) => {
    if (selectedRole === "student") setAuthPage("studentLogin");
    else if (selectedRole === "staff") setAuthPage("staffLogin");
  };

  const handleStudentRegister = () => {
    // After registration, stay on home; context should have set user/role
    setAuthPage(null);
    setCurrentPage("home");
  };

  const handleBackToLanding = () => {
    setAuthPage(null);
  };

  // When role becomes available (auto-login), set default page
  useEffect(() => {
    if (!initializing && role) {
      if (role === 'staff') setCurrentPage('dashboard');
      else if (role === 'student') setCurrentPage('home');
      setAuthPage(null); // Ensure auth pages hidden when authenticated
    }
  }, [role, initializing]);

  if (initializing) {
    return <div className="p-8 text-center text-gray-600">Initializing session...</div>;
  }

  // Show landing page if no role selected
  if (!isAuthenticated && !authPage) {
    return <LandingPage onSelectRole={handleSelectRole} />;
  }

  // Show authentication pages
  if (authPage === "studentLogin") {
    return (
      <StudentLoginPage
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
        onBack={handleBackToLanding}
      />
    );
  }

  // Staff portal
  if (role === "staff" && isAuthenticated) {
    const onNavigate = (page, data) => {
      // Handle prefill data for fines page
      if (data?.prefillStudent) {
        setStaffPrefillData(data.prefillStudent);
      } else {
        setStaffPrefillData(null);
      }
      
      // Handle item selection for other pages
      if (data?.item) {
        setSelectedItem(data.item);
      } else if (data && !data.prefillStudent) {
        setSelectedItem(data);
      }
      
      setCurrentPage(page);
    };

    const shared = { onNavigate, selectedItem, setSelectedItem };

    return (
      <Protected allowedRoles={["staff"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 bg-white shadow-sm flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">C.A.M.P Staff Portal</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
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
          {currentPage === "fines" && <ManageFines {...shared} prefillData={staffPrefillData} />}
          
          {currentPage === "additem" && <AddItem {...shared} />}
          {currentPage === "edititem" && <EditItem {...shared} itemData={selectedItem} />}

          {currentPage === "home" && <StaffDashboard {...shared} />}
        </div>
      </div>
      </Protected>
    );
  }

  // Student portal
  if (role === "student" && isAuthenticated) {
    return (
      <Protected allowedRoles={["student"]}>
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
        {currentPage === "borrowals" && <MyBorrowalsPage onNavigate={setCurrentPage} />}
        {currentPage === "reservations" && <MyReservationsPage onNavigate={setCurrentPage} />}
        {currentPage === "profile" && <ProfileAndSettingsPage onNavigate={setCurrentPage} />}
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
        {currentPage === "help" && <HelpAndPoliciesPage onNavigate={setCurrentPage} />}
      </div>
      </Protected>
    );
  }
}
