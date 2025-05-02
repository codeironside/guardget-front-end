"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export const LineChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const isDark = theme === "dark";
    const textColor = isDark
      ? "rgba(255, 255, 255, 0.8)"
      : "rgba(0, 0, 0, 0.8)";
    const gridColor = isDark
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)";

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Set dimensions
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const padding = 40;

    // Data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const data = [1200, 1900, 3000, 5000, 8000, 15000];

    // Calculate scales
    const maxData = Math.max(...data) * 1.1;
    const xScale = (width - padding * 2) / (months.length - 1);
    const yScale = (height - padding * 2) / maxData;

    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i * (height - padding * 2)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = textColor;
      ctx.font = "12px Montserrat";
      ctx.textAlign = "right";
      ctx.fillText(
        Math.round((i * maxData) / 5).toString(),
        padding - 10,
        y + 4
      );
    }

    // Draw x-axis labels
    ctx.fillStyle = textColor;
    ctx.font = "12px Montserrat";
    ctx.textAlign = "center";
    months.forEach((month, i) => {
      const x = padding + i * xScale;
      ctx.fillText(month, x, height - padding + 20);
    });

    // Draw line
    ctx.strokeStyle = "#22c55e"; // Primary color
    ctx.lineWidth = 3;
    ctx.beginPath();
    data.forEach((value, i) => {
      const x = padding + i * xScale;
      const y = height - padding - value * yScale;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = "#22c55e";
    data.forEach((value, i) => {
      const x = padding + i * xScale;
      const y = height - padding - value * yScale;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw white inner circle
      ctx.fillStyle = isDark ? "#1e1e1e" : "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#22c55e";
    });

    // Draw area under the line
    ctx.fillStyle = "rgba(34, 197, 94, 0.1)";
    ctx.beginPath();
    data.forEach((value, i) => {
      const x = padding + i * xScale;
      const y = height - padding - value * yScale;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo(padding + (months.length - 1) * xScale, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fill();
  }, [theme]);

  return (
    <div className="w-full h-[300px]">
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="w-full h-full"
      />
    </div>
  );
};

export const BarChart = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const isDark = theme === "dark";
    const textColor = isDark
      ? "rgba(255, 255, 255, 0.8)"
      : "rgba(0, 0, 0, 0.8)";
    const gridColor = isDark
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)";

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Set dimensions
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const padding = 40;

    // Data
    const categories = [
      "Registered",
      "Reported",
      "Stolen",
      "Missing",
      "Recovered",
    ];
    const data = [23950, 5127, 3200, 1927, 3542];

    // Calculate scales
    const maxData = Math.max(...data) * 1.1;
    const barWidth = (width - padding * 2) / categories.length - 20;
    const yScale = (height - padding * 2) / maxData;

    // Draw grid
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 0.5;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i * (height - padding * 2)) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = textColor;
      ctx.font = "12px Montserrat";
      ctx.textAlign = "right";
      ctx.fillText(
        Math.round((i * maxData) / 5).toString(),
        padding - 10,
        y + 4
      );
    }

    // Draw bars and x-axis labels
    const colors = ["#22c55e", "#f97316", "#ef4444", "#eab308", "#3b82f6"];

    categories.forEach((category, i) => {
      const x = padding + i * ((width - padding * 2) / categories.length) + 10;
      const barHeight = data[i] * yScale;
      const y = height - padding - barHeight;

      // Draw bar
      ctx.fillStyle = colors[i];
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw x-axis label
      ctx.fillStyle = textColor;
      ctx.font = "12px Montserrat";
      ctx.textAlign = "center";
      ctx.fillText(category, x + barWidth / 2, height - padding + 20);
    });
  }, [theme]);

  return (
    <div className="w-full h-[300px]">
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="w-full h-full"
      />
    </div>
  );
};
