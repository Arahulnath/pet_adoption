import React from "react";
import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import Button from "../../components/common/Button";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="not-found">
      <PawPrint size={48} className="not-found__icon" />
      <h1>404</h1>
      <p>This page seems to have wandered off. Let's get you back on track.</p>
      <Link to="/">
        <Button variant="primary">Back to home</Button>
      </Link>
    </div>
  );
}
