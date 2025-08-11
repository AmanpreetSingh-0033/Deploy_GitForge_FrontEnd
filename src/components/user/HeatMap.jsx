import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./Heatmap.css";
import client from "../../utils/client";

const ActivityHeatMap = ({ userId }) => {
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01`);
  const endDate = new Date(`${currentYear}-12-31`);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!userId) return;

      try {
        const res = await client.get(`/user-activity/${userId}`);
        const formatted = res.data.map((item) => ({
          date: item.date,
          count: item.count,
        }));
        setActivityData(formatted);
      } catch (err) {
        console.error("Error fetching activity data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [userId]);

  if (loading) {
    return <div className="heatmap-container">Loading activity...</div>;
  }

  if (!activityData.length) {
    return (
      <div className="heatmap-container">
        <h2 className="heatmap-heading">Your Contribution Activity</h2>
        <p className="heatmap-empty">No activity found yet.</p>
      </div>
    );
  }

  return (
    <div className="heatmap-container">
      <h2 className="heatmap-heading">Your Contribution Activity</h2>
      <div>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={activityData}
          classForValue={(value) => {
            if (!value || value.count === 0) return "color-empty";
            if (value.count === 1) return "color-scale-1";
            if (value.count === 2) return "color-scale-2";
            if (value.count >= 3) return "color-scale-3";
            return "color-filled";
          }}
          showWeekdayLabels={true}
          horizontal={true}
        />
      </div>
    </div>
  );
};

export default ActivityHeatMap;
