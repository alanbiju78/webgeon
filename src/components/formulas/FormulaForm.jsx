// src/components/formulas/FormulaForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../../styles";
import {
  extractContextualVars,
  extractVariableNamesFromExpression,
} from "../../utils/expressionUtils";

export default function FormulaForm({
  onAdd,
  onUpdate,
  editingFormula,
  setEditingFormula,
  variables,
}) {
  const [name, setName] = useState("");
  const [expression, setExpression] = useState("");

  const definedVarNames = useMemo(
    () => variables.map((v) => v.name),
    [variables]
  );

  useEffect(() => {
    if (editingFormula) {
      setName(editingFormula.name);
      setExpression(editingFormula.expression);
    }
  }, [editingFormula]);

  function resetForm() {
    setName("");
    setExpression("");
    setEditingFormula(null);
  }

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

    // Validate that all non-context variables are defined
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

    const payload = {
      id: editingFormula ? editingFormula.id : Date.now().toString(),
      name: trimmedName,
      expression: expression.trim(),
    };

    if (editingFormula) {
      onUpdate(payload);
    } else {
      onAdd(payload);
    }

    resetForm();
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
        {editingFormula ? "Save Formula" : "Add Formula"}
      </button>
      {editingFormula && (
        <button
          type="button"
          style={styles.buttonDanger}
          onClick={resetForm}
        >
          Cancel Edit
        </button>
      )}
    </form>
  );
}
