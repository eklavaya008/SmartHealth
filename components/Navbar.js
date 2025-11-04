import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { CalendarCheck2, Menu, X } from "lucide-react";

const NavLink = ({ href, children, onClick }) => {
  const router = useRouter();
  const active = router.pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="container-responsive py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white"
            style={{ backgroundImage: "linear-gradient(135deg, #2563eb, #7c3aed)" }}>
            <CalendarCheck2 size={18} />
          </span>
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#111827,#0ea5e9)" }}>
            Smart Healthcare
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/appointments">Dashboard</NavLink>
        </nav>
        <button
          className="md:hidden p-2 rounded-md border hover:bg-gray-50"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="container-responsive py-2 flex flex-col gap-1">
            <NavLink href="/" onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink href="/appointments" onClick={() => setOpen(false)}>Dashboard</NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
