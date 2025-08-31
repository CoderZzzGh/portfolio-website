import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const PortfolioCharts = ({ data, type }) => {
  return (
    <LineChart width={400} height={250} data={data}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey={type === "equity" ? "equity" : "drawdown"}
        stroke={type === "equity" ? "#0d6efd" : "#dc3545"}
      />
    </LineChart>
  );
};

export default PortfolioCharts;
