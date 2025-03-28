import React from "react";
import { Form } from "react-bootstrap";
import {
  MdOutlineWaterDrop,
  MdStraighten,
  MdOutlineArrowUpward,
} from "react-icons/md";

const ElectricFieldForm = ({ params, onParamChange }) => (
  <div className="input-card">
    <h2 className="form-header">
      <MdOutlineWaterDrop className="header-icon" />
      پارامترهای محاسبه
    </h2>

    <Form.Group controlId="chargeDensity" className="input-group">
      <Form.Label className="input-label">
        <MdOutlineWaterDrop className="input-icon" />
        چگالی بار خطی (μC/m)
      </Form.Label>
      <Form.Control
        type="number"
        value={(params.chargeDensity * 1e6).toFixed(1)}
        onChange={(e) => onParamChange("chargeDensity", e.target.value * 1e-6)}
        className="form-input"
        min="0.1"
        step="0.1"
      />
    </Form.Group>

    <Form.Group controlId="length" className="input-group">
      <Form.Label className="input-label">
        <MdStraighten className="input-icon" />
        طول بار خطی (m)
      </Form.Label>
      <Form.Control
        type="number"
        value={params.length}
        onChange={(e) => onParamChange("length", e.target.value)}
        className="form-input"
        min="0.1"
        step="0.1"
      />
    </Form.Group>

    <Form.Group controlId="distance" className="input-group">
      <Form.Label className="input-label">
        <MdOutlineArrowUpward className="input-icon" />
        فاصله اندازه‌گیری (m)
      </Form.Label>
      <Form.Control
        type="number"
        value={params.distance}
        onChange={(e) => onParamChange("distance", e.target.value)}
        className="form-input"
        min="0.1"
        step="0.1"
      />
    </Form.Group>
  </div>
);

export default ElectricFieldForm;
