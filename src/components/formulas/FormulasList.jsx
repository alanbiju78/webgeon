// components/formulas/FormulasList.jsx
import React from "react";
import { styles } from "../../styles";
import {
  extractContextualVars,
  substituteContextual,
  evaluateFormulaExpression,
} from "../../utils/expressionUtils";

function FormulasList({ formulas, variables }) {
  if (formulas.length === 0) {
    return <p>No formulas defined yet.</p>;
  }

  function handleExecute(formula) {
    try {
      const ctxVars = extractContextualVars(formula.expression);
      const ctxValues = {};

      for (const name of ctxVars) {
        const input = window.prompt(`Enter value for ${name}:`);
        if (input === null) return; // cancelled
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
          <div>
            <strong>{f.name}</strong>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
            {f.expression}
          </div>
          <div style={{ marginTop: "8px" }}>
            <button
              onClick={() => handleExecute(f)}
              style={styles.buttonSmall}
            >
              Execute
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FormulasList;
