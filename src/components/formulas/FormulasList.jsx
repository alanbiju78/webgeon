// src/components/formulas/FormulasList.jsx
import React from "react";
import { styles } from "../../styles";
import {
  extractContextualVars,
  substituteContextual,
  evaluateFormulaExpression,
} from "../../utils/expressionUtils";

export default function FormulasList({ formulas, variables, onEdit }) {
  if (formulas.length === 0) {
    return <p>No formulas defined yet.</p>;
  }

  function handleExecute(formula) {
    try {
      const ctxVars = extractContextualVars(formula.expression);
      const ctxValues = {};

      // Collect contextual values via prompt() for now
      for (const name of ctxVars) {
        const input = window.prompt(`Enter value for ${name}:`);
        if (input === null) {
          // User cancelled
          return;
        }
        ctxValues[name] = input;
      }

      const exprWithoutCtx = substituteContextual(
        formula.expression,
        ctxValues
      );

      const result = evaluateFormulaExpression(exprWithoutCtx, variables);
      alert(`Result of ${formula.name}: ${result}`);
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  return (
    <div>
      {formulas.map((f) => (
        <div key={f.id} style={styles.formulaCard}>
          <div style={styles.formulaName}>{f.name}</div>
          <div style={styles.formulaExpression}>{f.expression}</div>
          <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
            <button
              onClick={() => handleExecute(f)}
              style={styles.buttonSmall}
            >
              Execute
            </button>
            <button
              onClick={() => onEdit(f)}
              style={{
                ...styles.buttonSmall,
                background:
                  "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              }}
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
