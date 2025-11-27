// src/components/variables/VariablesList.jsx
import React from "react";
import { styles } from "../../styles";

export default function VariablesList({ variables, onDelete, onEdit }) {
  if (variables.length === 0) {
    return <p>No variables defined yet.</p>;
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.tableHeaderCell}>Name</th>
          <th style={styles.tableHeaderCell}>Expression / Value</th>
          <th style={styles.tableHeaderCell}>Type</th>
          <th style={styles.tableHeaderCell}></th>
        </tr>
      </thead>
      <tbody>
        {variables.map((v) => (
          <tr key={v.id}>
            <td style={styles.tableCell}>{v.name}</td>
            <td style={styles.tableCell}>{v.expression}</td>
            <td style={styles.tableCell}>
              <span style={styles.typeBadge(v.type)}>{v.type}</span>
            </td>
            <td style={styles.tableCell}>
              <button
                onClick={() => onEdit(v)}
                style={{ ...styles.buttonSmall, marginRight: 6 }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(v.id)}
                style={styles.buttonDanger}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
