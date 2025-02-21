"use client"
import { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error("Invalid JSON format. 'data' should be an array.");
      }
      setError(null);
      
      const res = await fetch("/api/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });
      const data = await res.json();
      setResponseData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (values) => {
    setSelectedFilters(values);
  };

  const filteredResponse = responseData
    ? Object.keys(responseData)
        .filter((key) => selectedFilters.includes(key))
        .reduce((acc, key) => ({ ...acc, [key]: responseData[key] }), {})
    : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">ABCD123</h1>
      <div className="w-full max-w-lg">
        <label className="block text-gray-700 font-semibold mb-2">API Input</label>
        <Input
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder='{"data": ["A", "C", "z"]}'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
      {error && <p className="text-red-500 mt-3">{error}</p>}
      {responseData && (
        <div className="w-full max-w-lg mt-6">
          <label className="block text-gray-700 font-semibold mb-2">Multi Filter</label>
          <Select multiple onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Select Filters" />
            <SelectContent>
              <SelectItem value="alphabets">Alphabets</SelectItem>
              <SelectItem value="numbers">Numbers</SelectItem>
              <SelectItem value="highest_alphabet">Highest Alphabet</SelectItem>
            </SelectContent>
          </Select>
          <Card className="mt-4 w-full bg-white p-4 shadow-lg rounded-lg">
            <CardContent>
              <h2 className="text-lg font-semibold mb-2">Filtered Response</h2>
              {Object.entries(filteredResponse || responseData).map(([key, value]) => (
                <p key={key} className="text-gray-700">
                  <span className="font-semibold">{key.replace("_", " ")}:</span> {Array.isArray(value) ? value.join(", ") : value}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
