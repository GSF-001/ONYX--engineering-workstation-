import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { SocketProvider } from "./websocket";
import { ErrorBoundary } from "./shared/components";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
