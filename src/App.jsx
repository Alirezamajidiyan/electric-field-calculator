import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Tabs,
  Tab,
  Spinner,
} from "react-bootstrap";
import {
  MdShowChart,
  MdSettings,
  MdPowerInput,
  MdStraighten,
} from "react-icons/md";
import * as d3 from "d3";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const ElectricFieldCalculator = () => {
  const [chargeDensity, setChargeDensity] = useState(1e-6);
  const [length, setLength] = useState(2);
  const [distance, setDistance] = useState(1);
  const [fieldMagnitude, setFieldMagnitude] = useState(0);
  const [unitSystem, setUnitSystem] = useState("meters");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const svgRef = useRef();
  const containerRef = useRef();

  const unitConverter = {
    meters: 1,
    centimeters: 100,
  };

  const convertToMeters = useCallback(
    (value) => value / unitConverter[unitSystem],
    [unitSystem]
  );

  const convertFromMeters = useCallback(
    (value) => value * unitConverter[unitSystem],
    [unitSystem]
  );

  const calculateElectricField = useCallback(() => {
    try {
      const k = 8.98755e9;
      const a = convertToMeters(distance);
      const L = convertToMeters(length);
      const lambda = chargeDensity;

      if (a <= 0 || L <= 0) {
        throw new Error("مقادیر باید بزرگتر از صفر باشند");
      }

      const E = ((k * lambda) / a) * (L / Math.sqrt(a * a + (L * L) / 4));
      setFieldMagnitude(E);
      setError("");
    } catch (err) {
      setError(err.message);
      setFieldMagnitude(0);
    }
  }, [chargeDensity, length, distance, convertToMeters]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const drawFieldLines = useCallback(() => {
    if (!containerRef.current) return;

    setLoading(true);
    const containerWidth = containerRef.current.offsetWidth;
    const width = Math.min(containerWidth, 1400);
    const height = Math.min(window.innerHeight * 0.6, 600);
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .html("");

    const maxY = Math.max(3, convertToMeters(distance) * 1.2);
    const xDomain = [
      (-convertToMeters(length) / 2) * 1.2,
      (convertToMeters(length) / 2) * 1.2,
    ];

    const x = d3
      .scaleLinear()
      .domain(xDomain)
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([-0.5, maxY])
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${y(0)})`)
      .transition()
      .duration(500)
      .call(
        d3
          .axisBottom(x)
          .ticks(10)
          .tickFormat(
            (d) => `${d.toFixed(1)}${unitSystem === "centimeters" ? "cm" : "m"}`
          )
      )
      .attr("color", "#888");

    svg
      .append("g")
      .attr("transform", `translate(${x(0)},0)`)
      .transition()
      .duration(500)
      .call(
        d3
          .axisLeft(y)
          .ticks(10)
          .tickFormat(
            (d) => `${d.toFixed(1)}${unitSystem === "centimeters" ? "cm" : "m"}`
          )
      )
      .attr("color", "#888");

    svg
      .append("line")
      .attr("x1", x(-convertToMeters(length) / 2))
      .attr("y1", y(0))
      .attr("x2", x(-convertToMeters(length) / 2))
      .attr("y2", y(0))
      .transition()
      .duration(800)
      .attr("x2", x(convertToMeters(length) / 2))
      .attr("stroke", "#ff4d4d")
      .attr("stroke-width", 4);

    const numFieldLines = Math.max(12, Math.floor(convertToMeters(length) * 2));
    const fieldLineLength = maxY;

    for (let i = 0; i < numFieldLines; i++) {
      const xPos =
        -convertToMeters(length) / 2 +
        ((i + 0.5) * convertToMeters(length)) / numFieldLines;

      svg
        .append("line")
        .attr("x1", x(xPos))
        .attr("y1", y(0))
        .attr("x2", x(xPos))
        .attr("y2", y(0))
        .transition()
        .duration(600)
        .attr("y2", y(fieldLineLength))
        .attr("stroke", "#4d88ff")
        .attr("stroke-width", 1.5)
        .attr("marker-end", "url(#arrowhead)");
    }

    svg
      .append("circle")
      .attr("cx", x(0))
      .attr("cy", y(convertToMeters(distance)))
      .attr("r", 0)
      .transition()
      .duration(800)
      .attr("r", 6)
      .attr("fill", "#33cc33")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 8)
      .attr("markerHeight", 8)
      .append("path")
      .attr("d", "M 0,-5 L 10,0 L 0,5")
      .attr("fill", "#4d88ff");

    setLoading(false);
  }, [convertToMeters, length, distance, unitSystem]);

  useEffect(() => {
    calculateElectricField();
    const debouncedDraw = debounce(drawFieldLines, 300);
    debouncedDraw();
    window.addEventListener("resize", debouncedDraw);
    return () => window.removeEventListener("resize", debouncedDraw);
  }, [calculateElectricField, drawFieldLines]);

  const handleUnitChange = (unit) => {
    setUnitSystem(unit);
    setLength((prev) => convertFromMeters(convertToMeters(prev)));
    setDistance((prev) => convertFromMeters(convertToMeters(prev)));
  };

  return (
    <div className="dark-theme vh-100">
      <nav className="navbar fixed-top bg-dark2 border-bottom border-secondary">
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-4 text-light">
            <div className="d-flex align-items-center gap-2">
              <MdShowChart size={24} className="text-primary" />
              <span className="fs-5 fw-bold">ماشین حساب میدان الکتریکی</span>
            </div>
            <div className="d-flex gap-3">
              <div className="d-flex align-items-center gap-2 bg-dark3 px-3 py-2 rounded">
                <MdPowerInput className="text-info" />
                <span className="text-nowrap">
                  {fieldMagnitude.toExponential(3)} N/C
                </span>
              </div>
              <div className="d-flex align-items-center gap-2 text-white  px-3 py-2 rounded bg-purple">
                <MdStraighten className="text-white" />
                <span className="text-nowrap">
                  {(fieldMagnitude / 1000).toFixed(3)} kN/C
                </span>
              </div>
            </div>
            <div className="badge bg-primary"></div>
          </div>
        </div>
      </nav>

      <Container fluid className="h-100 pt-5">
        <Row className="h-100 g-0">
          <Col
            lg={3}
            className="bg-dark2 border-end border-secondary p-4 d-flex flex-column"
          >
            <Tabs
              activeKey={unitSystem}
              onSelect={handleUnitChange}
              className="mb-4 border-0"
              variant="pills"
            >
              <Tab eventKey="meters" title="متر (m)" className="border-0">
                <Form className="mt-4 flex-grow-1">
                  <Form.Group controlId="chargeDensity" className="mb-4">
                    <Form.Label className="text-light d-flex align-items-center gap-2">
                      <MdSettings className="text-warning" />
                      چگالی بار (μC/m)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={chargeDensity * 1e6}
                      onChange={(e) =>
                        setChargeDensity(parseFloat(e.target.value) * 1e-6)
                      }
                      className="bg-dark3 border-dark text-light"
                      min="0.1"
                      step="0.1"
                    />
                  </Form.Group>

                  <Form.Group controlId="length" className="mb-4">
                    <Form.Label className="text-light d-flex align-items-center gap-2">
                      <MdStraighten className="text-warning" />
                      طول ({unitSystem === "meters" ? "m" : "cm"})
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={length}
                      onChange={(e) =>
                        setLength(Math.max(0.1, parseFloat(e.target.value)))
                      }
                      className="bg-dark3 border-dark text-light"
                      min="0.1"
                      step="0.1"
                    />
                  </Form.Group>

                  <Form.Group controlId="distance">
                    <Form.Label className="text-light d-flex align-items-center gap-2">
                      <MdStraighten className="text-warning" />
                      فاصله ({unitSystem === "meters" ? "m" : "cm"})
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={distance}
                      onChange={(e) =>
                        setDistance(Math.max(0.1, parseFloat(e.target.value)))
                      }
                      className="bg-dark3 border-dark text-light"
                      min="0.1"
                      step="0.1"
                    />
                  </Form.Group>
                </Form>
              </Tab>

              <Tab
                eventKey="centimeters"
                title="سانتی‌متر (cm)"
                className="border-0"
              >
                <Form className="mt-4 flex-grow-1">
                  <Form.Group controlId="chargeDensityCm" className="mb-4">
                    <Form.Label className="text-light d-flex align-items-center gap-2">
                      <MdSettings className="text-warning" />
                      چگالی بار (μC/cm)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={chargeDensity * 1e4} // تبدیل به μC/cm
                      onChange={(e) =>
                        setChargeDensity(parseFloat(e.target.value) * 1e-6)
                      }
                      className="bg-dark3 border-dark text-light"
                      min="0.1"
                      step="0.1"
                    />
                  </Form.Group>

                  <Form.Group controlId="lengthCm" className="mb-4">
                    <Form.Label className="text-light d-flex align-items-center gap-2">
                      <MdStraighten className="text-warning" />
                      طول (cm)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={length}
                      onChange={(e) =>
                        setLength(Math.max(0.1, parseFloat(e.target.value)))
                      }
                      className="bg-dark3 border-dark text-light"
                      min="0.1"
                      step="0.1"
                    />
                  </Form.Group>

                  <Form.Group controlId="distanceCm">
                    <Form.Label className="text-light d-flex align-items-center gap-2">
                      <MdStraighten className="text-warning" />
                      فاصله (cm)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={distance}
                      onChange={(e) =>
                        setDistance(Math.max(0.1, parseFloat(e.target.value)))
                      }
                      className="bg-dark3 border-dark text-light"
                      min="0.1"
                      step="0.1"
                    />
                  </Form.Group>
                </Form>
              </Tab>
            </Tabs>
                      
            {/* Legend */}
            <Card className="bg-dark3 border-secondary mt-auto">
              <Card.Body>
                <h6 className="text-light mb-3 d-flex align-items-center gap-2">
                  <MdShowChart className="text-info" />
                  راهنمای نمودار
                </h6>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="color-swatch red"></div>
                    <span className="text-light">میله باردار</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="color-swatch blue"></div>
                    <span className="text-light">خطوط میدان الکتریکی</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <div className="color-swatch green"></div>
                    <span className="text-light">نقطه اندازه‌گیری</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Visualization */}
          <Col lg={9} className="h-100 position-relative">
            {loading && (
              <div className="position-absolute top-50 start-50 translate-middle">
                <Spinner animation="border" variant="primary" />
              </div>
            )}
            {error && (
              <div className="position-absolute top-50 start-50 translate-middle text-danger">
                {error}
              </div>
            )}
            <div ref={containerRef} className="responsive-chart h-100">
              <svg ref={svgRef} className="w-100 h-100" />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ElectricFieldCalculator;
