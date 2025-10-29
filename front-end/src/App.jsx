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

  // 👇 STAFF interface
  if (role === "staff") {
    const onNavigate = (page, data) => {
      // Handle data passed from components
      if (data) {
        setSelectedItem(data);
      }
      setCurrentPage(page);
    };

    const shared = { onNavigate, selectedItem, setSelectedItem };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* 🔙 Logout button */}
        <div className="p-4 bg-white shadow-sm flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">C.A.M.P Staff Portal</h2>
          <button
            onClick={handleLogout}
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
          
          {/* Fixed: lowercase routing to match Inventory.jsx calls */}
          {currentPage === "additem" && <AddItem {...shared} />}
          {currentPage === "edititem" && <EditItem {...shared} itemData={selectedItem} />}

          {/* Default (fallback) */}
          {currentPage === "home" && <StaffDashboard {...shared} />}
        </div>
      </div>
    );
  }

  // 👇 STUDENT interface
  if (role === "student") {
    const onNavigate = (page, data) => {
      setCurrentPage(page);
      if (data?.item) setSelectedItem(data.item);
      if (data?.reservation) setReservationData(data.reservation);
      if (data?.waitlist) setWaitlistData(data.waitlist);
      if (data?.facility) setSelectedFacility(data.facility);
      if (data?.fine) setSelectedFine(data.fine);
      if (data?.payment) setPaymentResult(data.payment);
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* 🔙 Logout button */}
        <div className="p-4 bg-white shadow-sm flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">C.A.M.P Student Portal</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Page Routing */}
        <div className="p-4">
          {currentPage === "home" && <HomePage onNavigate={onNavigate} />}
          {currentPage === "browse" && <BrowserCataloguePage onNavigate={onNavigate} />}
          {currentPage === "filter" && <FilterAndSearchPage onNavigate={onNavigate} />}
          {currentPage === "itemDetail" && (
            <ItemDetailPage
              onNavigate={onNavigate}
              item={selectedItem}
            />
          )}
          {currentPage === "facility" && (
            <FacilityItemsPage
              onNavigate={onNavigate}
              facility={selectedFacility}
            />
          )}
          {currentPage === "reserveDateTime" && (
            <ReserveDateTimePage
              onNavigate={onNavigate}
              item={selectedItem}
            />
          )}
          {currentPage === "reservationConfirmed" && (
            <ReservationConfirmedPage
              onNavigate={onNavigate}
              reservation={reservationData}
            />
          )}
          {currentPage === "waitlistConfirmed" && (
            <WaitlistConfirmedPage
              onNavigate={onNavigate}
              waitlist={waitlistData}
            />
          )}
          {currentPage === "myBorrowals" && <MyBorrowalsPage onNavigate={onNavigate} />}
          {currentPage === "profile" && <ProfileAndSettingsPage onNavigate={onNavigate} />}
          {currentPage === "notifications" && <NotificationsPage onNavigate={onNavigate} />}
          {currentPage === "fines" && <FinesPage onNavigate={onNavigate} />}
          {currentPage === "payFine" && (
            <PayFinePage
              onNavigate={onNavigate}
              fine={selectedFine}
            />
          )}
          {currentPage === "paymentSuccess" && (
            <PaymentSuccessPage
              onNavigate={onNavigate}
              payment={paymentResult}
            />
          )}
          {currentPage === "paymentHistory" && <PaymentHistoryPage onNavigate={onNavigate} />}
          {currentPage === "help" && <HelpAndPoliciesPage onNavigate={onNavigate} />}
        </div>
      </div>
    );
  }

  return null;
}
