// components/variables/VariableForm.jsx
import React from "react";
import { styles } from "../../styles"; // we'll create this in a sec or keep inline

function VariableForm({ onAdd }) {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("CONSTANT");
  const [expression, setExpression] = React.useState("");

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

    onAdd({
      id: Date.now().toString(),
      name: trimmedName,
      type,
      expression: expression.trim(),
    });

    setName("");
    setExpression("");
    setType("CONSTANT");
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
        Add Variable
      </button>
    </form>
  );
}

export default VariableForm;
