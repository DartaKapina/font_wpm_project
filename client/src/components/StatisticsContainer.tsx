import React from "react";

interface StatisticsContainerProps {
  children: React.ReactNode;
  direction?: "column" | "row";
}

const StatisticsContainer = ({
  children,
  direction = "column",
}: StatisticsContainerProps) => {
  // Convert children to array to add dividers between them
  const childrenArray = React.Children.toArray(children);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
        padding: "1rem",
      }}
    >
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < childrenArray.length - 1 && (
            <hr
              style={{
                width: "80%",
                border: "none",
                borderTop: "2px solid #a0a0a0",
                margin: 0,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatisticsContainer;
