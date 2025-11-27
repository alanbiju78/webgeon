// components/variables/VariablesList.jsx
import React from "react";
import { styles } from "../../styles";

function VariablesList({ variables, onDelete }) {
  if (variables.length === 0) {
    return <p>No variables defined yet.</p>;
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Expression / Value</th>
          <th>Type</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {variables.map((v) => (
          <tr key={v.id}>
            <td>{v.name}</td>
            <td>{v.expression}</td>
            <td>
              <span
                style={{
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  backgroundColor:
                    v.type === "CONSTANT" ? "#d1fae5" : "#bfdbfe",
                }}
              >
                {v.type}
              </span>
            </td>
            <td>
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

export default VariablesList;
