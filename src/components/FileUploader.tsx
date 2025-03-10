"use client"; // For handling file uploads in the browser

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import mammoth from "mammoth";

// Update the interface to remove id since it will be the root key
interface CommunicationData {
  error?: string;
  title?: string;
  category?: string;
  date?: string;
  audience?: string[];
  what?: string;
  action?: string;
  notes?: string;
  resources?: string;
  who?: string;
}

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
  
        const { id, data } = extractStructuredData(htmlContent);
        // Create an object with the ID as the key
        const finalOutput = id ? { [id]: data } : data;
        setJsonOutput(JSON.stringify(finalOutput, null, 2));
      } catch (error) {
        console.error("Error processing DOCX:", error);
        setJsonOutput("Error processing file.");
      }
    };
  
    reader.readAsArrayBuffer(file);
  };

  const extractStructuredData = (htmlContent: string): { id?: string; data: CommunicationData } => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const table = doc.querySelector("table");

    if (!table) return { data: { error: "No table found in the document." } };

    const jsonData: CommunicationData = {};
    let documentId: string | undefined;

    const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
      const columns = row.querySelectorAll("th, td");
      if (columns.length === 2) {
        const key = columns[0].textContent?.trim().toLowerCase();
        const value = columns[1].innerHTML.trim();

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

    if (jsonData.date) {
      const date = new Date(jsonData.date);
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const communicationNumber = "1";

      documentId = `${year}-${month}-${day}-communication${communicationNumber}`;
      // Remove the date from the data since it's part of the ID
      delete jsonData.date;
    }

    return {
      id: documentId,
      data: jsonData
    };
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
