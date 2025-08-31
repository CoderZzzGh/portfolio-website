import React, { useEffect, useState } from "react";
import PortfolioTable from "./PortfolioTable";
import PortfolioCharts from "./PortfolioCharts";
import { parseExcel } from "../utils/excelParser";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    parseExcel("/data/Historical NAV Report.xlsx").then((data) => {
      setPortfolio(data);
    });
  }, []);

  if (!portfolio) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">Portfolio Dashboard</h1>
      <PortfolioTable portfolio={portfolio} />

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3">
            <h5 className="card-title">Equity Curve</h5>
            <PortfolioCharts data={portfolio.equityCurve} type="equity" />
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3">
            <h5 className="card-title">Drawdown</h5>
            <PortfolioCharts data={portfolio.drawdown} type="drawdown" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

