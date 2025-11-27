// src/utils/expressionUtils.js

// -------- variable + placeholder helpers --------

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

// -------- math evaluator (PEMDAS + parentheses) --------

export function evaluateMathExpression(expr) {
  // remove spaces
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
  return stack[0];             // 👈 always returns a number
}

// -------- variable evaluation (with dependencies) --------

// Evaluate all variables and return a map: { VAR_NAME: numericValue }
export function evaluateAllVariables(variables) {
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
export function evaluateFormulaExpression(expression, variables) {
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

  return evaluateMathExpression(expr);   // 👈 THIS is the important return
}
