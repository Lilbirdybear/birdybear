import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Work", href: "/#compartments", isHash: true },
  { label: "Projects", href: "/#projects", isHash: true },
  { label: "Blog", href: "/blog", isHash: false },
  { label: "About", href: "/#about", isHash: true },
  { label: "Contact", href: "/contact", isHash: false },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const renderLink = (link: typeof navLinks[0], onClick?: () => void) => {
    if (link.isHash && isHome) {
      return (
        <a
          key={link.label}
          href={link.href.replace("/", "")}
          onClick={onClick}
          className="font-mono text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          {link.label}
        </a>
      );
    }

    if (link.isHash) {
      return (
        <Link
          key={link.label}
          to={link.href}
          onClick={onClick}
          className="font-mono text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          {link.label}
        </Link>
      );
    }

    return (
      <Link
        key={link.label}
        to={link.href}
        onClick={onClick}
        className={`font-mono text-xs tracking-wider transition-colors ${
          location.pathname === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="font-mono text-sm tracking-[0.15em] text-foreground font-medium">
          ELI<span className="text-primary">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => renderLink(link))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden glass-panel border-t border-border px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <div key={link.label} className="block">
              {renderLink(link, () => setOpen(false))}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
