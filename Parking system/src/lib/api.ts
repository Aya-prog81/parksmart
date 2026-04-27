/**
 * Thin fetch wrapper that talks to the FastAPI backend.
 * Automatically attaches the JWT stored in localStorage (key: "ifrane.token").
 */

const BASE_URL =
  ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:8000";

const TOKEN_KEY = "ifrane.token";
const USER_KEY = "ifrane.user";

export interface ApiUser {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  role: "user" | "agent" | "admin";
  agent_code?: string | null;
  assigned_lot_id?: number | null;
  created_at: string;
}

export interface ApiLot {
  id: number;
  name: string;
  zone: string;
  capacity: number;
  available: number;
  price_per_hour: number;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
}

export interface ApiReservation {
  id: number;
  booking_id: string;
  user_id: number;
  lot_id: number;
  start_time: string;
  duration_hours: number;
  amount: number;
  status: "active" | "completed" | "cancelled";
  payment_method: string;
  created_at: string;
  lot?: ApiLot;
  user?: ApiUser;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: ApiUser;
}

export interface AnalyticsSummary {
  total_users: number;
  total_lots: number;
  total_capacity: number;
  total_occupied: number;
  total_reservations: number;
  today_reservations: number;
  today_revenue: number;
  occupancy_by_lot: Array<{
    lot_id: number;
    name: string;
    capacity: number;
    available: number;
    occupied: number;
    occupancy_rate: number;
  }>;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const auth = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(t: string) {
    localStorage.setItem(TOKEN_KEY, t);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser(): ApiUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as ApiUser) : null;
  },
  setUser(u: ApiUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  },
};

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = auth.getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.detail || data.message)) ||
      res.statusText ||
      "Request failed";
    throw new ApiError(
      typeof message === "string" ? message : JSON.stringify(message),
      res.status,
    );
  }
  return data as T;
}

export const api = {
  // --- auth ---
  async register(body: {
    full_name: string;
    email: string;
    phone?: string;
    password: string;
  }) {
    const data = await request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
    auth.setToken(data.access_token);
    auth.setUser(data.user);
    return data;
  },

  async login(body: { email: string; password: string }) {
    const data = await request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
    auth.setToken(data.access_token);
    auth.setUser(data.user);
    return data;
  },

  async agentLogin(body: { agent_code: string; password: string }) {
    const data = await request<AuthResponse>("/auth/agent/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
    auth.setToken(data.access_token);
    auth.setUser(data.user);
    return data;
  },

  async me() {
    return request<ApiUser>("/auth/me");
  },

  logout() {
    auth.clearToken();
  },

  // --- lots ---
  listLots() {
    return request<ApiLot[]>("/lots");
  },
  getLot(id: number) {
    return request<ApiLot>(`/lots/${id}`);
  },

  // --- reservations ---
  createReservation(body: {
    lot_id: number;
    duration_hours: number;
    payment_method?: string;
  }) {
    return request<ApiReservation>("/reservations", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },
  myReservations() {
    return request<ApiReservation[]>("/reservations/me");
  },
  cancelReservation(id: number) {
    return request<ApiReservation>(`/reservations/${id}/cancel`, {
      method: "POST",
    });
  },

  // --- agent ---
  agentLot() {
    return request<ApiLot>("/agent/my-lot");
  },
  agentEnter() {
    return request<{ lot: ApiLot; action: string; occupied: number }>(
      "/agent/enter",
      { method: "POST" },
    );
  },
  agentExit() {
    return request<{ lot: ApiLot; action: string; occupied: number }>(
      "/agent/exit",
      { method: "POST" },
    );
  },

  // --- admin ---
  adminUsers() {
    return request<ApiUser[]>("/admin/users");
  },
  adminAgents() {
    return request<ApiUser[]>("/admin/agents");
  },
  adminAnalytics() {
    return request<AnalyticsSummary>("/admin/analytics");
  },
  adminReservations() {
    return request<ApiReservation[]>("/reservations");
  },
};
