import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";  // Assuming auth context exists
import { SessionProvider } from "./contexts/SessionContext";  // Assuming session context

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// Add this useEffect for guest mode (if not in App.tsx)
import { useEffect, useState } from "react";  // If not already imported

// In a top-level component or App.tsx useEffect
useEffect(() => {
  const fetchSession = async () => {
    try {
      const response = await fetch("/api/session");
      if (response.ok) {
        const data = await response.json();
        // Set session data...
      } else {
        // Guest mode fallback
        console.log("Guest mode - no auth");
        // Set anonymous session (e.g., { user: null, session: { score: 0, streak: 0 } })
      }
    } catch (error) {
      console.error("Session fetch error:", error);
      // Fallback to guest
    }
  };

  fetchSession();
}, []);
