import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import Header from "./components/Header";
import EventSection from "./components/EventSection";
import AboutSection from "./components/AboutSection";
import EventGallery from "./components/EventGallery";
import FeedbackSection from "./components/FeedbackSection";
import Footer from "./components/Footer";
import FloatingMenuButton from "./components/FloatingMenuButton";
import HospitalityPage from "./components/HospitalityPage";
import Schedule from "./components/Schedule";
import AdminLogin from "./components/AdminLogin";
import LoginPage from "./components/LoginPage";
import RegisterForm from "./components/RegisterForm";
import WelcomePage from "./pages/welcomePage";
import Dashboard from './pages/coreDashboard';
import AddEventForm from './components/AddEventForm';
import EventDetails from "./components/EventDetails";
import ModifyDetail from "./components/ModifyDetail";
import EditEventForm from "./components/EditEventForm";
import ViewEvents from './components/ViewEvents';
import DeleteEvent from "./components/DeleteEvent";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import UserRegistrationsComponent from "./components/UserRegistrationsComponent";
import './theme.css';


// Protected route for admin dashboard
const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = () => {
    const adminInfoString = localStorage.getItem("adminInfo");
    if (!adminInfoString) {
      return false;
    }
    try {
      const adminInfo = JSON.parse(adminInfoString);
      return adminInfo && adminInfo.token && adminInfo.role === 'core';
    } catch (error) {
      console.error("Error parsing admin info:", error);
      return false;
    }
  };
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Protected route for user welcome page
const ProtectedUserRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If user is not authenticated, redirect to home
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Main app wrapper to handle route-based modals
function MainAppContent() {
  const [isEventPopupOpen, setIsEventPopupOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [loginMHID, setLoginMHID] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Determine if login/register should be open based on the URL
  const [isUserLoginOpen, setIsUserLoginOpen] = useState(false);
  const [isUserRegisterOpen, setIsUserRegisterOpen] = useState(false);
  
  // Effect to handle URL changes
  useEffect(() => {
    // Redirect to welcome page if user is logged in and trying to access the home page
    if (user && (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register")) {
      navigate("/welcome");
      return;
    }
    
    if (location.pathname === "/login") {
      setIsUserLoginOpen(true);
      setIsUserRegisterOpen(false);
    } else if (location.pathname === "/register") {
      setIsUserRegisterOpen(true);
      setIsUserLoginOpen(false);
    } else {
      // If we're not on login or register routes, close the modals
      if (location.pathname !== "/login" && isUserLoginOpen) {
        setIsUserLoginOpen(false);
      }
      if (location.pathname !== "/register" && isUserRegisterOpen) {
        setIsUserRegisterOpen(false);
      }
    }
  }, [location.pathname, user, navigate]);
  
  const openEventPopup = () => {
    setIsEventPopupOpen(true);
  };
  
  const closeEventPopup = () => {
    setIsEventPopupOpen(false);
  };
  
  const openAdminLogin = () => {
    setIsAdminLoginOpen(true);
  };
  
  const closeAdminLogin = () => {
    setIsAdminLoginOpen(false);
  };
  
  const openUserLogin = () => {
    navigate("/login");
  };
  
  const closeUserLogin = () => {
    setIsUserLoginOpen(false);
    setLoginMHID(""); // Reset the MHID when closing
    navigate("/"); // Return to home page
  };
  
  const openUserRegister = () => {
    navigate("/register");
  };
  
  const closeUserRegister = () => {
    setIsUserRegisterOpen(false);
    navigate("/"); // Return to home page
  };
  
  // Function to handle redirect from registration to login
  const handleRegistrationComplete = (mhid) => {
    setLoginMHID(mhid); // Set the MHID to pass to login form
    navigate("/login"); // Navigate to login route
  };
  
  // Main content opacity is reduced when modals are open
  const mainContentOpacity = isEventPopupOpen || isAdminLoginOpen || isUserLoginOpen || isUserRegisterOpen ? 'opacity-20' : 'opacity-100';
  
  return (
    <>
      <div className={`relative ${mainContentOpacity}`}>
        <Routes>
          <Route path="/" element={
            <>
              <Header 
                onAdminLoginClick={openAdminLogin} 
                onUserLoginClick={openUserLogin}
                onUserRegisterClick={openUserRegister}
              />
              <HeroSection />
              <AboutSection />
              <EventGallery />
              <FeedbackSection />
              <Footer />
              <FloatingMenuButton onEventClick={openEventPopup} />
            </>
          } />
          <Route path="/login" element={
            <>
              <Header 
                onAdminLoginClick={openAdminLogin} 
                onUserLoginClick={openUserLogin}
                onUserRegisterClick={openUserRegister}
              />
              <HeroSection />
              <AboutSection />
              <EventGallery />
              <FeedbackSection />
              <Footer />
              <FloatingMenuButton onEventClick={openEventPopup} />
            </>
          } />
          <Route path="/register" element={
            <>
              <Header 
                onAdminLoginClick={openAdminLogin} 
                onUserLoginClick={openUserLogin}
                onUserRegisterClick={openUserRegister}
              />
              <HeroSection />
              <AboutSection />
              <EventGallery />
              <FeedbackSection />
              <Footer />
              <FloatingMenuButton onEventClick={openEventPopup} />
            </>
          } />
          <Route path="/HospitalityPage" element={<HospitalityPage />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/welcome" element={
            <ProtectedUserRoute>
              <WelcomePage />
            </ProtectedUserRoute>
          } />
          <Route path="/my-registrations" element={
          <ProtectedUserRoute>
            <UserRegistrationsComponent />
          </ProtectedUserRoute>
        } />
          <Route path="/dashboard" element={ 
            <ProtectedAdminRoute> 
              <Dashboard /> 
            </ProtectedAdminRoute>
          } />
          <Route path="/add-event" element={ 
            <ProtectedAdminRoute> 
              <AddEventForm /> 
            </ProtectedAdminRoute>
          } />
          <Route path="/view-events" element={ 
            <ProtectedAdminRoute> 
              <ViewEvents/> 
            </ProtectedAdminRoute>
          } />
          <Route path="/event-details/:id" element={ 
            <ProtectedAdminRoute> 
              <EventDetails/> 
            </ProtectedAdminRoute> 
          } />
          <Route path="/modify-events" element={ 
            <ProtectedAdminRoute> 
              <ModifyDetail/> 
            </ProtectedAdminRoute>
          } />
          <Route path="/modify-events/:id" element={ 
            <ProtectedAdminRoute> 
              <ModifyDetail/> 
            </ProtectedAdminRoute>
          } />
          <Route path="/edit-event/:id" element={
            <ProtectedAdminRoute> 
              <EditEventForm/> 
            </ProtectedAdminRoute>
          } />
          <Route path="/delete-events" element={
            <ProtectedAdminRoute> 
              <DeleteEvent/> 
            </ProtectedAdminRoute>
          } />
          <Route path="/delete-events/:id" element={
            <ProtectedAdminRoute> 
              <DeleteEvent/> 
            </ProtectedAdminRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      
      {isEventPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative w-11/12 max-w-4xl">
            <EventSection onClose={closeEventPopup} />
          </div>
        </div>
      )}
      
      {isAdminLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative w-11/12 max-w-md">
            <AdminLogin onClose={closeAdminLogin} />
          </div>
        </div>
      )}
      
      {isUserLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative w-11/12 max-w-md">
            <LoginPage 
              isOpen={isUserLoginOpen} 
              onClose={closeUserLogin} 
              initialMHID={loginMHID}
            />
          </div>
        </div>
      )}
      
      {isUserRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative w-11/12 max-w-3xl">
            <RegisterForm 
              isOpen={isUserRegisterOpen} 
              onClose={closeUserRegister} 
              openLoginForm={handleRegistrationComplete}
            />
          </div>
        </div>
      )}
    </>
  );
}

// Wrap everything with AuthProvider
function App() {
  return (
    <Router>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;