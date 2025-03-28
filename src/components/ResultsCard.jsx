import React from "react";
import { Card } from "react-bootstrap";
import { MdOutlineElectricBolt } from "react-icons/md";

const ResultsCard = ({ fieldMagnitude }) => (
  <Card className="result-card">
    <Card.Body className="result-body">
      <div className="result-header">
        <MdOutlineElectricBolt className="result-icon" />
        <div className="result-titles">
          <h3 className="result-title">میدان الکتریکی</h3>
          <p className="result-subtitle">نتیجه محاسبات</p>
        </div>
      </div>

      <div className="result-values">
        <div className="main-result">
          {(fieldMagnitude / 1000).toFixed(3)}
          <span className="result-unit">kN/C</span>
        </div>
        <div className="secondary-result">
          {fieldMagnitude.toExponential(3)} N/C
        </div>
      </div>
    </Card.Body>
  </Card>
);

export default ResultsCard;
