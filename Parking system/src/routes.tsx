import { createBrowserRouter } from "react-router";
import { LandingPage } from "./components/LandingPage";
import { UserMapView } from "./components/user/UserMapView";
import { UserLogin } from "./components/user/UserLogin";
import { PaymentSelection } from "./components/user/PaymentSelection";
import { DigitalReceipt } from "./components/user/DigitalReceipt";
import { AgentLogin } from "./components/agent/AgentLogin";
import { AgentDashboard } from "./components/agent/AgentDashboard";
import { AdminDashboard } from "./components/admin/AdminDashboard";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/user/map", Component: UserMapView },
  { path: "/user/login", Component: UserLogin },
  { path: "/user/payment", Component: PaymentSelection },
  { path: "/user/receipt", Component: DigitalReceipt },
  { path: "/agent/login", Component: AgentLogin },
  { path: "/agent/dashboard", Component: AgentDashboard },
  { path: "/admin", Component: AdminDashboard },
]);
