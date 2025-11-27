// components/formulas/FormulaForm.jsx
import React, { useMemo } from "react";
import { styles } from "../../styles";
import {
  extractContextualVars,
  extractVariableNamesFromExpression,
} from "../../utils/expressionUtils";

function FormulaForm({ onAdd, variables }) {
  const [name, setName] = React.useState("");
  const [expression, setExpression] = React.useState("");

  const definedVarNames = useMemo(
    () => variables.map((v) => v.name),
    [variables]
  );

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = name.trim().toUpperCase();
    if (!trimmedName) {
      alert("Formula name is required");
      return;
    }
    if (!expression.trim()) {
      alert("Expression is required");
      return;
    }

    const ctxVars = extractContextualVars(expression);
    const varNames = extractVariableNamesFromExpression(expression);
    const nonContextVars = varNames.filter((v) => !ctxVars.includes(v));

    const undefinedVars = nonContextVars.filter(
      (v) => !definedVarNames.includes(v)
    );
    if (undefinedVars.length > 0) {
      alert(
        "Formula uses undefined variables: " + undefinedVars.join(", ")
      );
      return;
    }

    onAdd({
      id: Date.now().toString(),
      name: trimmedName,
      expression: expression.trim(),
    });

    setName("");
    setExpression("");
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        placeholder="Name (e.g. NET_SALARY)"
        value={name}
        onChange={(e) => setName(e.target.value.toUpperCase())}
        style={styles.input}
      />
      <input
        placeholder="Expression (e.g. GROSS - DEDUCTIONS or (GROSS/30)*{{#num_of_days}})"
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        Add Formula
      </button>
    </form>
  );
}

export default FormulaForm;
