import { useState, useEffect, createContext, useContext } from "react";

const API_URL = "http://localhost:5000/api";

// ============================================================
// THEME & GLOBAL STYLES
// ============================================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #050810;
      --bg2: #080d1a;
      --bg3: #0c1225;
      --surface: #111827;
      --surface2: #1a2235;
      --border: #1e2d47;
      --border2: #2a3f5f;
      --accent: #00d4ff;
      --accent2: #7c3aed;
      --accent3: #06ffa5;
      --accent4: #ff6b35;
      --text: #e8f0fe;
      --text2: #94a3b8;
      --text3: #64748b;
      --danger: #ef4444;
      --success: #22c55e;
      --warning: #f59e0b;
      --font-display: 'Syne', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
      --font-body: 'Outfit', sans-serif;
      --glow: 0 0 30px rgba(0, 212, 255, 0.15);
      --glow2: 0 0 50px rgba(124, 58, 237, 0.2);
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      line-height: 1.6;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--accent2); border-radius: 2px; }

    .noise-bg {
      position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      background-repeat: repeat; background-size: 200px;
    }

    .grid-bg {
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background-image: linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
    }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes glow-pulse { 0%,100% { box-shadow: 0 0 20px rgba(0,212,255,0.3); } 50% { box-shadow: 0 0 40px rgba(0,212,255,0.6); } }
    @keyframes scan { 0% { top: -10%; } 100% { top: 110%; } }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    @keyframes border-rotate { to { --angle: 360deg; } }
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }

    .animate-fade-up { animation: fadeUp 0.6s ease forwards; }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-glow { animation: glow-pulse 2s ease-in-out infinite; }

    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 28px; border-radius: 8px; font-family: var(--font-display);
      font-size: 0.9rem; font-weight: 600; letter-spacing: 0.05em;
      cursor: pointer; transition: all 0.2s; border: none; text-decoration: none;
      position: relative; overflow: hidden; white-space: nowrap;
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: #fff; box-shadow: 0 4px 20px rgba(0,212,255,0.25);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,212,255,0.4); }
    .btn-outline {
      background: transparent; color: var(--accent);
      border: 1px solid var(--accent); 
    }
    .btn-outline:hover { background: rgba(0,212,255,0.1); transform: translateY(-2px); }
    .btn-ghost { background: var(--surface); color: var(--text2); border: 1px solid var(--border); }
    .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
    .btn-danger { background: var(--danger); color: #fff; }
    .btn-success { background: var(--success); color: #fff; }
    .btn-sm { padding: 8px 18px; font-size: 0.8rem; }
    .btn-lg { padding: 16px 36px; font-size: 1rem; }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s;
    }
    .card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: var(--glow); }

    .input {
      width: 100%; padding: 12px 16px;
      background: var(--bg3); border: 1px solid var(--border);
      border-radius: 8px; color: var(--text); font-family: var(--font-body);
      font-size: 0.95rem; outline: none; transition: all 0.2s;
    }
    .input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,212,255,0.1); }
    .input::placeholder { color: var(--text3); }
    .input-label { display: block; font-size: 0.85rem; color: var(--text2); margin-bottom: 6px; font-weight: 500; }

    .badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 4px 12px; border-radius: 100px; font-size: 0.75rem;
      font-weight: 600; font-family: var(--font-mono); letter-spacing: 0.05em;
    }
    .badge-cyan { background: rgba(0,212,255,0.1); color: var(--accent); border: 1px solid rgba(0,212,255,0.2); }
    .badge-purple { background: rgba(124,58,237,0.1); color: #a78bfa; border: 1px solid rgba(124,58,237,0.2); }
    .badge-green { background: rgba(6,255,165,0.1); color: var(--accent3); border: 1px solid rgba(6,255,165,0.2); }
    .badge-orange { background: rgba(255,107,53,0.1); color: var(--accent4); border: 1px solid rgba(255,107,53,0.2); }
    .badge-yellow { background: rgba(245,158,11,0.1); color: var(--warning); border: 1px solid rgba(245,158,11,0.2); }

    .tag { font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent); opacity: 0.6; }

    select.input option { background: var(--bg3); }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.8);
      backdrop-filter: blur(8px); z-index: 1000;
      display: flex; align-items: center; justify-content: center; padding: 20px;
      animation: fadeIn 0.2s ease;
    }
    .modal {
      background: var(--bg2); border: 1px solid var(--border2);
      border-radius: 20px; padding: 32px; width: 100%; max-width: 500px;
      max-height: 90vh; overflow-y: auto;
      animation: fadeUp 0.3s ease;
    }

    .toast {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      background: var(--surface2); border: 1px solid var(--border2);
      border-radius: 12px; padding: 16px 20px;
      display: flex; align-items: center; gap: 12px;
      animation: fadeUp 0.3s ease; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      min-width: 280px; max-width: 380px;
    }
    
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 14px 16px; text-align: left; border-bottom: 1px solid var(--border); }
    th { font-family: var(--font-mono); font-size: 0.75rem; color: var(--text3); text-transform: uppercase; letter-spacing: 0.08em; }
    td { font-size: 0.9rem; color: var(--text2); }
    tr:hover td { background: rgba(255,255,255,0.02); }

    .section-title {
      font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800; line-height: 1.1;
    }
    .gradient-text {
      background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .divider { height: 1px; background: linear-gradient(90deg, transparent, var(--border2), transparent); margin: 48px 0; }

    /* Responsive */
    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .modal { padding: 24px; }
    }
    @media (min-width: 769px) {
      .show-mobile { display: none !important; }
    }
  `}</style>
);

// ============================================================
// AUTH CONTEXT
// ============================================================
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("clint_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("clint_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("clint_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// TOAST
// ============================================================
const ToastContext = createContext(null);
const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const show = (message, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };
  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
  const colors = { success: "var(--success)", error: "var(--danger)", info: "var(--accent)", warning: "var(--warning)" };
  return (
    <ToastContext.Provider value={show}>
      {children}
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <span style={{ color: colors[t.type], fontSize: "1.2rem", fontWeight: "bold" }}>{icons[t.type]}</span>
          <span style={{ fontSize: "0.9rem" }}>{t.message}</span>
        </div>
      ))}
    </ToastContext.Provider>
  );
};

// ============================================================
// MOCK DATA
// ============================================================
const WORKSHOPS = [
  { id: 1, title: "Machine Learning Fundamentals", category: "AI", instructor: "Dr. Aisha Patel", duration: "2 Days", level: "Beginner", students: 120, rating: 4.9, price: "₹1,499", date: "Apr 12-13, 2025", seats: 30, color: "#00d4ff", icon: "🤖", tags: ["Python", "TensorFlow", "Neural Nets"] },
  { id: 2, title: "Full-Stack with Next.js 14", category: "Web Dev", instructor: "Rahul Sharma", duration: "3 Days", level: "Intermediate", students: 89, rating: 4.8, price: "₹1,999", date: "Apr 20-22, 2025", seats: 25, color: "#7c3aed", icon: "⚡", tags: ["React", "Node.js", "MongoDB"] },
  { id: 3, title: "Ethical Hacking & Pentesting", category: "Cybersecurity", instructor: "Marcus Chen", duration: "2 Days", level: "Advanced", students: 64, rating: 4.9, price: "₹2,499", date: "May 3-4, 2025", seats: 20, color: "#06ffa5", icon: "🛡️", tags: ["Kali Linux", "Metasploit", "OWASP"] },
  { id: 4, title: "Generative AI & LLMs", category: "AI", instructor: "Priya Nair", duration: "1 Day", level: "Intermediate", students: 156, rating: 4.7, price: "₹999", date: "Apr 26, 2025", seats: 40, color: "#ff6b35", icon: "✨", tags: ["GPT-4", "LangChain", "Prompting"] },
  { id: 5, title: "DevOps & Cloud Native", category: "Tools", instructor: "Arjun Mehta", duration: "2 Days", level: "Intermediate", students: 78, rating: 4.8, price: "₹1,799", date: "May 10-11, 2025", seats: 30, color: "#7c3aed", icon: "☁️", tags: ["Docker", "K8s", "AWS"] },
  { id: 6, title: "Network Security Mastery", category: "Cybersecurity", instructor: "Sara Kim", duration: "1 Day", level: "Advanced", students: 45, rating: 4.6, price: "₹1,299", date: "May 18, 2025", seats: 20, color: "#06ffa5", icon: "🔒", tags: ["Firewall", "IDS/IPS", "VPN"] },
];

const TESTIMONIALS = [
  { name: "Arnav Singh", college: "IIT Delhi", text: "CLiNt's AI workshop completely changed how I think about machine learning. The hands-on approach was incredible.", rating: 5, avatar: "AS" },
  { name: "Keya Patel", college: "BITS Pilani", text: "The full-stack workshop was worth every rupee. I landed a 12 LPA offer within a month of completing it.", rating: 5, avatar: "KP" },
  { name: "Rohan Verma", college: "NIT Warangal", text: "Best cybersecurity training I've attended. Real-world scenarios and expert instructors. Highly recommended!", rating: 5, avatar: "RV" },
  { name: "Ananya Rao", college: "VIT Vellore", text: "CLiNt brought the AI workshop to our campus. Over 200 students attended. The feedback was overwhelmingly positive.", rating: 5, avatar: "AR" },
];

const RESOURCES = [
  { id: 1, title: "ML Fundamentals - Complete Slides", type: "PDF", size: "12.4 MB", workshop: "Machine Learning Fundamentals", date: "2025-03-01" },
  { id: 2, title: "Next.js 14 Project Source Code", type: "ZIP", size: "8.2 MB", workshop: "Full-Stack with Next.js 14", date: "2025-03-05" },
  { id: 3, title: "Ethical Hacking Toolkit", type: "ZIP", size: "45.1 MB", workshop: "Ethical Hacking & Pentesting", date: "2025-03-10" },
  { id: 4, title: "GenAI Cheat Sheet", type: "PDF", size: "2.1 MB", workshop: "Generative AI & LLMs", date: "2025-03-12" },
  { id: 5, title: "Docker & K8s Config Templates", type: "ZIP", size: "1.8 MB", workshop: "DevOps & Cloud Native", date: "2025-03-15" },
];

const MOCK_WORKSHOP_REQUESTS = [
  { id: 1, college: "AKTU Lucknow", contact: "Dr. Sinha", email: "sinha@aktu.ac.in", topic: "AI", students: 200, location: "Lucknow, UP", status: "pending", date: "2025-03-15", message: "We want to conduct an AI workshop for our final year students." },
  { id: 2, college: "Amity University", contact: "Prof. Mehta", email: "mehta@amity.edu", topic: "Web Dev", students: 150, location: "Noida, UP", status: "approved", date: "2025-03-10", message: "Full-stack workshop for CSE department." },
  { id: 3, college: "LPU", contact: "Dr. Kumar", email: "kumar@lpu.in", topic: "Cybersecurity", students: 100, location: "Jalandhar, Punjab", status: "rejected", date: "2025-03-08", message: "Network security basics for IT students." },
];

const MOCK_STUDENTS = [
  { id: 1, name: "Arnav Singh", email: "arnav@email.com", college: "IIT Delhi", workshops: 3, joined: "2025-02-10" },
  { id: 2, name: "Keya Patel", email: "keya@email.com", college: "BITS Pilani", workshops: 2, joined: "2025-02-15" },
  { id: 3, name: "Rohan Verma", email: "rohan@email.com", college: "NIT Warangal", workshops: 1, joined: "2025-03-01" },
  { id: 4, name: "Ananya Rao", email: "ananya@email.com", college: "VIT Vellore", workshops: 4, joined: "2025-01-20" },
];

// ============================================================
// COMPONENTS
// ============================================================

// NAVBAR
const Navbar = ({ page, setPage }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Workshops", page: "workshops" },
    { label: "Resources", page: "resources" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(5,8,16,0.95)" : "transparent",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      transition: "all 0.3s", padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <button onClick={() => setPage("landing")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/CLiNtech_logo.png" alt="CLiNt Logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain" }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem", color: "var(--text)" }}>
            CLi<span style={{ color: "var(--accent)" }}>Nt</span>
          </span>
        </button>

        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {navLinks.map(l => (
            <button key={l.page} onClick={() => setPage(l.page)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: page === l.page ? "var(--accent)" : "var(--text2)",
              fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.95rem",
              transition: "color 0.2s",
            }}>{l.label}</button>
          ))}
        </div>

        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage(user.role === "admin" ? "admin" : "dashboard")}>
                {user.role === "admin" ? "⚙ Admin" : "📊 Dashboard"}
              </button>
              <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage("login")}>Login</button>
              <button className="btn btn-primary btn-sm" onClick={() => setPage("signup")}>Sign Up</button>
            </>
          )}
        </div>

        <button className="show-mobile" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "var(--text)", fontSize: "1.4rem", cursor: "pointer" }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {navLinks.map(l => (
            <button key={l.page} onClick={() => { setPage(l.page); setMenuOpen(false); }} style={{ background: "none", border: "none", color: "var(--text2)", fontFamily: "var(--font-body)", textAlign: "left", padding: "8px 0", cursor: "pointer" }}>{l.label}</button>
          ))}
          {user ? (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => { setPage(user.role === "admin" ? "admin" : "dashboard"); setMenuOpen(false); }}>Dashboard</button>
              <button className="btn btn-outline btn-sm" onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => { setPage("login"); setMenuOpen(false); }}>Login</button>
              <button className="btn btn-primary btn-sm" onClick={() => { setPage("signup"); setMenuOpen(false); }}>Sign Up</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

// WORKSHOP CARD
const WorkshopCard = ({ workshop, onBook }) => {
  const catColors = { AI: "cyan", "Web Dev": "purple", Cybersecurity: "green", Tools: "orange" };
  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: "24px 24px 16px", borderBottom: "1px solid var(--border)", background: `linear-gradient(135deg, ${workshop.color}08, transparent)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <span style={{ fontSize: "2rem" }}>{workshop.icon}</span>
          <span className={`badge badge-${catColors[workshop.category] || "cyan"}`}>{workshop.category}</span>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.15rem", marginBottom: 6, color: "var(--text)" }}>{workshop.title}</h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text3)" }}>by {workshop.instructor}</p>
      </div>
      <div style={{ padding: "16px 24px" }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text3)" }}>📅 {workshop.date}</span>
          <span style={{ fontSize: "0.8rem", color: "var(--text3)" }}>⏱ {workshop.duration}</span>
          <span style={{ fontSize: "0.8rem", color: "var(--text3)" }}>👥 {workshop.seats} seats</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {workshop.tags.map(t => <span key={t} style={{ fontSize: "0.7rem", padding: "2px 8px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{t}</span>)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem", color: workshop.color }}>{workshop.price}</span>
            <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>⭐ {workshop.rating} · {workshop.students} enrolled</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => onBook(workshop)}>Book Now</button>
        </div>
      </div>
    </div>
  );
};

// BOOKING MODAL
const BookingModal = ({ workshop, onClose }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", college: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) { toast("Please fill all required fields", "error"); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem("clint_token");
      const res = await fetch(`${API_URL}/workshops/${workshop.id}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, college: form.college })
      });
      const data = await res.json();
      if (!res.ok && res.status !== 400) { toast(data.message || "Booking failed", "error"); setLoading(false); return; }
    } catch (err) {}
    setLoading(false);
    setSuccess(true);
    toast("Workshop booked successfully!", "success");
  };

  if (success) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", marginBottom: 8 }}>Booking Confirmed!</h2>
        <p style={{ color: "var(--text2)", marginBottom: 8 }}>You've successfully enrolled in</p>
        <p style={{ color: "var(--accent)", fontWeight: 600, marginBottom: 24 }}>{workshop.title}</p>
        <p style={{ color: "var(--text3)", fontSize: "0.9rem", marginBottom: 24 }}>A confirmation email has been sent to {form.email}</p>
        <button className="btn btn-primary" onClick={onClose} style={{ width: "100%" }}>Close</button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem" }}>Book Workshop</h2>
            <p style={{ color: "var(--accent)", fontSize: "0.9rem" }}>{workshop.title}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text3)", fontSize: "1.4rem", cursor: "pointer" }}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { key: "name", label: "Full Name *", type: "text", placeholder: "Your full name" },
            { key: "email", label: "Email *", type: "email", placeholder: "your@email.com" },
            { key: "phone", label: "Phone *", type: "tel", placeholder: "+91 9876543210" },
            { key: "college", label: "College/Organization", type: "text", placeholder: "Your institution" },
          ].map(f => (
            <div key={f.key}>
              <label className="input-label">{f.label}</label>
              <input className="input" type={f.type} placeholder={f.placeholder} value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="input-label">Message (Optional)</label>
            <textarea className="input" placeholder="Any questions or requirements..." rows={3}
              value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              style={{ resize: "vertical" }} />
          </div>
          <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, fontSize: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ color: "var(--text3)" }}>Workshop Fee</span>
              <span style={{ color: "var(--text)", fontWeight: 600 }}>{workshop.price}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text3)" }}>Date</span>
              <span style={{ color: "var(--text2)" }}>{workshop.date}</span>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
            {loading ? <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// PAGES
// ============================================================

// LANDING PAGE
const LandingPage = ({ setPage }) => {
  const [bookingWorkshop, setBookingWorkshop] = useState(null);
  const [reqForm, setReqForm] = useState({ college: "", contact: "", email: "", topic: "", students: "", location: "", message: "" });
  const [reqLoading, setReqLoading] = useState(false);
  const toast = useToast();

  const handleReqSubmit = async (e) => {
    e.preventDefault();
    const { college, contact, email, topic } = reqForm;
    if (!college || !contact || !email || !topic) { toast("Please fill all required fields", "error"); return; }
    setReqLoading(true);
    try {
      const res = await fetch(`${API_URL}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college: reqForm.college,
          contactPerson: reqForm.contact,
          email: reqForm.email,
          phone: reqForm.phone,
          topic: reqForm.topic,
          expectedStudents: reqForm.students,
          location: reqForm.location,
          message: reqForm.message
        })
      });
      const data = await res.json();
      if (!res.ok) { toast(data.message || "Failed to submit", "error"); setReqLoading(false); return; }
      toast("Workshop request submitted! We'll contact you within 24 hours.", "success");
      setReqForm({ college: "", contact: "", email: "", topic: "", students: "", location: "", message: "" });
    } catch (err) {
      toast("Server error. Is backend running?", "error");
    }
    setReqLoading(false);
  };

  const stats = [
    { value: "50+", label: "Workshops Conducted" },
    { value: "10K+", label: "Students Trained" },
    { value: "200+", label: "Colleges Reached" },
    { value: "4.9★", label: "Average Rating" },
  ];

  const categories = [
    { icon: "🤖", name: "Artificial Intelligence", desc: "ML, Deep Learning, NLP, Generative AI, Computer Vision", color: "#00d4ff", count: "12 workshops" },
    { icon: "⚡", name: "Full-Stack Web Dev", desc: "React, Node.js, Next.js, Databases, REST APIs", color: "#7c3aed", count: "9 workshops" },
    { icon: "🛡️", name: "Cybersecurity", desc: "Ethical Hacking, Pentesting, Network Security, CTF", color: "#06ffa5", count: "8 workshops" },
    { icon: "🔧", name: "Developer Tools", desc: "DevOps, Docker, Git, Cloud, CI/CD Pipelines", color: "#ff6b35", count: "6 workshops" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", padding: "120px 24px 80px", overflow: "hidden" }}>
        {/* BG effects */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,212,255,0.12), transparent)" }} />
        <div style={{ position: "absolute", top: "20%", right: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(124,58,237,0.12), transparent)", borderRadius: "50%", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(6,255,165,0.08), transparent)", borderRadius: "50%", filter: "blur(40px)" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <span className="badge badge-cyan">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", animation: "pulse 2s infinite", display: "inline-block" }} />
                NOW ENROLLING — APRIL 2025 BATCH
              </span>
            </div>
            <h1 className="section-title animate-fade-up" style={{ marginBottom: 24 }}>
              Level Up Your
              <br />
              <span className="gradient-text">Tech Career</span>
              <br />
              with CLiNt
            </h1>
            <p style={{ color: "var(--text2)", fontSize: "1.15rem", marginBottom: 40, lineHeight: 1.7, maxWidth: 560, animationDelay: "0.1s" }} className="animate-fade-up">
              India's most hands-on technology workshop platform. Learn AI, Web Development, and Cybersecurity from industry experts who've built real products.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }} className="animate-fade-up">
              <button className="btn btn-primary btn-lg" onClick={() => setPage("workshops")}>
                Explore Workshops →
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => document.getElementById("request-section").scrollIntoView({ behavior: "smooth" })}>
                Request for College
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginTop: 64 }} className="animate-fade-up">
              {stats.map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.8rem", color: "var(--accent)" }}>{s.value}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text3)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "14px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 48, animation: "marquee 20s linear infinite", whiteSpace: "nowrap" }}>
          {[...Array(3)].fill(["🤖 Artificial Intelligence", "⚡ Full-Stack Web Dev", "🛡️ Cybersecurity", "☁️ DevOps & Cloud", "🔐 Ethical Hacking", "✨ Generative AI"]).flat().map((item, i) => (
            <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--text3)" }}>{item}</span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className="tag" style={{ marginBottom: 8 }}>// FOCUS_AREAS</p>
            <h2 className="section-title" style={{ marginBottom: 16 }}>What We Teach</h2>
            <p style={{ color: "var(--text2)", maxWidth: 500, margin: "0 auto" }}>Curriculum designed by engineers who've shipped products to millions of users.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {categories.map(cat => (
              <div key={cat.name} className="card" style={{ padding: 28, cursor: "pointer" }} onClick={() => setPage("workshops")}>
                <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>{cat.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: 8, color: cat.color }}>{cat.name}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text3)", lineHeight: 1.6, marginBottom: 16 }}>{cat.desc}</p>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: cat.color, opacity: 0.7 }}>{cat.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED WORKSHOPS */}
      <section style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p className="tag" style={{ marginBottom: 8 }}>// UPCOMING_WORKSHOPS</p>
              <h2 className="section-title">Featured <span className="gradient-text">Workshops</span></h2>
            </div>
            <button className="btn btn-outline" onClick={() => setPage("workshops")}>View All →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {WORKSHOPS.slice(0, 3).map(w => <WorkshopCard key={w.id} workshop={w} onBook={setBookingWorkshop} />)}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "100px 24px", background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className="tag" style={{ marginBottom: 8 }}>// TESTIMONIALS</p>
            <h2 className="section-title">Students Love <span className="gradient-text">CLiNt</span></h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="card" style={{ padding: 28 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {"⭐".repeat(t.rating).split("").map((s, i) => <span key={i} style={{ fontSize: "0.9rem" }}>{s}</span>)}
                </div>
                <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem" }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{t.college}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKSHOP REQUEST FORM */}
      <section id="request-section" style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p className="tag" style={{ marginBottom: 8 }}>// BOOK_FOR_COLLEGE</p>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Bring CLiNt to <span className="gradient-text">Your Campus</span></h2>
            <p style={{ color: "var(--text2)" }}>Fill out this form and our team will reach out within 24 hours.</p>
          </div>
          <div className="card" style={{ padding: 40 }}>
            <form onSubmit={handleReqSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[
                { key: "college", label: "College/University *", placeholder: "Your institution name", col: 2 },
                { key: "contact", label: "Contact Person *", placeholder: "Prof. / Dr. Name" },
                { key: "email", label: "Email *", type: "email", placeholder: "contact@college.edu" },
                { key: "location", label: "Location", placeholder: "City, State" },
                { key: "students", label: "Expected Students", type: "number", placeholder: "100" },
              ].map(f => (
                <div key={f.key} style={{ gridColumn: f.col === 2 ? "1 / -1" : undefined }}>
                  <label className="input-label">{f.label}</label>
                  <input className="input" type={f.type || "text"} placeholder={f.placeholder}
                    value={reqForm[f.key]} onChange={e => setReqForm(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="input-label">Workshop Topic *</label>
                <select className="input" value={reqForm.topic} onChange={e => setReqForm(p => ({ ...p, topic: e.target.value }))}>
                  <option value="">Select a topic</option>
                  <option>Artificial Intelligence</option>
                  <option>Full-Stack Web Development</option>
                  <option>Cybersecurity & Ethical Hacking</option>
                  <option>DevOps & Cloud</option>
                  <option>Generative AI & LLMs</option>
                  <option>Custom Topic</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="input-label">Message / Requirements</label>
                <textarea className="input" placeholder="Tell us about your requirements, preferred dates, etc." rows={4}
                  value={reqForm.message} onChange={e => setReqForm(p => ({ ...p, message: e.target.value }))}
                  style={{ resize: "vertical" }} />
              </div>
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn btn-primary btn-lg" type="submit" disabled={reqLoading} style={{ flex: 1, justifyContent: "center", minWidth: 200 }}>
                  {reqLoading ? "Submitting..." : "Submit Workshop Request →"}
                </button>
                <button className="btn btn-ghost" type="button" style={{ justifyContent: "center" }}>
                  ⬇ Download Brochure
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)", padding: "60px 24px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", marginBottom: 16 }}>CLi<span style={{ color: "var(--accent)" }}>Nt</span></div>
              <p style={{ color: "var(--text3)", fontSize: "0.9rem", lineHeight: 1.7 }}>Empowering the next generation of engineers through hands-on technology workshops.</p>
            </div>
            {[
              { title: "Platform", links: ["Workshops", "Resources", "Certificates"] },
              { title: "Company", links: ["About", "Careers", "Blog"] },
              { title: "Contact", links: ["hello@clint.dev", "+91 98765 43210", "Lucknow, India"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>{col.title}</h4>
                {col.links.map(l => <div key={l} style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: 8 }}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "var(--text3)", fontSize: "0.85rem" }}>© 2025 CLiNt Technologies. All rights reserved.</p>
            <div style={{ display: "flex", gap: 16 }}>
              {["Privacy", "Terms", "Cookies"].map(l => <span key={l} style={{ color: "var(--text3)", fontSize: "0.85rem", cursor: "pointer" }}>{l}</span>)}
            </div>
          </div>
        </div>
      </footer>

      {bookingWorkshop && <BookingModal workshop={bookingWorkshop} onClose={() => setBookingWorkshop(null)} />}
    </div>
  );
};

// WORKSHOPS PAGE
const WorkshopsPage = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [bookingWorkshop, setBookingWorkshop] = useState(null);
  const categories = ["All", "AI", "Web Dev", "Cybersecurity", "Tools"];

  const filtered = WORKSHOPS.filter(w =>
    (filter === "All" || w.category === filter) &&
    (w.title.toLowerCase().includes(search.toLowerCase()) || w.instructor.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight: "100vh", padding: "120px 24px 80px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <p className="tag" style={{ marginBottom: 8 }}>// ALL_WORKSHOPS</p>
          <h1 className="section-title" style={{ marginBottom: 16 }}>Explore <span className="gradient-text">Workshops</span></h1>
          <p style={{ color: "var(--text2)", fontSize: "1rem" }}>Choose from {WORKSHOPS.length} expert-led workshops across {categories.length - 1} categories</p>
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
          <input className="input" placeholder="Search workshops..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} className="btn btn-sm"
                style={{ background: filter === c ? "var(--accent)" : "var(--surface)", color: filter === c ? "var(--bg)" : "var(--text2)", border: `1px solid ${filter === c ? "var(--accent)" : "var(--border)"}` }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text3)" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
            <p>No workshops found matching your criteria</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {filtered.map(w => <WorkshopCard key={w.id} workshop={w} onBook={setBookingWorkshop} />)}
          </div>
        )}
      </div>
      {bookingWorkshop && <BookingModal workshop={bookingWorkshop} onClose={() => setBookingWorkshop(null)} />}
    </div>
  );
};

// LOGIN PAGE
const LoginPage = ({ setPage }) => {
  const { login } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast("Please enter credentials", "error"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await res.json();
      if (!res.ok) { toast(data.message || "Login failed", "error"); setLoading(false); return; }
      localStorage.setItem("clint_token", data.token);
      login(data.user);
      toast(`Welcome back, ${data.user.name}!`, "success");
      setPage(data.user.role === "admin" ? "admin" : "dashboard");
    } catch (err) {
      toast("Server error. Is backend running?", "error");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", marginBottom: 8 }}>CLi<span style={{ color: "var(--accent)" }}>Nt</span></div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.6rem", marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: "var(--text3)" }}>Sign in to your account</p>
        </div>
        <div className="card" style={{ padding: 36 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label className="input-label">Email</label>
              <input className="input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ justifyContent: "center" }}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
          <div className="divider" style={{ margin: "24px 0" }} />
          <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 14, fontSize: "0.8rem", color: "var(--text3)" }}>
            <div style={{ marginBottom: 4 }}>🔑 <strong style={{ color: "var(--text2)" }}>Demo Admin:</strong> admin@clint.dev / any password</div>
            <div>👤 <strong style={{ color: "var(--text2)" }}>Demo Student:</strong> any@email.com / any password</div>
          </div>
          <p style={{ textAlign: "center", marginTop: 20, color: "var(--text3)", fontSize: "0.9rem" }}>
            No account?{" "}
            <button onClick={() => setPage("signup")} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

// SIGNUP PAGE
const SignupPage = ({ setPage }) => {
  const { login } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "", college: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = form;
    if (!name || !email || !password) { toast("Please fill all required fields", "error"); return; }
    if (password.length < 6) { toast("Password must be at least 6 characters", "error"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, college: form.college, phone: form.phone })
      });
      const data = await res.json();
      if (!res.ok) { toast(data.message || "Registration failed", "error"); setLoading(false); return; }
      localStorage.setItem("clint_token", data.token);
      login(data.user);
      toast("Account created! Welcome to CLiNt 🎉", "success");
      setPage("dashboard");
    } catch (err) {
      toast("Server error. Is backend running?", "error");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", marginBottom: 8 }}>CLi<span style={{ color: "var(--accent)" }}>Nt</span></div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.6rem", marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: "var(--text3)" }}>Join 10,000+ students on CLiNt</p>
        </div>
        <div className="card" style={{ padding: 36 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { key: "name", label: "Full Name *", type: "text", placeholder: "Your full name" },
              { key: "email", label: "Email *", type: "email", placeholder: "your@email.com" },
              { key: "password", label: "Password *", type: "password", placeholder: "Min. 6 characters" },
              { key: "college", label: "College/University", type: "text", placeholder: "Your institution" },
              { key: "phone", label: "Phone", type: "tel", placeholder: "+91 9876543210" },
            ].map(f => (
              <div key={f.key}>
                <label className="input-label">{f.label}</label>
                <input className="input" type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ justifyContent: "center", marginTop: 4 }}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: 20, color: "var(--text3)", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <button onClick={() => setPage("login")} style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};

// STUDENT DASHBOARD
const DashboardPage = ({ setPage }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookingWorkshop, setBookingWorkshop] = useState(null);

  if (!user || user.role !== "student") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontFamily: "var(--font-display)", marginBottom: 12 }}>Access Restricted</h2>
          <p style={{ color: "var(--text3)", marginBottom: 24 }}>Please log in as a student to access the dashboard.</p>
          <button className="btn btn-primary" onClick={() => setPage("login")}>Login →</button>
        </div>
      </div>
    );
  }

  const enrolled = WORKSHOPS.slice(0, 2);
  const tabs = ["overview", "workshops", "certificates", "analytics", "profile"];

  const CertCard = ({ w }) => (
    <div className="card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
      <div>
        <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 4 }}>{w.title}</h4>
        <p style={{ fontSize: "0.85rem", color: "var(--text3)" }}>Completed · {w.date}</p>
        <p style={{ fontSize: "0.8rem", color: "var(--text3)", marginTop: 4 }}>Issued by CLiNt Technologies</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-outline btn-sm" onClick={() => { setPage("certificate"); toast("Opening certificate...", "info"); }}>View Certificate</button>
        <button className="btn btn-ghost btn-sm" onClick={() => toast("Certificate downloaded!", "success")}>⬇ Download</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", padding: "100px 24px 80px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p className="tag" style={{ marginBottom: 8 }}>// STUDENT_DASHBOARD</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem" }}>
              Hey, <span className="gradient-text">{user.name.split(" ")[0]}</span> 👋
            </h1>
            <p style={{ color: "var(--text3)" }}>{user.college || "CLiNt Student"}</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setPage("workshops")}>Browse Workshops</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 32, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              background: "none", border: "none", padding: "12px 20px",
              fontFamily: "var(--font-body)", fontWeight: 500, cursor: "pointer", textTransform: "capitalize",
              color: activeTab === t ? "var(--accent)" : "var(--text3)",
              borderBottom: activeTab === t ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: -1, transition: "all 0.2s",
            }}>{t}</button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
              {[
                { label: "Enrolled Workshops", value: "2", icon: "📚", color: "var(--accent)" },
                { label: "Completed", value: "1", icon: "✅", color: "var(--accent3)" },
                { label: "Certificates", value: "1", icon: "🏆", color: "var(--warning)" },
                { label: "Hours Learned", value: "16", icon: "⏱", color: "var(--accent2)" },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: 24 }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text3)" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", marginBottom: 20 }}>Your Workshops</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {enrolled.map(w => <WorkshopCard key={w.id} workshop={w} onBook={setBookingWorkshop} />)}
            </div>
          </div>
        )}

        {/* Workshops tab */}
        {activeTab === "workshops" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem" }}>My Workshops</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setPage("workshops")}>+ Enroll in New</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {enrolled.map(w => <WorkshopCard key={w.id} workshop={w} onBook={setBookingWorkshop} />)}
            </div>
          </div>
        )}

        {/* Certificates tab */}
        {activeTab === "certificates" && (
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", marginBottom: 24 }}>My Certificates</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <CertCard w={WORKSHOPS[0]} />
            </div>
            <div style={{ marginTop: 24, padding: 24, background: "var(--surface)", border: "1px dashed var(--border2)", borderRadius: 16, textAlign: "center", color: "var(--text3)" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>🎯</div>
              <p>Complete more workshops to earn certificates!</p>
              <button className="btn btn-outline btn-sm" style={{ marginTop: 16 }} onClick={() => setPage("workshops")}>Browse Workshops</button>
            </div>
          </div>
        )}

        {/* Overall Progress Ring */}
<div className="card" style={{ padding: 24, marginBottom: 20, display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
  <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
    <svg viewBox="0 0 140 140" width="140" height="140">
      <circle cx="70" cy="70" r="56" fill="none" stroke="var(--border)" strokeWidth="12" />
      <circle cx="70" cy="70" r="56" fill="none" stroke="var(--accent)" strokeWidth="12"
        strokeDasharray={`${2 * Math.PI * 56 * 0.67} ${2 * Math.PI * 56}`}
        strokeDashoffset={2 * Math.PI * 56 * 0.25}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
    </svg>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.8rem", color: "var(--accent)" }}>67%</div>
      <div style={{ fontSize: "0.7rem", color: "var(--text3)" }}>Overall</div>
    </div>
  </div>
  <div style={{ flex: 1, minWidth: 200 }}>
    <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>Learning Progress</h4>
    <p style={{ fontSize: "0.85rem", color: "var(--text3)", marginBottom: 16 }}>You are making great progress! Complete 2 more workshops to unlock your next badge.</p>
    {[
      { label: "Workshops Completed", value: "1 / 3", color: "var(--success)" },
      { label: "Certificates Earned", value: "1", color: "var(--warning)" },
      { label: "Total Hours", value: "38h / 56h", color: "var(--accent)" },
    ].map(s => (
      <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text3)" }}>{s.label}</span>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: s.color }}>{s.value}</span>
      </div>
    ))}
  </div>
</div>

        {/* Analytics */}
        {activeTab === "analytics" && (
  <div>
    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", marginBottom: 24 }}>Course Completion Analyser</h3>
    
    {/* Metric Cards */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, marginBottom: 24 }}>
      {[
        { label: "Overall Completion", value: "67%", color: "var(--success)" },
        { label: "Workshops Enrolled", value: "3", color: "var(--accent)" },
        { label: "Avg Score", value: "87%", color: "var(--accent2)" },
        { label: "Hours Learned", value: "38h", color: "var(--warning)" },
      ].map(s => (
        <div key={s.label} className="card" style={{ padding: 20, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", color: s.color }}>{s.value}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text3)", marginTop: 4 }}>{s.label}</div>
        </div>
      ))}
    </div>

    {/* Progress Bars */}
    <div className="card" style={{ padding: 24, marginBottom: 20 }}>
      <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 20 }}>Progress per Workshop</h4>
      {[
        { name: "AI & ML Fundamentals", progress: 100, color: "var(--success)", status: "Completed" },
        { name: "React & Next.js Masterclass", progress: 65, color: "var(--accent)", status: "In Progress" },
        { name: "Ethical Hacking & Pentesting", progress: 30, color: "var(--warning)", status: "Started" },
      ].map(w => (
        <div key={w.name} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ minWidth: 200, fontSize: "0.85rem", color: "var(--text2)" }}>{w.name}</div>
          <div style={{ flex: 1, height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${w.progress}%`, height: "100%", background: w.color, borderRadius: 4, transition: "width 1s ease" }} />
          </div>
          <div style={{ minWidth: 40, fontSize: "0.85rem", fontWeight: 600, color: w.color }}>{w.progress}%</div>
          <span style={{ fontSize: "0.75rem", padding: "2px 10px", borderRadius: 20, background: `${w.color}20`, color: w.color }}>{w.status}</span>
        </div>
      ))}
    </div>

    {/* Score Tracker */}
    <div className="card" style={{ padding: 24 }}>
      <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 16 }}>Score & Grade Tracker</h4>
      {[
        { name: "AI & ML Fundamentals", date: "Jan 20, 2026", score: "92%", grade: "A+", color: "var(--success)" },
        { name: "React & Next.js Masterclass", date: "In Progress", score: "82%", grade: "B+", color: "var(--accent)" },
        { name: "Ethical Hacking & Pentesting", date: "In Progress", score: "—", grade: "Pending", color: "var(--warning)" },
      ].map(w => (
        <div key={w.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{w.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{w.date}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: w.color }}>{w.score}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>Grade {w.grade}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        {/* Time Chart */}
<div className="card" style={{ padding: 24, marginTop: 20 }}>
  <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 16 }}>Time Spent Learning</h4>
  <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
    {[
      { name: "AI & ML", hours: 24, color: "var(--success)", pct: 63 },
      { name: "React & Next.js", hours: 10, color: "var(--accent)", pct: 26 },
      { name: "Ethical Hacking", hours: 4, color: "var(--warning)", pct: 11 },
    ].map(w => (
      <div key={w.name} style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 200 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${w.color}20`, border: `3px solid ${w.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem", color: w.color }}>{w.pct}%</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{w.name}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text3)" }}>{w.hours} hours</div>
        </div>
      </div>
    ))}
  </div>
  <div style={{ marginTop: 20 }}>
    {[
      { name: "AI & ML Fundamentals", hours: 24, total: 38, color: "var(--success)" },
      { name: "React & Next.js", hours: 10, total: 38, color: "var(--accent)" },
      { name: "Ethical Hacking", hours: 4, total: 38, color: "var(--warning)" },
    ].map(w => (
      <div key={w.name} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 12, height: 12, borderRadius: 2, background: w.color, flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: "0.85rem", color: "var(--text2)" }}>{w.name}</div>
        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: w.color }}>{w.hours}h</div>
        <div style={{ width: 120, height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${(w.hours/w.total)*100}%`, height: "100%", background: w.color, borderRadius: 3 }} />
        </div>
      </div>
    ))}
  </div>
</div>

        {/* Profile tab */}
        {activeTab === "profile" && (
          <div className="card" style={{ padding: 32, maxWidth: 500 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", marginBottom: 24 }}>Profile Information</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "Full Name", value: user.name },
                { label: "Email", value: user.email },
                { label: "College", value: user.college || "Not provided" },
                { label: "Role", value: "Student" },
              ].map(f => (
                <div key={f.label}>
                  <label className="input-label">{f.label}</label>
                  <input className="input" defaultValue={f.value} readOnly style={{ cursor: "default", opacity: 0.8 }} />
                </div>
              ))}
              <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={() => toast("Profile saved!", "success")}>Save Changes</button>
            </div>
          </div>
        )}
      </div>
      {bookingWorkshop && <BookingModal workshop={bookingWorkshop} onClose={() => setBookingWorkshop(null)} />}
    </div>
  );
};

// RESOURCES PAGE
const ResourcesPage = () => {
  const toast = useToast();
  const typeColors = { PDF: "cyan", ZIP: "purple" };
  const typeIcons = { PDF: "📄", ZIP: "🗜️" };

  return (
    <div style={{ minHeight: "100vh", padding: "120px 24px 80px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <p className="tag" style={{ marginBottom: 8 }}>// LEARNING_RESOURCES</p>
          <h1 className="section-title" style={{ marginBottom: 16 }}>Workshop <span className="gradient-text">Resources</span></h1>
          <p style={{ color: "var(--text2)" }}>Download slides, code samples, and toolkits from our workshops.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {RESOURCES.map(r => (
            <div key={r.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
                <span style={{ fontSize: "2rem" }}>{typeIcons[r.type]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 4 }}>{r.title}</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--text3)", marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.workshop}</p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className={`badge badge-${typeColors[r.type]}`}>{r.type}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{r.size}</span>
                  </div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={() => toast(`Downloading ${r.title}...`, "info")}>
                ⬇ Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// CERTIFICATE PAGE
const CertificatePage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const certUser = user || { name: "Demo Student" };
  const workshop = WORKSHOPS[0];

  return (
    <div style={{ minHeight: "100vh", padding: "120px 24px 80px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p className="tag" style={{ marginBottom: 8 }}>// CERTIFICATE_OF_COMPLETION</p>
            <h1 className="section-title">Your Certificate</h1>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-outline" onClick={() => toast("Certificate downloaded as PDF!", "success")}>⬇ Download PDF</button>
            <button className="btn btn-ghost" onClick={() => toast("Link copied!", "success")}>🔗 Share</button>
          </div>
        </div>

        {/* Certificate */}
        <div style={{
          background: "linear-gradient(135deg, #080d1a, #0c1225)",
          border: "2px solid var(--border2)", borderRadius: 20, padding: "60px 48px",
          position: "relative", overflow: "hidden", textAlign: "center",
          boxShadow: "0 0 80px rgba(0,212,255,0.1)",
        }}>
          {/* Decorative corners */}
          {[["0,0", "0,0"], ["0,100%", "0,-100%"], ["100%,0", "-100%,0"], ["100%,100%", "-100%,-100%"]].map(([pos, trans], i) => (
            <div key={i} style={{
              position: "absolute",
              top: pos.split(",")[1] === "0" ? 20 : undefined,
              bottom: pos.split(",")[1] !== "0" ? 20 : undefined,
              left: pos.split(",")[0] === "0" ? 20 : undefined,
              right: pos.split(",")[0] !== "0" ? 20 : undefined,
              width: 60, height: 60,
              borderTop: i < 2 ? "2px solid var(--accent)" : undefined,
              borderBottom: i >= 2 ? "2px solid var(--accent)" : undefined,
              borderLeft: i === 0 || i === 2 ? "2px solid var(--accent)" : undefined,
              borderRight: i === 1 || i === 3 ? "2px solid var(--accent)" : undefined,
              opacity: 0.4,
            }} />
          ))}

          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text3)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16 }}>CLiNt Technologies Presents</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.8rem, 5vw, 3rem)", color: "var(--accent)", marginBottom: 8 }}>Certificate of Completion</div>
          <div style={{ width: 80, height: 2, background: "linear-gradient(90deg, transparent, var(--accent), transparent)", margin: "0 auto 32px" }} />
          <p style={{ color: "var(--text3)", marginBottom: 8 }}>This is to certify that</p>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.4rem, 4vw, 2.2rem)", color: "var(--text)", marginBottom: 8 }}>{certUser.name}</div>
          <p style={{ color: "var(--text3)", marginBottom: 8 }}>has successfully completed the workshop</p>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.3rem", color: workshop.color, marginBottom: 8 }}>{workshop.title}</div>
          <p style={{ color: "var(--text3)", fontSize: "0.9rem", marginBottom: 32 }}>conducted on {workshop.date} · Duration: {workshop.duration}</p>

          <div style={{ display: "flex", justifyContent: "center", gap: 60, marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: 4 }}>{workshop.instructor}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Workshop Instructor</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", marginBottom: 4 }}>CLiNt Team</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>CLiNt Technologies</div>
            </div>
          </div>

          <div style={{ marginTop: 24, fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text3)" }}>
            Certificate ID: CLiNt-{workshop.id}-{Date.now().toString(36).toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

// ADMIN DASHBOARD
const AdminDashboard = ({ setPage }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [requests, setRequests] = useState([]);
  const [students, setStudents] = useState([]);
  const [uploadModal, setUploadModal] = useState(false);
  const [certModal, setCertModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("clint_token");
    fetch(`${API_URL}/requests`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setRequests(d.requests); })
      .catch(() => setRequests(MOCK_WORKSHOP_REQUESTS));
    fetch(`${API_URL}/admin/students`, { headers: { "Authorization": `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setStudents(d.students); })
      .catch(() => setStudents(MOCK_STUDENTS));
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔐</div>
          <h2 style={{ fontFamily: "var(--font-display)", marginBottom: 12 }}>Admin Access Only</h2>
          <p style={{ color: "var(--text3)", marginBottom: 24 }}>Please log in as admin@clint.dev to access this panel.</p>
          <button className="btn btn-primary" onClick={() => setPage("login")}>Login as Admin →</button>
        </div>
      </div>
    );
  }

  const handleStatus = async (id, status) => {
    const token = localStorage.getItem("clint_token");
    try {
      const res = await fetch(`${API_URL}/requests/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) setRequests(p => p.map(r => r._id === id || r.id === id ? { ...r, status } : r));
    } catch (err) {
      setRequests(p => p.map(r => r._id === id || r._id === id ? { ...r, status } : r));
    }
    toast(status === "approved" ? "Request approved! Email sent to college." : "Request rejected.", status === "approved" ? "success" : "error");
  };

  const stats = [
    { label: "Total Requests", value: requests.length, icon: "📨", color: "var(--accent)" },
    { label: "Pending", value: requests.filter(r => r.status === "pending").length, icon: "⏳", color: "var(--warning)" },
    { label: "Approved", value: requests.filter(r => r.status === "approved").length, icon: "✅", color: "var(--success)" },
    { label: "Students", value: students.length, icon: "👥", color: "var(--accent2)" },
  ];

  const tabs = ["overview", "requests", "students", "workshops", "materials"];

  const StatusBadge = ({ status }) => {
    const map = { pending: ["badge-yellow", "Pending"], approved: ["badge-green", "Approved"], rejected: ["badge-orange", "Rejected"] };
    const [cls, label] = map[status] || ["badge-cyan", status];
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  return (
    <div style={{ minHeight: "100vh", padding: "100px 24px 80px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p className="tag" style={{ marginBottom: 8 }}>// ADMIN_CONTROL_PANEL</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem" }}>Admin <span className="gradient-text">Dashboard</span></h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setCertModal(true)}>🏆 Generate Certificate</button>
            <button className="btn btn-ghost btn-sm" onClick={() => toast("Email notifications sent!", "success")}>📧 Send Notifications</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          {stats.map(s => (
            <div key={s.label} className="card" style={{ padding: 20 }}>
              <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text3)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              background: "none", border: "none", padding: "12px 20px", whiteSpace: "nowrap",
              fontFamily: "var(--font-body)", fontWeight: 500, cursor: "pointer", textTransform: "capitalize",
              color: activeTab === t ? "var(--accent)" : "var(--text3)",
              borderBottom: activeTab === t ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: -1, transition: "all 0.2s",
            }}>{t}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="card" style={{ padding: 24, gridColumn: "1 / -1" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, marginBottom: 16 }}>Recent Workshop Requests</h3>
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead><tr><th>College</th><th>Topic</th><th>Students</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {requests.slice(0, 3).map(r => (
                      <tr key={r.id}>
                        <td><div style={{ fontWeight: 500, color: "var(--text)" }}>{r.college}</div><div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{r.contact}</div></td>
                        <td><span className="badge badge-cyan">{r.topic}</span></td>
                        <td>{r.students}</td>
                        <td><StatusBadge status={r.status} /></td>
                        <td>
                          {r.status === "pending" && (
                            <div style={{ display: "flex", gap: 8 }}>
                              <button className="btn btn-success btn-sm" onClick={() => handleStatus(r._id || r.id, "approved")}>✓ Approve</button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleStatus(r._id || r.id, "rejected")}>✕</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* REQUESTS */}
        {activeTab === "requests" && (
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Workshop Requests ({requests.length})</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead><tr><th>College</th><th>Contact</th><th>Topic</th><th>Students</th><th>Location</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 500, color: "var(--text)" }}>{r.college}</td>
                      <td><div>{r.contact}</div><div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{r.email}</div></td>
                      <td><span className="badge badge-cyan">{r.topic}</span></td>
                      <td>{r.students}</td>
                      <td style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.location}</td>
                      <td>{r.date}</td>
                      <td><StatusBadge status={r.status} /></td>
                      <td>
                        {r.status === "pending" && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-success btn-sm" onClick={() => handleStatus(r.id, "approved")}>✓</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleStatus(r.id, "rejected")}>✕</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STUDENTS */}
        {activeTab === "students" && (
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Registered Students ({MOCK_STUDENTS.length})</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>College</th><th>Workshops</th><th>Joined</th><th>Actions</th></tr></thead>
                <tbody>
                  {MOCK_STUDENTS.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 500, color: "var(--text)" }}>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.college}</td>
                      <td><span className="badge badge-purple">{s.workshops}</span></td>
                      <td>{s.joined}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => toast(`Email sent to ${s.name}`, "success")}>📧 Email</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WORKSHOPS */}
        {activeTab === "workshops" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Manage Workshops</h3>
              <button className="btn btn-primary btn-sm" onClick={() => toast("Workshop creation panel opening...", "info")}>+ Add Workshop</button>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              <table>
                <thead><tr><th>Workshop</th><th>Category</th><th>Date</th><th>Seats</th><th>Enrolled</th><th>Status</th></tr></thead>
                <tbody>
                  {WORKSHOPS.map(w => (
                    <tr key={w.id}>
                      <td style={{ fontWeight: 500, color: "var(--text)" }}>{w.title}</td>
                      <td><span className="badge badge-cyan">{w.category}</span></td>
                      <td>{w.date}</td>
                      <td>{w.seats}</td>
                      <td>{w.students}</td>
                      <td><span className="badge badge-green">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MATERIALS */}
        {activeTab === "materials" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>Workshop Materials</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setUploadModal(true)}>⬆ Upload Material</button>
            </div>
            <div className="card" style={{ overflow: "hidden" }}>
              <table>
                <thead><tr><th>Title</th><th>Type</th><th>Workshop</th><th>Size</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {RESOURCES.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 500, color: "var(--text)" }}>{r.title}</td>
                      <td><span className={`badge badge-${r.type === "PDF" ? "cyan" : "purple"}`}>{r.type}</span></td>
                      <td style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text3)", fontSize: "0.85rem" }}>{r.workshop}</td>
                      <td>{r.size}</td>
                      <td>{r.date}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => toast("Material deleted", "error")}>🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <div className="modal-overlay" onClick={() => setUploadModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem" }}>Upload Material</h2>
              <button onClick={() => setUploadModal(false)} style={{ background: "none", border: "none", color: "var(--text3)", fontSize: "1.4rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[{ label: "Title", placeholder: "e.g., ML Workshop Slides" }, { label: "Workshop", placeholder: "Associated workshop" }].map(f => (
                <div key={f.label}>
                  <label className="input-label">{f.label}</label>
                  <input className="input" placeholder={f.placeholder} />
                </div>
              ))}
              <div>
                <label className="input-label">File Type</label>
                <select className="input"><option>PDF</option><option>ZIP</option><option>Video</option></select>
              </div>
              <div style={{ border: "2px dashed var(--border2)", borderRadius: 12, padding: 40, textAlign: "center", cursor: "pointer", color: "var(--text3)" }}>
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>⬆</div>
                <p>Click to upload or drag & drop</p>
                <p style={{ fontSize: "0.8rem", marginTop: 4 }}>PDF, ZIP, MP4 up to 500MB</p>
              </div>
              <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={() => { setUploadModal(false); toast("Material uploaded successfully!", "success"); }}>Upload Material</button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Generation Modal */}
      {certModal && (
        <div className="modal-overlay" onClick={() => setCertModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem" }}>Generate Certificates</h2>
              <button onClick={() => setCertModal(false)} style={{ background: "none", border: "none", color: "var(--text3)", fontSize: "1.4rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="input-label">Select Workshop</label>
                <select className="input">{WORKSHOPS.map(w => <option key={w.id}>{w.title}</option>)}</select>
              </div>
              <div>
                <label className="input-label">Generate For</label>
                <select className="input"><option>All Participants</option><option>Specific Student</option></select>
              </div>
              <div style={{ background: "var(--bg3)", borderRadius: 8, padding: 14, fontSize: "0.85rem", color: "var(--text2)" }}>
                This will generate PDF certificates for all enrolled participants and notify them via email.
              </div>
              <button className="btn btn-primary" style={{ justifyContent: "center" }} onClick={() => { setCertModal(false); toast("Certificates generated & emails sent!", "success"); }}>
                🏆 Generate & Send Certificates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// ============================================================
// CLINT AI CHATBOT
// ============================================================
const CLiNtChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey! I'm CLiNt AI 👋 Ask me anything about our workshops, enrollment, certificates, or tech topics!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useState(null);

  const SYSTEM_PROMPT = `You are CLiNt AI, a helpful assistant for CLiNt — a tech workshop platform for engineering students.
CLiNt offers workshops in: AI & Machine Learning, Full-Stack Web Development, Cybersecurity & Ethical Hacking, and Developer Tools (Docker, DevOps).
Workshop prices range from ₹2,499 to ₹4,999. Duration: 2-5 days.
You help students with: workshop info, enrollment, certificates, tech doubts, career advice, and coding questions.
Keep answers concise, friendly, and helpful. Use emojis occasionally. If asked about pricing/enrollment, direct them to the Workshops page.`;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text
      }));

      const res = await fetch(`${API_URL}/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: userMsg, history: messages.slice(-6) })
});
const data = await res.json();
const reply = data.reply || "Sorry, I couldn't process that. Try again!";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", text: "Oops! Something went wrong. Please try again 🙏" }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const quickQuestions = [
    "What workshops do you offer?",
    "How to get a certificate?",
    "What is the fee for AI workshop?",
    "How to enroll?"
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: "2rem", right: "2rem", zIndex: 1000,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--accent), var(--accent2))",
          border: "none", cursor: "pointer", fontSize: "1.4rem",
          boxShadow: "0 4px 20px rgba(0,212,255,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s"
        }}
        onMouseOver={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: "fixed", bottom: "5.5rem", right: "2rem", zIndex: 999,
          width: 360, height: 500, background: "var(--bg2)",
          border: "1px solid var(--border)", borderRadius: 16,
          display: "flex", flexDirection: "column", overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 16px", borderBottom: "1px solid var(--border)",
            background: "linear-gradient(135deg, rgba(0,212,255,0.1), rgba(124,58,237,0.1))",
            display: "flex", alignItems: "center", gap: 10
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem"
            }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>CLiNt AI</div>
              <div style={{ fontSize: "0.7rem", color: "var(--success)" }}>● Online</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 14px", borderRadius: 12,
                  fontSize: "0.82rem", lineHeight: 1.6,
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, var(--accent), var(--accent2))"
                    : "var(--bg3)",
                  color: msg.role === "user" ? "#000" : "var(--text)",
                  borderBottomRightRadius: msg.role === "user" ? 4 : 12,
                  borderBottomLeftRadius: msg.role === "assistant" ? 4 : 12,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: "var(--bg3)", padding: "10px 14px", borderRadius: 12, fontSize: "0.82rem", color: "var(--text3)" }}>
                  CLiNt AI is typing...
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div style={{ padding: "0 12px 8px", display: "flex", flexWrap: "wrap", gap: 6 }}>
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => { setInput(q); }}
                  style={{
                    background: "var(--bg3)", border: "1px solid var(--border)",
                    color: "var(--text2)", padding: "4px 10px", borderRadius: 20,
                    fontSize: "0.7rem", cursor: "pointer", fontFamily: "inherit"
                  }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything..."
              style={{
                flex: 1, background: "var(--bg3)", border: "1px solid var(--border)",
                color: "var(--text)", padding: "8px 12px", borderRadius: 8,
                fontSize: "0.8rem", fontFamily: "inherit", outline: "none"
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: "var(--accent)", border: "none", color: "#000",
                width: 36, height: 36, borderRadius: 8, cursor: "pointer",
                fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
                opacity: loading || !input.trim() ? 0.5 : 1
              }}
            >→</button>
          </div>
        </div>
      )}
    </>
  );
};

// ============================================================
// APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("landing");

  const renderPage = () => {
    switch (page) {
      case "landing": return <LandingPage setPage={setPage} />;
      case "workshops": return <WorkshopsPage />;
      case "login": return <LoginPage setPage={setPage} />;
      case "signup": return <SignupPage setPage={setPage} />;
      case "dashboard": return <DashboardPage setPage={setPage} />;
      case "admin": return <AdminDashboard setPage={setPage} />;
      case "resources": return <ResourcesPage />;
      case "certificate": return <CertificatePage />;
      default: return <LandingPage setPage={setPage} />;
    }
  };

  return (
    <AuthProvider>
      <ToastProvider>
        <GlobalStyles />
        <div className="noise-bg" />
        <div className="grid-bg" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Navbar page={page} setPage={setPage} />
          {renderPage()}
          <CLiNtChatbot />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}