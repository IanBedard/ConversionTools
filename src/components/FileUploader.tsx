"use client"; // For handling file uploads in the browser

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import mammoth from "mammoth";

const DocxToJson = () => {
  const [jsonOutput, setJsonOutput] = useState<string>("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
  
      try {
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const htmlContent = result.value;
  
        const structuredJson = extractStructuredData(htmlContent); // Convert to structured format
        setJsonOutput(JSON.stringify(structuredJson, null, 2));
      } catch (error) {
        console.error("Error processing DOCX:", error);
        setJsonOutput("Error processing file.");
      }
    };
  
    reader.readAsArrayBuffer(file);
  };
  const extractStructuredData = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const table = doc.querySelector("table");
  
    if (!table) return { error: "No table found in the document." };
  
    const jsonData: Record<string, any> = {};
  
    const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
      const columns = row.querySelectorAll("th, td");
      if (columns.length === 2) {
        const key = columns[0].textContent?.trim().toLowerCase();
        const value = columns[1].innerHTML.trim(); // Preserve HTML content
  
        // Mapping Table Headers to Desired JSON Keys
        switch (key) {
          case "title":
            jsonData.title = columns[1].textContent?.trim();
            break;
          case "category":
            jsonData.category = columns[1].textContent?.trim();
            break;
          case "date published":
            jsonData.date = columns[1].textContent?.trim();
            break;
          case "audience":
            jsonData.audience = columns[1].textContent?.split(",").map(item => item.trim());
            break;
          case "what you need to know":
            jsonData.what = value;
            break;
          case "action required":
            jsonData.action = value;
            break;
          case "notes":
            jsonData.notes = value;
            break;
          case "resources":
            jsonData.resources = value;
            break;
          case "who to contact":
            jsonData.who = value;
            break;
        }
      }
    });
  
    // Generate the custom ID based on the date
    const date = new Date(jsonData.date);
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of the year (e.g., 2025 => "25")
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensure 2-digit month (e.g., 2 => "02")
    const day = date.getDate().toString().padStart(2, "0"); // Ensure 2-digit day (e.g., 5 => "05")
    const communicationNumber = "1"; // This could be dynamic if needed
  
    // Generate the ID in the format: "25-02-05-communication1"
    jsonData.id = `${year}-${month}-${day}-communication${communicationNumber}`;
  
    return jsonData;
  };
  
  
  return (
<div className="flex flex-col gap-4 p-4 border rounded-lg shadow-md w-full max-w-3xl mx-auto">
  <h2 className="text-xl font-bold">Docx Table to Json with Html </h2>

  <Input type="file" onChange={handleFileUpload} accept=".docx" />

  <Textarea
    value={jsonOutput}
    placeholder="Converted JSON output will appear here..."
    readOnly
    className="min-h-[200px] font-mono text-sm"
  />

  <Button onClick={() => setJsonOutput("")} variant="destructive">
    Clear
  </Button>
</div>

  );
};

export default DocxToJson;
