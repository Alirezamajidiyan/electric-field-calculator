import React from "react";
import { Card } from "react-bootstrap";
import { MdScience } from "react-icons/md";

const PhysicsExplanation = () => {
  return (
    <div className="glass-card p-4 mt-4">
      <h5 className="text-gradient mb-4">
        <MdScience className="me-2" />
        پایه فیزیکی محاسبات
      </h5>

      <div className="formula-container">
        <div className="formula-box">
          <span className="formula-text">E = (kλ/a) × (L/√(a² + L²/4))</span>
        </div>

        <div className="variables-list mt-4">
          <div className="variable-item">
            <span className="variable-name">k:</span>
            <span className="variable-value">8.98755×10⁹ N·m²/C²</span>
          </div>
          <div className="variable-item">
            <span className="variable-name">λ:</span>
            <span className="variable-value">چگالی بار خطی</span>
          </div>
          <div className="variable-item">
            <span className="variable-name">L:</span>
            <span className="variable-value">طول بار خطی</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsExplanation;
