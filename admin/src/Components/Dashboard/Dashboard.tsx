import "./Dashboard.css";

import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

import BaseAxios from "../../API/axiosClient";
import DasboardContentTop from "./DashboardTop/DashboardTop";

const Dashboard = () => {
  const fetchRevenueData = async () => {
    try {
      const response = await BaseAxios.get("/api/v1/revenues");
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await BaseAxios.get("/api/v1/users");
      //   console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return [];
    }
  };

  const processMonthlyData = (
    data: any[],
    isRevenue: boolean = false
  ): Map<string, number> => {
    const monthlyData: Map<string, number> = new Map();
    data.forEach((item) => {
      const month = new Date(item.createdAt).getMonth() + 1;
      const year = new Date(item.createdAt).getFullYear();
      const key = `${month}-${year}`;
      const prevSum = monthlyData.get(key) || 0;
      if (isRevenue) {
        monthlyData.set(key, prevSum + item.price);
      } else {
        monthlyData.set(key, prevSum + 1); // Đối với người dùng, là đếm
      }
    });

    return monthlyData;
  };

  const currentYear = new Date().getFullYear();
  const initializeFullYearData = () => {
    const data = new Map();
    for (let i = 1; i <= 12; i++) {
      data.set(`${i}-${currentYear}`, 0);
    }
    return data;
  };

  const [revenueData, setRevenueData] = useState<Map<string, number>>(
    initializeFullYearData()
  );
  const [userData, setUserData] = useState<Map<string, number>>(
    initializeFullYearData()
  );

  useEffect(() => {
    const fetchData = async () => {
      const revenue = await fetchRevenueData();
      const users = await fetchUserData();
      const processedRevenue = processMonthlyData(revenue, true);
      const processedUsers = processMonthlyData(users);
      setRevenueData(processedRevenue);
      setUserData(processedUsers);
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <DasboardContentTop />
      <div className="chart-container">
        <Chart
          className="chart"
          height={"700px"}
          chartType="ComboChart"
          loader={<div>Loading Chart</div>}
          data={[
            ["Month", "Revenue", "New Users"],
            ...Array.from(
              new Set([...revenueData.keys(), ...userData.keys()])
            ).map((key) => {
              return [key, revenueData.get(key) || 0, userData.get(key) || 0];
            }),
          ]}
          options={{
            title: "Monthly Revenue and New Users",
            vAxis: {
              title: "Count",
            },
            hAxis: {
              title: "Month",
            },
            seriesType: "bars",
            series: {
              0: { color: "#2175f5" }, // Revenue là cột
              1: { color: "#33a532" }, // New Users là đường
            },
            bar: { groupWidth: "20%" },
            titleTextStyle: {
              fontSize: 24,
            },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
