"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState(null);

  const filterOptions = [
    { id: "numbers", label: "Numbers", displayName: "Numbers" },
    { id: "alphabets", label: "Alphabets", displayName: "Alphabets" },
    { id: "highest_alphabet", label: "Highest Alphabet", displayName: "Highest Alphabet" }
  ];

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

  const handleFilterChange = (filterId) => {
    setSelectedFilters(prev => {
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };

  const formatFilteredResponse = (response) => {
    if (!response || Object.keys(response).length === 0) return null;

    return Object.entries(response).map(([key, value]) => {
      const filterOption = filterOptions.find(opt => opt.id === key);
      const displayName = filterOption?.displayName || key;
      
      
      const displayValue = Array.isArray(value) ? value.join(", ") : value;
      
      return {
        key,
        displayName,
        value: displayValue
      };
    });
  };

  const filteredResponse = responseData
    ? Object.keys(responseData)
        .filter((key) => selectedFilters.includes(key))
        .reduce((acc, key) => ({ ...acc, [key]: responseData[key] }), {})
    : null;

  const formattedResponse = formatFilteredResponse(filteredResponse);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">API input</h1>
      
      <div className="w-96 space-y-4">
        <Input
          className="w-full"
          placeholder="Enter JSON"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        
        <Button className="w-full" onClick={handleSubmit}>
          Submit
        </Button>
        
        {error && <p className="text-red-500">{error}</p>}
        
        {responseData && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Select Multiple Filters</h2>
                <div className="space-y-2">
                  {filterOptions.map((filter) => (
                    <div key={filter.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={filter.id}
                        checked={selectedFilters.includes(filter.id)}
                        onCheckedChange={() => handleFilterChange(filter.id)}
                      />
                      <Label htmlFor={filter.id}>{filter.label}</Label>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">Filtered Response</h2>
                  {formattedResponse && formattedResponse.length > 0 ? (
                    <div className="space-y-2">
                      {formattedResponse.map((item) => (
                        <div key={item.key} className="text-sm">
                          <span className="font-medium">{item.displayName}: </span>
                          <span>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No filters selected</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}