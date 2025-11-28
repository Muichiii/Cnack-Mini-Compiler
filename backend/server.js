console.log("RUNTIME __dirname:", __dirname);

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());

// Path to lexer executable
const LEXER_PATH = path.join(__dirname, 'bin', 'lexer.exe');

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Lexical Analyzer API is running!' });
});

// -----------------------------
//  LEXICAL ANALYSIS ENDPOINT
// -----------------------------
app.post('/lexical', (req, res) => {
  const { code } = req.body;

  // Validate user input
  if (!code || code.trim() === '') {
    return res.status(400).json({
      error: 'Empty code: Please enter some code to analyze.'
    });
  }

  // Ensure lexer exists
  if (!fs.existsSync(LEXER_PATH)) {
    return res.status(500).json({
      error: `lexer.exe NOT FOUND at: ${LEXER_PATH}.
Place your compiled lexer.exe inside the /bin folder.`
    });
  }

  // Spawn lexer.exe
  const lexer = spawn(LEXER_PATH);

  let output = '';
  let errorOutput = '';

  lexer.stdout.on('data', (data) => {
    output += data.toString();
  });

  lexer.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  lexer.on('close', () => {
    if (errorOutput) {
      return res.status(500).json({
        error: `Lexer error: ${errorOutput}`
      });
    }

    return res.json({
      success: true,
      output: output || 'No output generated.'
    });
  });

  // Write code to STDIN
  lexer.stdin.write(code);
  lexer.stdin.end();
});

// -----------------------------
//  ERROR HANDLER
// -----------------------------
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  return res.status(500).json({
    error: 'Internal server error.'
  });
});

// -----------------------------
//  START SERVER
// -----------------------------
app.listen(PORT, () => {
  console.log(`\n🚀 Lexical Analyzer API running at: http://localhost:${PORT}`);
  console.log(`📁 Expecting lexer at: ${LEXER_PATH}`);
  console.log(`✅ Ready to accept requests!\n`);
});
