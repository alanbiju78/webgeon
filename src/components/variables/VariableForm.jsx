// src/components/variables/VariableForm.jsx
import React, { useEffect, useState } from "react";
import { styles } from "../../styles";

export default function VariableForm({
  onAdd,
  onUpdate,
  editingVariable,
  setEditingVariable,
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("CONSTANT");
  const [expression, setExpression] = useState("");

  // whenever we enter edit mode, load that variable into the form
  useEffect(() => {
    if (editingVariable) {
      setName(editingVariable.name);
      setType(editingVariable.type);
      setExpression(editingVariable.expression);
    }
  }, [editingVariable]);

  function resetForm() {
    setName("");
    setType("CONSTANT");
    setExpression("");
    setEditingVariable(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const trimmedName = name.trim().toUpperCase();

    if (!trimmedName) {
      alert("Variable name is required");
      return;
    }
    if (!expression.trim()) {
      alert("Expression/value is required");
      return;
    }
    if (expression.includes("{{#")) {
      alert("Contextual placeholders are not allowed in variables.");
      return;
    }

    const payload = {
      id: editingVariable ? editingVariable.id : Date.now().toString(),
      name: trimmedName,
      type,
      expression: expression.trim(),
    };

    if (editingVariable) {
      onUpdate(payload);
    } else {
      onAdd(payload);
    }

    resetForm();
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        placeholder="Name (e.g. BASIC)"
        value={name}
        onChange={(e) => setName(e.target.value.toUpperCase())}
        style={styles.input}
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={styles.select}
      >
        <option value="CONSTANT">CONSTANT</option>
        <option value="DYNAMIC">DYNAMIC</option>
      </select>
      <input
        placeholder={
          type === "CONSTANT"
            ? "Value (e.g. 10000)"
            : "Expression (e.g. BASIC + DA)"
        }
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>
        {editingVariable ? "Save Variable" : "Add Variable"}
      </button>
      {editingVariable && (
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
