// import React, { useState } from 'react';

// // API Helper
// const API_URL = 'http://localhost:3001';

// const runLexicalAnalysis = async (code) => {
//   const response = await fetch(`${API_URL}/lexical`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ code })
//   });
  
//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.error || 'Analysis failed');
//   }
  
//   return response.json();
// };

// // Custom Code Editor Component
// const CodeEditor = ({ value, onChange, disabled }) => {
//   const handleKeyDown = (e) => {
//     if (e.key === 'Tab') {
//       e.preventDefault();
//       const start = e.target.selectionStart;
//       const end = e.target.selectionEnd;
//       const newValue = value.substring(0, start) + '    ' + value.substring(end);
//       onChange(newValue);
//       setTimeout(() => {
//         e.target.selectionStart = e.target.selectionEnd = start + 4;
//       }, 0);
//     }
//   };

//   return (
//     <textarea
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       onKeyDown={handleKeyDown}
//       disabled={disabled}
//       spellCheck={false}
//       style={{
//         width: '100%',
//         height: '100%',
//         padding: '16px',
//         fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
//         fontSize: '14px',
//         lineHeight: '1.6',
//         border: 'none',
//         outline: 'none',
//         resize: 'none',
//         background: 'rgba(255, 255, 255, 0.05)',
//         color: '#e0e0e0',
//         tabSize: 4,
//       }}
//       placeholder="// write code here"
//     />
//   );
// };

// // Parse token output into structured data
// const parseTokenOutput = (output) => {
//   const lines = output.split('\n');
//   const tokens = [];
//   let startParsing = false;

//   for (const line of lines) {
//     // Skip until we find the separator line
//     if (line.includes('-------|')) {
//       startParsing = true;
//       continue;
//     }

//     // Start parsing after the separator
//     if (startParsing && line.trim()) {
//       // Parse line format: "1      | KEYWORD      | int"
//       const parts = line.split('|').map(p => p.trim());
//       if (parts.length === 3) {
//         tokens.push({
//           line: parts[0],
//           type: parts[1],
//           lexeme: parts[2]
//         });
//       }
//     }
//   }

//   return tokens;
// };

// // Output Component with Table
// const Output = ({ output, error, loading }) => {
//   const tokens = output ? parseTokenOutput(output) : [];

//   return (
//     <div style={{ 
//       display: 'flex', 
//       flexDirection: 'column', 
//       height: '100%',
//       background: 'linear-gradient(180deg, #2a3f5f 0%, #1a2332 100%)'
//     }}>
//       <div style={{ 
//         padding: '16px 24px', 
//         background: 'rgba(0, 0, 0, 0.2)',
//         borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
//         color: '#fff',
//         fontWeight: '600',
//         fontSize: '16px',
//         letterSpacing: '0.5px'
//       }}>
//         Output
//       </div>
      
//       <div style={{ 
//         flex: 1, 
//         overflow: 'auto',
//         padding: '24px'
//       }}>
//         {error ? (
//           <div style={{
//             background: 'rgba(244, 67, 54, 0.1)',
//             border: '1px solid rgba(244, 67, 54, 0.3)',
//             borderRadius: '8px',
//             padding: '16px',
//             color: '#ff6b6b'
//           }}>
//             <strong>❌ Error:</strong>
//             <div style={{ marginTop: '8px' }}>{error}</div>
//           </div>
//         ) : loading ? (
//           <div style={{ 
//             textAlign: 'center', 
//             color: '#888',
//             padding: '40px',
//             fontSize: '14px'
//           }}>
//             <div style={{ marginBottom: '12px' }}>⚙️ Analyzing...</div>
//           </div>
//         ) : tokens.length > 0 ? (
//           <div style={{
//             background: 'rgba(255, 255, 255, 0.05)',
//             borderRadius: '8px',
//             overflow: 'hidden',
//             border: '1px solid rgba(255, 255, 255, 0.1)'
//           }}>
//             {/* Table Header */}
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: '100px 200px 1fr',
//               background: 'rgba(100, 149, 237, 0.3)',
//               padding: '16px 20px',
//               fontWeight: '600',
//               fontSize: '13px',
//               color: '#e0e0e0',
//               textTransform: 'uppercase',
//               letterSpacing: '0.5px',
//               borderBottom: '2px solid rgba(255, 255, 255, 0.2)'
//             }}>
//               <div>Line</div>
//               <div>Type</div>
//               <div>Lexeme</div>
//             </div>

//             {/* Table Body */}
//             <div>
//               {tokens.map((token, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     display: 'grid',
//                     gridTemplateColumns: '100px 200px 1fr',
//                     padding: '14px 20px',
//                     background: index % 2 === 0 
//                       ? 'rgba(35, 45, 65, 0.4)' 
//                       : 'rgba(35, 45, 65, 0.2)',
//                     borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
//                     fontSize: '13px',
//                     color: '#d0d0d0',
//                     fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
//                     transition: 'background 0.2s'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.background = 'rgba(70, 120, 200, 0.25)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.background = index % 2 === 0 
//                       ? 'rgba(255, 255, 255, 0.02)' 
//                       : 'rgba(255, 255, 255, 0.05)';
//                   }}
//                 >
//                   <div style={{ color: '#90caf9' }}>{token.line}</div>
//                   <div style={{ 
//                     color: '#a5d6a7',
//                     fontWeight: '500'
//                   }}>
//                     {token.type}
//                   </div>
//                   <div style={{ color: '#fff' }}>{token.lexeme}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div style={{ 
//             textAlign: 'center', 
//             color: '#888',
//             padding: '40px',
//             fontSize: '14px'
//           }}>
//             Click analyze to see the output
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Editor Component
// const Editor = ({ code, setCode, onRun, onClear, loading }) => {
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//       <div style={{ 
//         padding: '16px 24px', 
//         background: 'rgba(0, 0, 0, 0.2)',
//         borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <div style={{
//           color: '#fff',
//           fontWeight: '600',
//           fontSize: '16px',
//           letterSpacing: '0.5px'
//         }}>
//           Code Input
//         </div>
//         <button
//           onClick={onClear}
//           disabled={loading}
//           style={{
//             padding: '6px 14px',
//             background: 'rgba(255, 255, 255, 0.1)',
//             color: '#fff',
//             border: '1px solid rgba(255, 255, 255, 0.2)',
//             borderRadius: '4px',
//             cursor: loading ? 'not-allowed' : 'pointer',
//             fontSize: '12px',
//             fontWeight: '500',
//             transition: 'all 0.2s',
//             opacity: loading ? 0.5 : 1
//           }}
//           onMouseEnter={(e) => {
//             if (!loading) {
//               e.target.style.background = 'rgba(255, 255, 255, 0.2)';
//               e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (!loading) {
//               e.target.style.background = 'rgba(255, 255, 255, 0.1)';
//               e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
//             }
//           }}
//         >
//           Clear
//         </button>
//       </div>
      
//       <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
//         <CodeEditor 
//           value={code}
//           onChange={setCode}
//           disabled={loading}
//         />
//       </div>

//       <div style={{ padding: '16px 24px' }}>
//         <button
//           onClick={onRun}
//           disabled={loading}
//           style={{
//             width: '100%',
//             padding: '14px',
//             background: loading 
//               ? 'rgba(100, 149, 237, 0.5)' 
//               : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             cursor: loading ? 'not-allowed' : 'pointer',
//             fontWeight: '600',
//             fontSize: '14px',
//             letterSpacing: '0.5px',
//             textTransform: 'uppercase',
//             transition: 'all 0.3s',
//             boxShadow: loading 
//               ? 'none' 
//               : '0 4px 15px rgba(102, 126, 234, 0.4)'
//           }}
//           onMouseEnter={(e) => {
//             if (!loading) {
//               e.target.style.transform = 'translateY(-2px)';
//               e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (!loading) {
//               e.target.style.transform = 'translateY(0)';
//               e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
//             }
//           }}
//         >
//           {loading ? '⚙️ Analyzing...' : 'Analyze Code'}
//         </button>
//       </div>
//     </div>
//   );
// };

// // Main App Component
// const App = () => {
//   const [code, setCode] = useState('// write code here\nint main() {\n    int x = 10;\n    return 0;\n}');
//   const [output, setOutput] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleRun = async () => {
//     if (!code.trim()) {
//       setError('Please enter some code to analyze');
//       setOutput('');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setOutput('');

//     try {
//       const result = await runLexicalAnalysis(code);
//       setOutput(result.output);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClear = () => {
//     setCode('');
//     setOutput('');
//     setError('');
//   };

//   return (
//     <div style={{ 
//       display: 'flex', 
//       flexDirection: 'column', 
//       height: '100vh',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//       background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
//     }}>
//       {/* Two-panel layout */}
//       <div style={{ 
//         display: 'flex', 
//         flex: 1, 
//         overflow: 'hidden',
//         padding: '20px',
//         gap: '20px'
//       }}>
//         {/* Left Panel - Editor */}
//         <div style={{ 
//           flex: 1, 
//           background: 'linear-gradient(180deg, #2a3f5f 0%, #1a2332 100%)',
//           borderRadius: '12px',
//           display: 'flex',
//           flexDirection: 'column',
//           minWidth: 0,
//           boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
//           overflow: 'hidden'
//         }}>
//           <Editor 
//             code={code}
//             setCode={setCode}
//             onRun={handleRun}
//             onClear={handleClear}
//             loading={loading}
//           />
//         </div>

//         {/* Right Panel - Output */}
//         <div style={{ 
//           flex: 1, 
//           background: 'linear-gradient(180deg, #2a3f5f 0%, #1a2332 100%)',
//           borderRadius: '12px',
//           display: 'flex',
//           flexDirection: 'column',
//           minWidth: 0,
//           boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
//           overflow: 'hidden'
//         }}>
//           <Output output={output} error={error} loading={loading} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;



import React, { useState } from 'react';

// API Helper
const API_URL = 'http://localhost:3001';

const runLexicalAnalysis = async (code) => {
  const response = await fetch(`${API_URL}/lexical`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Analysis failed');
  }

  return response.json();
};

// -------------------- Code Editor --------------------
const CodeEditor = ({ value, onChange, disabled }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      const newValue =
        value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      placeholder="// write code here"
      spellCheck={false}
      style={{
        width: '100%',
        height: '100%',
        padding: '16px',
        fontFamily: '"Fira Code", "Consolas", monospace',
        fontSize: '14px',
        lineHeight: '1.6',
        resize: 'none',
        border: 'none',
        outline: 'none',
        background: 'rgba(255,255,255,0.05)',
        color: '#e0e0e0',
        overflowY: 'auto',
      }}
    />
  );
};

// -------------------- Parsing Output --------------------
const parseTokenOutput = (output) => {
  const lines = output.split('\n');
  const tokens = [];
  let startParsing = false;

  for (const line of lines) {
    if (line.includes('-------|')) {
      startParsing = true;
      continue;
    }

    if (startParsing && line.trim()) {
      const parts = line.split('|').map((p) => p.trim());
      if (parts.length === 3) {
        tokens.push({
          line: parts[0],
          type: parts[1],
          lexeme: parts[2],
        });
      }
    }
  }

  return tokens;
};

// -------------------- Output Component --------------------
const Output = ({ output, error, loading }) => {
  const tokens = output ? parseTokenOutput(output) : [];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 24px',
          background: 'rgba(0,0,0,0.2)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          fontWeight: '600',
        }}
      >
        Output
      </div>

      {/* Scrollable Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
        }}
      >
        {error ? (
          <div
            style={{
              background: 'rgba(244,67,54,0.1)',
              border: '1px solid rgba(244,67,54,0.3)',
              padding: '16px',
              borderRadius: '8px',
              color: '#ff6b6b',
            }}
          >
            <strong>Error:</strong>
            <div>{error}</div>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            ⚙️ Analyzing...
          </div>
        ) : tokens.length > 0 ? (
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 200px 1fr',
                padding: '14px 20px',
                background: 'rgba(100,149,237,0.3)',
                fontWeight: '600',
              }}
            >
              <div>Line</div>
              <div>Type</div>
              <div>Lexeme</div>
            </div>

            {/* Body */}
            <div>
              {tokens.map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 200px 1fr',
                    padding: '12px 20px',
                    background:
                      i % 2 === 0
                        ? 'rgba(35,45,65,0.4)'
                        : 'rgba(35,45,65,0.2)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div style={{ color: '#90caf9' }}>{t.line}</div>
                  <div style={{ color: '#a5d6a7' }}>{t.type}</div>
                  <div style={{ color: '#fff' }}>{t.lexeme}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
            Click analyze to see output
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------- Editor Component --------------------
const Editor = ({ code, setCode, onRun, onClear, loading }) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 24px',
          background: 'rgba(0,0,0,0.2)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ color: '#fff', fontWeight: '600' }}>Code Input</div>

        <button
          onClick={onClear}
          disabled={loading}
          style={{
            padding: '6px 14px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Clear
        </button>
      </div>

      {/* Code Editor */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <CodeEditor value={code} onChange={setCode} disabled={loading} />
      </div>

      {/* Analyze Button */}
      <div style={{ padding: '16px 24px' }}>
        <button
          onClick={onRun}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading
              ? 'rgba(100,149,237,0.5)'
              : 'linear-gradient(135deg,#667eea,#764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          {loading ? '⚙️ Analyzing...' : 'Analyze Code'}
        </button>
      </div>
    </div>
  );
};

// -------------------- Main App --------------------
const App = () => {
  const [code, setCode] = useState(
    '// write code here\nint main() {\n    int x = 10;\n    return 0;\n}'
  );

  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const res = await runLexicalAnalysis(code);
      setOutput(res.output);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setOutput('');
    setError('');
  };

  return (
    <div
      style={{
        height: '100vh',
        background: 'linear-gradient(135deg,#1e3c72,#2a5298)',
        padding: '20px',
        display: 'flex',
        gap: '20px',
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(180deg,#2a3f5f,#1a2332)',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <Editor
          code={code}
          setCode={setCode}
          onRun={handleRun}
          onClear={handleClear}
          loading={loading}
        />
      </div>

      {/* Right Panel */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(180deg,#2a3f5f,#1a2332)',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <Output output={output} error={error} loading={loading} />
      </div>
    </div>
  );
};

export default App;
