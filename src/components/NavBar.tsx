"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [{name:"Work",href:"#projects"},{name:"Experience",href:"#experience"},{name:"Skills",href:"#skills"},{name:"Contact",href:"#contact"}];
export function NavBar() {
  const [open,setOpen] = useState(false);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if(event.key === "Escape") { setOpen(false); document.getElementById("menu-toggle")?.focus(); } };
    if(open) document.addEventListener("keydown",escape);
    return () => document.removeEventListener("keydown",escape);
  },[open]);
  return <header className="site-header"><nav className="shell nav-inner" aria-label="Main navigation">
    <a href="#about" className="brand" onClick={() => setOpen(false)}><span className="brand-mark" aria-hidden="true">a.</span>Ashwin T E</a>
    <button id="menu-toggle" className="menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="navigation-links" onClick={() => setOpen(!open)}>{open ? <X size={20} aria-hidden="true"/> : <Menu size={20} aria-hidden="true"/>}</button>
    <div id="navigation-links" className={`nav-links ${open ? "is-open" : ""}`}>
      {links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.name}</a>)}
      <a className="nav-resume" href="/Ashwin_TE_Resume.pdf" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Résumé <ArrowUpRight size={16} aria-hidden="true"/></a>
    </div>
  </nav></header>;
}
