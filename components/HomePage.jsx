"use client";
import React, { useState } from "react";
import TableSection from "./TableSection";
import DetailSection from "./DetailSection";

const HomePage = () => {
  const [selectedStock, setSelectedStock] = useState({});
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full h-full">
      <TableSection stock={selectedStock} setStock={setSelectedStock} />
      <DetailSection stock={selectedStock} setStock={setSelectedStock} />
    </div>
  );
};

export default HomePage;
