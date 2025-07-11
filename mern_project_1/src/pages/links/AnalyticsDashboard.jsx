import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverEndpoint } from "../../config/config";
import { DataGrid } from "@mui/x-data-grid";
import { Bar, Pie } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

// Format date utility
const formatDate = (isoDateString) => {
  if (!isoDateString) return "";
  try {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat("en-us", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.log(error);
    return "";
  }
};

function AnalyticsDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${serverEndpoint}/links/analytics`, {
        params: {
          linkId: id,
          from: fromDate,
          to: toDate,
        },
        withCredentials: true,
      });
      setAnalyticsData(response.data);
    } catch (error) {
      console.log(error);
      navigate("/error");
    }
  };

  const groupBy = (key) => {
    return analyticsData.reduce((acc, item) => {
      const label = item[key] || "unknown";
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
  };

  const clicksByCity = groupBy("city");
  const clicksByBrowser = groupBy("browser");

  const columns = [
    { field: "ip", headerName: "IP Address", flex: 1 },
    { field: "city", headerName: "City", flex: 1 },
    { field: "country", headerName: "Country", flex: 1 },
    { field: "region", headerName: "Region", flex: 1 },
    { field: "isp", headerName: "ISP", flex: 1 },
    { field: "deviceType", headerName: "Device", flex: 1 },
    { field: "browser", headerName: "Browser", flex: 1 },
    {
      field: "clickedAt",
      headerName: "Clicked At",
      flex: 1,
      renderCell: (params) => <>{formatDate(params.row.clickedAt)}</>,
    },
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [fromDate, toDate]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Analytics for Link ID: {id}</h1>

      {/* Filters */}
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium mb-2">Filters</h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              className="border rounded px-3 py-2 text-sm"
              placeholderText="From (Date)"
            />
          </div>
          <div>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              className="border rounded px-3 py-2 text-sm"
              placeholderText="To (Date)"
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 className="text-md font-medium mb-3">Clicks by City</h2>
          <Bar
            data={{
              labels: Object.keys(clicksByCity),
              datasets: [
                {
                  label: "Clicks",
                  data: Object.values(clicksByCity),
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-md font-medium mb-3">Clicks by Browser</h2>
          <Pie
            data={{
              labels: Object.keys(clicksByBrowser),
              datasets: [
                {
                  data: Object.values(clicksByBrowser),
                  backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                  ],
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>

      {/* DataGrid Table */}
      <div className="bg-white rounded-lg shadow">
        <DataGrid
          getRowId={(row) => row._id}
          rows={analyticsData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 20, page: 0 },
            },
          }}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
          density="compact"
          autoHeight
          sx={{
            fontFamily: "inherit",
          }}
        />
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
