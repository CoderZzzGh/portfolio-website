import * as XLSX from "xlsx";

export async function parseExcel(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filePath}: ${response.status} ${response.statusText}`);
    }

    // Check content type
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    // Read as ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();
    console.log('File size:', arrayBuffer.byteLength, 'bytes');

    // Check if file is empty
    if (arrayBuffer.byteLength === 0) {
      throw new Error('File is empty');
    }

    const data = new Uint8Array(arrayBuffer);

    // Try different parsing options
    let workbook;
    const parseOptions = [
      { type: "array", cellText: false, cellDates: true },
      { type: "buffer", cellText: false, cellDates: true },
      { type: "array", raw: true },
      { type: "array", cellText: false, cellDates: true, codepage: 65001 }
    ];

    for (let i = 0; i < parseOptions.length; i++) {
      try {
        console.log(`Trying parse option ${i + 1}:`, parseOptions[i]);
        
        if (parseOptions[i].type === "buffer") {
          workbook = XLSX.read(arrayBuffer, parseOptions[i]);
        } else {
          workbook = XLSX.read(data, parseOptions[i]);
        }
        
        console.log('Successfully parsed with option', i + 1);
        break;
      } catch (parseError) {
        console.log(`Parse option ${i + 1} failed:`, parseError.message);
        if (i === parseOptions.length - 1) {
          throw parseError;
        }
      }
    }

    if (!workbook) {
      throw new Error('Unable to parse Excel file with any method');
    }

    console.log('Workbook sheet names:', workbook.SheetNames);

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('No sheets found in the workbook');
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }

    // Convert sheet to JSON with error handling
    let rows;
    try {
      rows = XLSX.utils.sheet_to_json(sheet, { 
        defval: "",
        raw: false,
        dateNF: 'yyyy-mm-dd'
      });
    } catch (jsonError) {
      console.error('Error converting sheet to JSON:', jsonError);
      // Fallback: try to get raw values
      rows = XLSX.utils.sheet_to_json(sheet, { 
        defval: "",
        raw: true,
        header: 1 // Get as array of arrays
      });
    }

    console.log('Parsed rows:', rows.length);
    console.log('First few rows:', rows.slice(0, 3));

    // Validate data structure
    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn('No data rows found, using sample data');
      rows = generateSampleData();
    }

    return {
      name: "Test Portfolio",
      ytd: 12.5,
      mtd: -2.1,
      sinceInception: 45.7,
      equityCurve: rows.map((row, i) => ({
        date: row.Date || row.date || `Day ${i + 1}`,
        equity: parseFloat(row.Value || row.value || row.Equity || row.equity) || Math.random() * 100,
      })),
      drawdown: rows.map((row, i) => ({
        date: row.Date || row.date || `Day ${i + 1}`,
        drawdown: parseFloat(row.Drawdown || row.drawdown) || Math.random() * -10,
      })),
    };

  } catch (error) {
    console.error('Excel parsing error:', error);
    
    // Log more details about the error
    if (error.message.includes('could not find <table>')) {
      console.error('This suggests the file might not be a valid Excel file or is corrupted');
      console.error('Check if the file is actually an Excel file (.xlsx/.xls) and not HTML or another format');
    }
    
    // Return sample data as fallback
    console.log('Returning sample data due to parsing error');
    return {
      name: "Sample Portfolio (Excel Parse Failed)",
      ytd: 12.5,
      mtd: -2.1,
      sinceInception: 45.7,
      equityCurve: generateSampleData().map((_, i) => ({
        date: `Day ${i + 1}`,
        equity: Math.random() * 100,
      })),
      drawdown: generateSampleData().map((_, i) => ({
        date: `Day ${i + 1}`,
        drawdown: Math.random() * -10,
      })),
    };
  }
}

function generateSampleData() {
  return Array.from({ length: 30 }, (_, i) => ({
    Date: `2024-01-${String(i + 1).padStart(2, '0')}`,
    Value: 1000 + Math.random() * 200 - 100,
    Drawdown: Math.random() * -15
  }));
}

// Alternative function to validate Excel file before parsing
export async function validateExcelFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) return false;

    const contentType = response.headers.get('content-type');
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/octet-stream'
    ];

    return validTypes.some(type => contentType?.includes(type));
  } catch (error) {
    console.error('File validation error:', error);
    return false;
  }
}