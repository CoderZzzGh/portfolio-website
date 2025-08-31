import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function Portfolio() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadExcel = async () => {
      try {
        const response = await fetch("/nav.xlsx"); // file inside public/
        const arrayBuffer = await response.arrayBuffer();

        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json(worksheet);
        setData(json);
      } catch (error) {
        console.error("Error reading Excel file:", error);
      }
    };

    loadExcel();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Portfolio Statistics</h2>
      {data.length > 0 ? (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading Excel data...</p>
      )}
    </div>
  );
}
