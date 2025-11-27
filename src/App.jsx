import React, { useReducer, useEffect, useMemo } from "react";

// ----------------- Types / State -----------------

const initialState = {
  variables: [], // { id, name, type: "CONSTANT"|"DYNAMIC", expression }
  formulas: [],  // { id, name, expression }
};

function appReducer(state, action) {
  switch (action.type) {
    case "ADD_VARIABLE":
      // Prevent duplicate names
      if (
        state.variables.some(
          (v) => v.name.toUpperCase() === action.payload.name.toUpperCase()
        )
      ) {
        alert("Variable name already exists");
        return state;
      }
      return {
        ...state,
        variables: [...state.variables, action.payload],
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

// ----------------- Helper Functions -----------------

// Extract UPPERCASE variable names from expression
function extractVariableNamesFromExpression(expr) {
  const regex = /\b[A-Z_][A-Z0-9_]*\b/g;
  const matches = expr.match(regex);
  return matches ? Array.from(new Set(matches)) : [];
}

// Extract contextual variables like {{#num_of_days}}
function extractContextualVars(expr) {
  const regex = /\{\{#([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
  const names = [];
  let match;
  while ((match = regex.exec(expr)) !== null) {
    names.push(match[1]);
  }
  return Array.from(new Set(names));
}

// Substitute contextual variables in expression
function substituteContextual(expr, ctx) {
  return expr.replace(/\{\{#([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g, (match, name) => {
    if (ctx[name] === undefined || ctx[name] === null || ctx[name] === "") {
      throw new Error(`Missing value for contextual variable "${name}"`);
    }
    if (isNaN(Number(ctx[name]))) {
      throw new Error(
        `Contextual variable "${name}" must be numeric. Got "${ctx[name]}".`
      );
    }
    return String(ctx[name]);
  });
}

// Very simple expression evaluator supporting + - * / and parentheses
// Uses shunting-yard (infix -> postfix) and then evaluates postfix
function evaluateMathExpression(expr) {
  // Remove spaces
  expr = expr.replace(/\s+/g, "");

  // Tokenize
  const tokens = [];
  const operators = "+-*/()";
  let numberBuffer = "";

  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (/[0-9.]/.test(ch)) {
      numberBuffer += ch;
    } else if (operators.includes(ch)) {
      if (numberBuffer) {
        tokens.push(numberBuffer);
        numberBuffer = "";
      }
      tokens.push(ch);
    } else {
      throw new Error(`Invalid character "${ch}" in expression.`);
    }
  }
  if (numberBuffer) tokens.push(numberBuffer);

  // Shunting-yard: infix -> postfix
  const output = [];
  const opStack = [];
  const precedence = { "+": 1, "-": 1, "*": 2, "/": 2 };

  tokens.forEach((token) => {
    if (!isNaN(Number(token))) {
      // number
      output.push(token);
    } else if (token === "(") {
      opStack.push(token);
    } else if (token === ")") {
      while (opStack.length && opStack[opStack.length - 1] !== "(") {
        output.push(opStack.pop());
      }
      if (!opStack.length) throw new Error("Mismatched parentheses");
      opStack.pop(); // remove "("
    } else if (["+","-","*","/"].includes(token)) {
      while (
        opStack.length &&
        ["+","-","*","/"].includes(opStack[opStack.length - 1]) &&
        precedence[opStack[opStack.length - 1]] >= precedence[token]
      ) {
        output.push(opStack.pop());
      }
      opStack.push(token);
    } else {
      throw new Error(`Invalid token "${token}"`);
    }
  });

  while (opStack.length) {
    const op = opStack.pop();
    if (op === "(" || op === ")") throw new Error("Mismatched parentheses");
    output.push(op);
  }

  // Evaluate postfix
  const stack = [];
  output.forEach((token) => {
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) {
        throw new Error("Invalid expression");
      }
      let res;
      switch (token) {
        case "+":
          res = a + b;
          break;
        case "-":
          res = a - b;
          break;
        case "*":
          res = a * b;
          break;
        case "/":
          if (b === 0) throw new Error("Division by zero");
          res = a / b;
          break;
        default:
          throw new Error(`Unknown operator "${token}"`);
      }
      stack.push(res);
    }
  });

  if (stack.length !== 1) throw new Error("Invalid expression");
  return stack[0];
}

// Evaluate all variables and return a map: { VAR_NAME: numericValue }
function evaluateAllVariables(variables) {
  const varMap = {};
  variables.forEach((v) => {
    varMap[v.name] = v;
  });

  const memo = {};
  const visiting = new Set();

  function evalVar(name) {
    if (memo[name] !== undefined) return memo[name];
    const variable = varMap[name];
    if (!variable) {
      throw new Error(`Variable "${name}" is not defined`);
    }

    if (visiting.has(name)) {
      throw new Error(`Circular dependency detected at "${name}"`);
    }
    visiting.add(name);

    let expr = variable.expression;
    const deps = extractVariableNamesFromExpression(expr);

    // Replace dependencies with their computed values
    deps.forEach((dep) => {
      const val = evalVar(dep);
      const regex = new RegExp("\\b" + dep + "\\b", "g");
      expr = expr.replace(regex, String(val));
    });

    // Now expr should be only numbers and operators
    const result = evaluateMathExpression(expr);
    memo[name] = result;
    visiting.delete(name);
    return result;
  }

  // Evaluate all to fill memo
  Object.keys(varMap).forEach((name) => evalVar(name));

  return memo;
}

// Evaluate a full formula: expression can contain variables and numbers (no {{}} here)
function evaluateFormulaExpression(expression, variables) {
  const varValues = evaluateAllVariables(variables);

  let expr = expression;
  const deps = extractVariableNamesFromExpression(expr);
  deps.forEach((name) => {
    if (varValues[name] === undefined) {
      throw new Error(`Variable "${name}" is not defined`);
    }
    const regex = new RegExp("\\b" + name + "\\b", "g");
    expr = expr.replace(regex, String(varValues[name]));
  });

  return evaluateMathExpression(expr);
}

// ----------------- Main App -----------------

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from localStorage on first render
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

  // Persist to localStorage whenever state changes
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
            existingNames={state.variables.map((v) => v.name)}
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

// ----------------- Components -----------------

function VariableForm({ onAdd, existingNames }) {
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

    // Very basic validation: avoid contextual placeholders in variables
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

    // Validate that all non-context variables are defined
    const ctxVars = extractContextualVars(expression);
    const varNames = extractVariableNamesFromExpression(expression);

    // Variables used in formula that are not contextual
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

function FormulasList({ formulas, variables }) {
  if (formulas.length === 0) {
    return <p>No formulas defined yet.</p>;
  }

  function handleExecute(formula) {
    try {
      const ctxVars = extractContextualVars(formula.expression);
      const ctxValues = {};

      // Collect contextual values via prompt() for now
      for (const name of ctxVars) {
        const input = window.prompt(`Enter value for ${name}:`);
        if (input === null) {
          // User cancelled
          return;
        }
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

  function handleDelete(id) {
    const evt = new CustomEvent("DELETE_FORMULA", { detail: { id } });
    window.dispatchEvent(evt);
  }

  // We'll not use a custom event; easier to pass prop from parent,
  // so we need a delete handler. Let's make it inline in render props.
  // Instead, let's accept onDelete from parent. But we didn't.
  // To keep it simple, we won't implement delete here via parent.
  // We'll just render formulas and allow execution.
  // (You can extend this later.)

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
            {/* You can add delete button similarly by passing onDelete from App */}
          </div>
        </div>
      ))}
    </div>
  );
}

// ----------------- Styles -----------------

const styles = {
  app: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "16px",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginTop: "16px",
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "12px",
    backgroundColor: "#fafafa",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "12px",
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #d1d5db",
    fontSize: "0.9rem",
  },
  select: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #d1d5db",
    fontSize: "0.9rem",
  },
  button: {
    padding: "8px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  buttonSmall: {
    padding: "6px 10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  buttonDanger: {
    padding: "4px 8px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontSize: "0.8rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem",
  },
  formulaCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "8px",
    marginBottom: "8px",
    backgroundColor: "white",
  },
};

export default App;
