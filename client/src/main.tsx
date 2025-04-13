import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./hooks/use-auth";
import { EmergencyProvider } from "./hooks/use-emergency";
import { queryClient } from "./lib/queryClient";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <EmergencyProvider>
        <App />
      </EmergencyProvider>
    </AuthProvider>
  </QueryClientProvider>
);
