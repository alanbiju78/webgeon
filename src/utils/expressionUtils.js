// utils/expressionUtils.js

// Extract UPPERCASE variable names from expression
export function extractVariableNamesFromExpression(expr) {
  const regex = /\b[A-Z_][A-Z0-9_]*\b/g;
  const matches = expr.match(regex);
  return matches ? Array.from(new Set(matches)) : [];
}

// Extract contextual variables like {{#num_of_days}}
export function extractContextualVars(expr) {
  const regex = /\{\{#([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;
  const names = [];
  let match;
  while ((match = regex.exec(expr)) !== null) {
    names.push(match[1]);
  }
  return Array.from(new Set(names));
}

// Substitute contextual variables in expression
export function substituteContextual(expr, ctx) {
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

// Simple PEMDAS evaluator (same as your current evaluateMathExpression)
export function evaluateMathExpression(expr) {
  // ← copy the same function body from your current App.jsx
  // (no changes needed)
  // ...
}

// Evaluate all variables and return { VAR_NAME: value }
export function evaluateAllVariables(variables) {
  // ← copy same implementation from your current code
  // (uses extractVariableNamesFromExpression + evaluateMathExpression)
  // ...
}

// Evaluate final formula expression (variables already substituted for {{}})
export function evaluateFormulaExpression(expression, variables) {
  // ← same as your current function
  // ...
}
