"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { VscGraphLine } from "react-icons/vsc";
import { TfiLayoutListThumb } from "react-icons/tfi";
import { toast } from "react-toastify";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import dayjs from "dayjs";

const DetailSection = ({ stock }) => {
  const [details, setDetails] = useState(null);
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if (!stock.symbol) return;

    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/watchlist/${stock.symbol}`
        );
        setDetails(res.data.detail);
        const chartData = res.data.graphData.map(([date, values]) => ({
          date,
          open: parseFloat(values["1. open"]),
          high: parseFloat(values["2. high"]),
          low: parseFloat(values["3. low"]),
          close: parseFloat(values["4. close"]),
        }));
        setGraphData(chartData);
      } catch (err) {
        toast.error(
          `Failed to fetch details: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    };

    fetchDetails();
  }, [stock]);

  return (
    <div className="w-full h-full lg:max-h-[1000px] flex flex-col gap-2 p-6 overflow-auto bg-black/30 rounded-2xl text-white custom-scrollbar">
      <div className="flex gap-2">
        <TfiLayoutListThumb size={24} />
        <h2 className="text-2xl font-bold">Details</h2>
      </div>

      {!stock.symbol ? (
        <p className="text-gray-400">Click on a stock to see details</p>
      ) : !details ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <p>
            <strong>Symbol:</strong> {details["01. symbol"]}
          </p>
          <p>
            <strong>Name:</strong> {stock.name}
          </p>
          <p>
            <strong>Price:</strong> ${details["05. price"]}
          </p>
          <p>
            <strong>Open:</strong> ${details["02. open"]}
          </p>
          <p>
            <strong>High:</strong> ${details["03. high"]}
          </p>
          <p>
            <strong>Low:</strong> ${details["04. low"]}
          </p>
          <p>
            <strong>Previous Close:</strong> ${details["08. previous close"]}
          </p>
          <p>
            <strong>Change:</strong> {details["09. change"]}{" "}
            <span
              className={
                parseFloat(details["10. change percent"]) > 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              ({details["10. change percent"]})
            </span>
          </p>
          <p>
            <strong>Volume:</strong> ${details["06. volume"]}
          </p>
          <p>
            <strong>Latest trading day:</strong> {details["09. change"]} (
            {details["07. latest trading day"]})
          </p>
        </div>
      )}

      <ResponsiveContainer width="100%" height={300}>
        <div className="flex gap-2 my-4">
          <VscGraphLine size={24} />
          <h2 className="text-lg font-bold">Last 7 Days Analysis</h2>
        </div>
        <LineChart data={graphData} margin={{ top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            interval={0}
            tickFormatter={(value) => dayjs(value).format("DD-MMM-YY")}
            stroke="#ffffff"
            tick={{ fontSize: 11, fill: "#ffffff" }}
          />
          <YAxis
            domain={["dataMin - 1", "dataMax + 1"]}
            stroke="#ffffff" // white axis line and ticks
            tick={{ fontSize: 11, fill: "#ffffff" }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-black/50 text-white p-2 rounded shadow">
                    <p className="text-sm font-semibold">
                      {dayjs(label).format("DD MMM YYYY")}
                    </p>
                    {payload.map((entry, index) => (
                      <p key={index} className="text-sm">
                        <span
                          style={{ color: entry.color, fontWeight: "bold" }}
                        >
                          {entry.name}:
                        </span>{" "}
                        <span className="ml-1">{entry.value}</span>
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />

          <Legend />
          <Line type="monotone" dataKey="open" stroke="#8884d8" name="Open" />
          <Line type="monotone" dataKey="high" stroke="#82ca9d" name="High" />
          <Line type="monotone" dataKey="low" stroke="#ff7300" name="Low" />
          <Line type="monotone" dataKey="close" stroke="#ff0000" name="Close" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DetailSection;
