import React from "react";
import { PawPrint } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <PawPrint size={18} />
          <span>Pawfinder</span>
        </div>
        <p className="site-footer__copy">© {new Date().getFullYear()} Pawfinder. All rights reserved.</p>
      </div>
    </footer>
  );
}
