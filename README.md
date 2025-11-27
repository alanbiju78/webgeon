Formula Builder — Dynamic Variable & Expression Engine (React + Vite)

A sleek, client-side formula calculation tool built using React, Vite, and pure JavaScript expression parsing.
It allows users to:

Create variables (constant or dynamic dependencies)

Build formulas using those variables

Use contextual inputs like {{#num_of_days}}

Execute formulas and get real-time results

Everything runs offline, fully in the browser (no backend)

This is ideal for salary calculators, billing logic, reusable computations, or any domain that uses modular formulas.

✨ Features
🔢 Variable Engine

Add constant variables (e.g., BASIC = 10000)

Add dynamic variables using expressions

Example: GROSS = BASIC + DA + HRA

Auto-detect variable dependencies

Auto-evaluate dynamic expressions

Detect circular dependencies

Auto-save variables to localStorage

🧮 Formula Builder

Create formulas like:

NET_SALARY
GROSS - DEDUCTIONS


Use contextual runtime inputs:

MONTHLY_SALARY = (GROSS / 30) * {{#num_of_days}}


Prompts user for contextual inputs on execution

Returns final computed result

🎨 Modern UI

Fully responsive

Clean dark theme

Gradient cards

Scrollable variable & formula lists

Neomorphic buttons

Smooth layout using CSS flex/grid

💾 Persistent Storage

All data is saved to localStorage automatically:

Variables

Formulas

Refresh? Close tab? No problem — everything stays.

⚡ 100% Client-Side

No backend required

Works offline

No API keys

Perfect for hosting on Vercel, Netlify, or GitHub Pages

🛠️ Tech Stack
Layer	Technology
Frontend	React (JSX), Vite
Styling	Inline CSS with gradient UI
Expression Engine	Custom parser (no eval)
Storage	localStorage
Deployment	Vercel
📂 Project Structure
src/
  components/
    variables/
      VariableForm.jsx
      VariablesList.jsx
    formulas/
      FormulaForm.jsx
      FormulasList.jsx
  utils/
      expressionUtils.js     ← Math engine + variable evaluator
  state/
      appReducer.js          ← Optional reducer (clean state mgmt)
  App.jsx
  styles.js                  ← All UI styling

▶️ Running the Project Locally
1. Install dependencies
npm install

2. Run the dev server
npm run dev

3. Build for production
npm run build

4. Preview production build
npm run preview

🌐 Deploying on Vercel

Push code to GitHub

Go to vercel.com → New Project

Import your repo

Select:

Framework: React

Build Tool: Vite

Root directory:

.


No environment variables required

Deploy 🚀

🧩 How Expressions Work
Variables
BASIC = 10000
DA = 2000
HRA = 3000
GROSS = BASIC + DA + HRA

Formulas
NET_SALARY = GROSS - (PF + TAX)

Contextual Inputs
MONTHLY_SALARY = (GROSS / 30) * {{#num_of_days}}


On execution, the user is prompted:

Enter value for num_of_days:

🧠 Expression Engine Details
Supports:

+, -, *, /

Parentheses ()

Multi-level dependencies

Numeric validation

Shunting-yard algorithm

Postfix evaluation

Variable replacement

Error detection:

Missing variable

Invalid numeric input

Circular dependency

Division by zero

Not using:

❌ eval()
❌ Function()
❌ Any external libraries

The entire engine is handwritten for safety and performance.

🧹 TODO / Future Improvements

Add validation UI for formulas

Add real-time calculation preview

Add option to export/import configs as JSON

Add category grouping for variables

Drag-and-drop variable ordering

📝 License

This project is released under the MIT License — free to use, modify, and distribute.

❤️ Credits

Developed with care and attention to UI detail.
Includes a fully custom, safe, extensible math expression interpreter.
