import React from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import Footer from "../components/Footer";
import "./Agenda.css";

export default function Agenda() {
  return (
    <div className="agenda-page">
      <Navbar />
      <div className="agenda-content">
        <Table />
      </div>
      <Footer />
    </div>
  );
}