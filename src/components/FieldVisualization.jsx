import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const FieldVisualization = ({ length, distance }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 800;
    const height = 500;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .html("");

    // رسم محورها
    const xScale = d3
      .scaleLinear()
      .domain([-length / 2 - 1, length / 2 + 1])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([-1, distance + 2])
      .range([height - margin.bottom, margin.top]);

    // رسم خطوط میدان
    const drawFieldLines = () => {
      const numLines = 12;
      for (let i = 0; i < numLines; i++) {
        const xPos = -length / 2 + ((i + 0.5) * length) / numLines;

        svg
          .append("line")
          .attr("x1", xScale(xPos))
          .attr("y1", yScale(0))
          .attr("x2", xScale(xPos))
          .attr("y2", yScale(distance + 1))
          .attr("stroke", "#4ECDC4")
          .attr("stroke-width", 1.5)
          .attr("marker-end", "url(#arrow)");
      }
    };

    // رسم بار خطی
    svg
      .append("line")
      .attr("x1", xScale(-length / 2))
      .attr("y1", yScale(0))
      .attr("x2", xScale(length / 2))
      .attr("y2", yScale(0))
      .attr("stroke", "#FF6B6B")
      .attr("stroke-width", 4);

    // رسم نقطه اندازه‌گیری
    svg
      .append("circle")
      .attr("cx", xScale(0))
      .attr("cy", yScale(distance))
      .attr("r", 6)
      .attr("fill", "#FFD93D");

    // ایجاد پیکان
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#4ECDC4");

    drawFieldLines();
  }, [length, distance]);

  return <svg ref={svgRef} className="field-visualization" />;
};

export default FieldVisualization;
