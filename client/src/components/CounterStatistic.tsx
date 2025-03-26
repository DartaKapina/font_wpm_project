import { CounterStatisticProps } from "../interfaces/Statistic";

const CounterStatistic = ({
  label,
  value,
  unit,
  color,
}: CounterStatisticProps) => {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "1.25rem",
          color: "#666",
          lineHeight: "1.5",
          marginBottom: "0",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "4rem",
          fontWeight: "600",
          color: color,
          lineHeight: "1",
        }}
      >
        {value}
        {unit === "times" ? " " : ""}
        {unit}
      </div>
    </div>
  );
};

export default CounterStatistic;
