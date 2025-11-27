// src/styles.js
export const styles = {
  page: {
    minHeight: "100vh",
    margin: 0,
    padding: "32px 16px",
    background:
      "radial-gradient(circle at top, #1d4ed8 0, #020617 55%, #020617 100%)",
    color: "#e5e7eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    boxSizing: "border-box",
  },
  app: {
  width: "100%",
  maxWidth: "100%",               // ⬅️ remove width cap
  margin: "0",                    // no centering gap
  padding: "24px 32px 32px",
  borderRadius: "24px",
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,0.9))",
  boxShadow:
    "0 24px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(148,163,184,0.15)",
  border: "1px solid rgba(148,163,184,0.35)",
  boxSizing: "border-box",
},


  header: {
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
  },
  titleBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#9ca3af",
    maxWidth: "460px",
    lineHeight: 1.5,
  },
  badge: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "0.75rem",
    border: "1px solid rgba(96,165,250,0.5)",
    background:
      "radial-gradient(circle at top, rgba(59,130,246,0.35), transparent)",
    color: "#dbeafe",
    whiteSpace: "nowrap",
  },


grid: {
  display: "grid",
  gridTemplateColumns: "280px minmax(0, 1fr)", // left fixed, right takes rest
  gap: "24px",
  marginTop: "8px",
  width: "100%",
  alignItems: "flex-start",
},

rightGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))", // two equal columns
  gap: "16px",
  width: "100%",
},


  card: {
    borderRadius: "18px",
    padding: "16px 16px 18px",
    background:
      "radial-gradient(circle at top left, rgba(37,99,235,0.15), transparent 55%), #020617",
    border: "1px solid rgba(30,64,175,0.55)",
    boxShadow: "0 16px 35px rgba(15,23,42,0.8)",
  },

  vhcard: {
    borderRadius: "18px",
    padding: "16px 16px 18px",
    width: "400px",
    background:
      "radial-gradient(circle at top left, rgba(37,99,235,0.15), transparent 55%), #020617",
    border: "1px solid rgba(30,64,175,0.55)",
    boxShadow: "0 16px 35px rgba(15,23,42,0.8)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  cardHeaderStack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "2px",
    marginBottom: "10px",
  },


  cardTitle: {
    fontSize: "1rem",
    fontWeight: 600,
  },
  cardHint: {
    fontSize: "0.8rem",
    color: "#9ca3af",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "12px",
  },
  input: {
    padding: "9px 10px",
    borderRadius: "10px",
    border: "1px solid rgba(148,163,184,0.7)",
    fontSize: "0.9rem",
    backgroundColor: "rgba(15,23,42,0.9)",
    color: "#e5e7eb",
    outline: "none",
  },
  select: {
    padding: "9px 10px",
    borderRadius: "10px",
    border: "1px solid rgba(148,163,184,0.7)",
    fontSize: "0.9rem",
    backgroundColor: "rgba(15,23,42,0.9)",
    color: "#e5e7eb",
    outline: "none",
  },
  button: {
    marginTop: "2px",
    padding: "9px 12px",
    borderRadius: "999px",
    border: "none",
    background:
      "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "white",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    boxShadow: "0 10px 25px rgba(37,99,235,0.5)",
  },
  buttonSmall: {
    padding: "6px 11px",
    borderRadius: "999px",
    border: "none",
    background:
      "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "white",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: 500,
    boxShadow: "0 8px 20px rgba(22,163,74,0.4)",
  },
  buttonDanger: {
    padding: "5px 10px",
    borderRadius: "999px",
    border: "none",
    background:
      "linear-gradient(135deg, #ef4444, #b91c1c)",
    color: "white",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: 500,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.85rem",
    marginTop: "4px",
  },

leftColumn: {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  },

  tableHeaderCell: {
    textAlign: "left",
    padding: "6px 4px",
    color: "#9ca3af",
    borderBottom: "1px solid rgba(31,41,55,0.9)",
    fontWeight: 500,
  },
  tableCell: {
    padding: "6px 4px",
    borderBottom: "1px solid rgba(31,41,55,0.6)",
  },
  typeBadge: (type) => ({
    padding: "2px 8px",
    borderRadius: "999px",
    fontSize: "0.7rem",
    fontWeight: 500,
    backgroundColor:
      type === "CONSTANT" ? "rgba(34,197,94,0.16)" : "rgba(59,130,246,0.16)",
    color: type === "CONSTANT" ? "#bbf7d0" : "#bfdbfe",
    border:
      type === "CONSTANT"
        ? "1px solid rgba(34,197,94,0.5)"
        : "1px solid rgba(59,130,246,0.5)",
  }),
  formulaCard: {
    borderRadius: "14px",
    padding: "10px 11px",
    marginBottom: "8px",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.85))",
    border: "1px solid rgba(55,65,81,0.85)",
  },
  formulaName: {
    fontSize: "0.9rem",
    fontWeight: 600,
    marginBottom: "4px",
  },
  formulaExpression: {
    fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    fontSize: "0.8rem",
    color: "#9ca3af",
  },
listCard: {
  minHeight: "380px",        // ⬅️ make the list cards taller
  display: "flex",
  flexDirection: "column",
},

listBody: {
  marginTop: "6px",
  flex: 1,                    // ⬅️ take up remaining card height
  overflowY: "auto",
  paddingRight: "4px",
},

};
