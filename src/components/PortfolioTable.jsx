import React from "react";

const PortfolioTable = ({ portfolio }) => {
  return (
    <div className="container my-4">
      <table className="table table-hover table-bordered align-middle">
        <thead className="table-dark">
          <tr>
            <th>Portfolio Name</th>
            <th>YTD</th>
            <th>MTD</th>
            <th>Since Inception</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{portfolio.name}</td>
            <td className={portfolio.ytd >= 0 ? "text-success" : "text-danger"}>
              {portfolio.ytd}%
            </td>
            <td className={portfolio.mtd >= 0 ? "text-success" : "text-danger"}>
              {portfolio.mtd}%
            </td>
            <td
              className={
                portfolio.sinceInception >= 0 ? "text-success" : "text-danger"
              }
            >
              {portfolio.sinceInception}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable;
