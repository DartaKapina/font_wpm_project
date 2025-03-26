import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { GraphStatisticProps } from "../interfaces/Statistic";

const GraphStatistic = ({
  data,
  expected_value,
  time_limit,
  width = null,
  height = null,
  color = "#3b82f6",
  label,
}: GraphStatisticProps) => {
  const maxY = Math.max(...data.map((d) => d.value), expected_value); // at least 100 WPM
  const avgValue = data.length
    ? data.reduce((sum, d) => sum + d.value, 0) / data.length
    : 0;

  // Group data by floored time and calculate averages
  const dataProcessed = Array.from(
    data.reduce((groups, point) => {
      const timeKey = Math.floor(point.time);
      if (!groups.has(timeKey)) {
        groups.set(timeKey, []);
      }
      groups.get(timeKey)!.push(point);
      return groups;
    }, new Map<number, typeof data>())
  ).map(([time, points]) => ({
    time: Number(time),
    value: points.reduce((sum, p) => sum + p.value, 0) / points.length,
  }));

  const maxTime = data.length ? Math.max(...data.map((d) => d.time)) : 0;
  const milestones = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].filter(
    (m) => m <= maxY
  );

  const timestamps = Array.from(
    { length: Math.ceil(time_limit / 5) + 1 },
    (_, i) => i * 5
  );

  return (
    <>
      {/* <div style={{ 
          fontSize: '1.25rem',
          color: '#666',
          lineHeight: '1.5',
          marginBottom: '0'
      }}>
          {label}
      </div> */}
      <div
        style={{
          width: width ? width : "100%",
          height: height ? height : "250px",
        }}
      >
        <ResponsiveContainer>
          <LineChart margin={{ top: 10, right: 10, bottom: -10, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />

            <XAxis
              dataKey="time"
              type="number"
              domain={[0, maxTime]}
              ticks={timestamps.filter((t) => t <= maxTime + 0.5)}
              tick={{ fontSize: 10, fontFamily: "monospace", angle: -45 }}
              axisLine={true}
            />

            <YAxis
              label={{ value: label, angle: -90, position: "center" }}
              domain={[0, maxY + 10]}
              ticks={milestones}
              tick={{ fontSize: 10, fontFamily: "monospace", angle: -15 }}
              axisLine={{ stroke: "#94a3b8" }}
            />

            <Line
              data={dataProcessed}
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />

            {/* Average line */}
            {data.length > 0 && (
              <ReferenceLine
                y={avgValue}
                stroke="#44546b"
                strokeWidth={2}
                label={{
                  value: avgValue.toFixed(2),
                  position: "top",
                  fontSize: 10,
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  style: {
                    zIndex: 10000,
                  },
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default GraphStatistic;
