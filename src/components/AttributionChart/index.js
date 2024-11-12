import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Box, Select, MenuItem, Typography } from "@mui/material";
import axios from "axios";
import './index.css'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AttributionChart = () => {
  const [attributionModel, setAttributionModel] = useState("last-click");
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const fetchAttributionData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/attribution?model=${attributionModel}`);
      const data = response.data;
      console.log(data);

      setChartData({
        labels: data.map((item) => item.channel),
        datasets: [
          {
            label: "Engagement Attribution",
            data: data.map((item) => item.value),
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching attribution data:", error);
    }
  };

  useEffect(() => {
    fetchAttributionData();
  }, [attributionModel]);

  return (
    <div className = "chart-con">
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }} className = "extra-con">
      <div>
      <Typography variant="h5">Multi-Channel Attribution</Typography>
      <Select
        value={attributionModel}
        onChange={(e) => setAttributionModel(e.target.value)}
        displayEmpty
        sx={{ mb: 2 }}
      >
        <MenuItem value="last-click">Last-Click</MenuItem>
        <MenuItem value="first-click">First-Click</MenuItem>
        <MenuItem value="linear">Linear</MenuItem>
      </Select>
      </div>
      <Bar
        className ="bar-con"
        data={chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Engagements" },
            },
            x: { title: { display: true, text: "Channels" } },
          },
        }}
      />
    </Box>
    </div>
  );
};

export default AttributionChart;
