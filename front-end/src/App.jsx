import React, { useState } from "react";

// STUDENT pages
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

// STAFF pages
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

// LANDING PAGE
import LandingPage from "./pages/landingpage.jsx";

export default function App() {
  const [role, setRole] = useState(null); // "student" | "staff" | null
  const [currentPage, setCurrentPage] = useState("home");

  // Shared states
  const [selectedItem, setSelectedItem] = useState(null);
  const [reservationData, setReservationData] = useState(null);
  const [waitlistData, setWaitlistData] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedFine, setSelectedFine] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);

  // 👇 Function to log out / go back to landing
  const handleLogout = () => {
    setRole(null);
    setCurrentPage("home");
  };

  // 👇 If no role selected, show landing
  if (!role) {
    return <LandingPage onSelectRole={setRole} />;
  }

  if (role === "staff") {
    const onNavigate = (page, data) => {
      if (data?.item) setSelectedItem(data.item);
      setCurrentPage(page);
    };

    const shared = { onNavigate, selectedItem, setSelectedItem };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* 🔙 Logout button */}
        <div className="p-4 bg-white shadow-sm flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">C.A.M.P</h2>
          <button
            onClick={() => {
              setRole(null);
              setCurrentPage("home");
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Page Routing */}
        <div className="p-4">
          {currentPage === "dashboard" && <StaffDashboard {...shared} />}
          {currentPage === "inventory" && <Inventory {...shared} />}
          {currentPage === "checkout" && <CheckOut {...shared} />}
          {currentPage === "checkin" && <CheckIn {...shared} />}
          {currentPage === "reservations" && <Reservations {...shared} />}
          {currentPage === "overdue" && <Overdue {...shared} />}
          {currentPage === "alerts" && <AutomatedAlerts {...shared} />}
          {currentPage === "fines" && <ManageFines {...shared} />}
          {currentPage === "addItem" && <AddItem {...shared} />}
          {currentPage === "editItem" && <EditItem {...shared} />}

          {/* Default (fallback) */}
          {currentPage === "home" && <StaffDashboard {...shared} />}
        </div>
      </div>
    );
  }
  // 👇 STAFF interface
  if (role === "staff") {
    const onNavigate = (page, data) => {
      if (data?.item) setSelectedItem(data.item);
      setCurrentPage(page);
    };

    const shared = { onNavigate, selectedItem, setSelectedItem };

    return (
      <div className="min-h-screen relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
        >
          Logout
        </button>

        {currentPage === "inventory" && <Inventory {...shared} />}
        {currentPage === "checkout" && <CheckOut {...shared} />}
        {currentPage === "checkin" && <CheckIn {...shared} />}
        {currentPage === "reservations" && <Reservations {...shared} />}
        {currentPage === "overdue" && <Overdue {...shared} />}
        {currentPage === "alerts" && <AutomatedAlerts {...shared} />}
        {currentPage === "fines" && <ManageFines {...shared} />}
        {currentPage === "addItem" && <AddItem {...shared} />}
        {currentPage === "editItem" && <EditItem {...shared} />}
        {currentPage === "dashboard" && <StaffDashboard {...shared} />}
      </div>
    );
  }

  // 👇 STUDENT interface
  if (role === "student") {
    return (
      <div className="min-h-screen relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
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
