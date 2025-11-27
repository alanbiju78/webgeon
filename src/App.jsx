// src/App.jsx
import { useReducer, useEffect, useState } from "react";
import { styles } from "./styles";

import VariableForm from "./components/variables/VariableForm";
import VariablesList from "./components/variables/VariablesList";
import FormulaForm from "./components/formulas/FormulaForm";
import FormulasList from "./components/formulas/FormulasList";

// --------- Reducer & initial state ---------

const initialState = {
  variables: [],
  formulas: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_VARIABLE":
      return {
        ...state,
        variables: [...state.variables, action.payload],
      };

    case "UPDATE_VARIABLE":
      return {
        ...state,
        variables: state.variables.map((v) =>
          v.id === action.payload.id ? action.payload : v
        ),
      };

    case "DELETE_VARIABLE":
      return {
        ...state,
        variables: state.variables.filter((v) => v.id !== action.id),
      };

    case "ADD_FORMULA":
      return {
        ...state,
        formulas: [...state.formulas, action.payload],
      };

    case "UPDATE_FORMULA":
      return {
        ...state,
        formulas: state.formulas.map((f) =>
          f.id === action.payload.id ? action.payload : f
        ),
      };

    case "DELETE_FORMULA":
      return {
        ...state,
        formulas: state.formulas.filter((f) => f.id !== action.id),
      };

    case "LOAD_STATE":
      return action.payload;

    default:
      return state;
  }
}

// --------- App component ---------

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // which variable / formula is currently being edited
  const [editingVariable, setEditingVariable] = useState(null);
  const [editingFormula, setEditingFormula] = useState(null);

  // load from localStorage once
  useEffect(() => {
    try {
      const saved = localStorage.getItem("formula_builder_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.variables && parsed.formulas) {
          dispatch({ type: "LOAD_STATE", payload: parsed });
        }
      }
    } catch (err) {
      console.error("Failed to load state", err);
    }
  }, []);

  // save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem("formula_builder_state", JSON.stringify(state));
    } catch (err) {
      console.error("Failed to save state", err);
    }
  }, [state]);

  return (
    <div style={styles.page}>
      <div style={styles.app}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleBlock}>
            <h1 style={styles.title}>Formula Builder</h1>
            <p style={styles.subtitle}>
              Define reusable salary or billing variables, plug them into
              dynamic formulas, and execute them with contextual inputs — all in
              your browser.
            </p>
          </div>
        </div>

        {/* Main grid: left = forms, right = lists */}
        <div style={styles.grid}>
          {/* LEFT COLUMN: forms */}
          <div style={styles.leftColumn}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Variables</h2>
                <span style={styles.cardHint}>
                  Constants &amp; derived values
                </span>
              </div>

              <VariableForm
                onAdd={(variable) =>
                  dispatch({ type: "ADD_VARIABLE", payload: variable })
                }
                onUpdate={(variable) =>
                  dispatch({ type: "UPDATE_VARIABLE", payload: variable })
                }
                editingVariable={editingVariable}
                setEditingVariable={setEditingVariable}
              />
            </div>

            <div style={styles.card}>
              {/* stacked header to avoid overlap */}
              <div style={styles.cardHeaderStack}>
                <span style={styles.cardTitle}>Formulas</span>
                <span style={styles.cardHint}>
                  Use variables &amp; contextual inputs
                </span>
              </div>

              <FormulaForm
                onAdd={(formula) =>
                  dispatch({ type: "ADD_FORMULA", payload: formula })
                }
                onUpdate={(formula) =>
                  dispatch({ type: "UPDATE_FORMULA", payload: formula })
                }
                editingFormula={editingFormula}
                setEditingFormula={setEditingFormula}
                variables={state.variables}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: lists (side by side) */}
          <div style={styles.rightGrid}>
            {/* Variable list card */}
            <div style={{ ...styles.card, ...styles.listCard }}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Variable List</h2>
              </div>
              <div style={styles.listBody}>
                <VariablesList
                  variables={state.variables}
                  onDelete={(id) =>
                    dispatch({ type: "DELETE_VARIABLE", id })
                  }
                  onEdit={(variable) => {
                    setEditingVariable(variable);
                    // scroll left form into view if needed (optional)
                  }}
                />
              </div>
            </div>

            {/* Formula list card */}
            <div style={{ ...styles.card, ...styles.listCard }}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Formula List</h2>
              </div>
              <div style={styles.listBody}>
                <FormulasList
                  formulas={state.formulas}
                  variables={state.variables}
                  onEdit={(formula) => {
                    setEditingFormula(formula);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
