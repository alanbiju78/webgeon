// App.jsx
import React, { useReducer, useEffect } from "react";
import { appReducer, initialState } from "./state/appReducer";
import { styles } from "./styles";

import VariableForm from "./components/variables/VariableForm";
import VariablesList from "./components/variables/VariablesList";
import FormulaForm from "./components/formulas/FormulaForm";
import FormulasList from "./components/formulas/FormulasList";

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("formula_builder_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.variables && parsed.formulas) {
          dispatch({ type: "LOAD_STATE", payload: parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("formula_builder_state", JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state", e);
    }
  }, [state]);

  return (
    <div style={styles.app}>
      <h1>Formula Builder</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2>Variables</h2>
          <VariableForm
            onAdd={(variable) =>
              dispatch({ type: "ADD_VARIABLE", payload: variable })
            }
          />
          <VariablesList
            variables={state.variables}
            onDelete={(id) => dispatch({ type: "DELETE_VARIABLE", id })}
          />
        </div>

        <div style={styles.card}>
          <h2>Formulas</h2>
          <FormulaForm
            onAdd={(formula) =>
              dispatch({ type: "ADD_FORMULA", payload: formula })
            }
            variables={state.variables}
          />
          <FormulasList
            formulas={state.formulas}
            variables={state.variables}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
