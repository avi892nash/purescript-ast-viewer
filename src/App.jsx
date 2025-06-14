import { useState, useEffect, useRef } from 'react';
import { Parser, Language, Query } from 'web-tree-sitter';
import './App.css';
import { queryExamples as initialExamples } from './examples';
import { prettyPrintAST } from './astFormatters'; // Restore prettyPrintAST import

const defaultCode = `
module Main where

import Prelude
import Effect.Console (log)

main = log "Hello, PureScript!"
`;

const defaultQuery = `
(variable) @var
`;

function App() {
  const [code, setCode] = useState(defaultCode);
  const [query, setQuery] = useState(defaultQuery);
  const [astOutput, setAstOutput] = useState('');
  const [queryResults, setQueryResults] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isParsing, setIsParsing] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const [examples] = useState(initialExamples);
  
  const parserRef = useRef(null);
  const purescriptLangRef = useRef(null);
  const currentTreeRef = useRef(null);

  useEffect(() => {
    async function initializeParser() {
      try {
        setError('');
        await Parser.init();
        const parser = new Parser();
        const langPath = '/tree-sitter-purescript.wasm';
        const PureScript = await Language.load(langPath);
        parser.setLanguage(PureScript);
        
        parserRef.current = parser;
        purescriptLangRef.current = PureScript;
        setIsLoading(false);
        if (code && parserRef.current && purescriptLangRef.current) {
          await handleParse(code, parserRef.current, purescriptLangRef.current);
        }
      } catch (e) {
        console.error("Initialization error:", e);
        setError(`Failed to initialize Tree-sitter parser: ${e.message}. Ensure 'tree-sitter-purescript.wasm' is in the public folder.`);
        setIsLoading(false);
      }
    }
    initializeParser();
  }, [code]);

  const handleParse = async (currentCode, psParser, psLang) => {
    if (!psParser || !psLang) {
      setError('Parser or language not initialized yet.');
      return null;
    }
    setIsParsing(true);
    setError('');
    setAstOutput('');

    let parsedTree = null;
    try {
      const parserInstance = psParser || parserRef.current;
      const languageInstance = psLang || purescriptLangRef.current;
      
      if (!parserInstance || !languageInstance) {
        setError('Parser/Language not available.');
        setIsParsing(false);
        return null;
      }
      
      parserInstance.setLanguage(languageInstance); 
      parsedTree = parserInstance.parse(currentCode);
      currentTreeRef.current = parsedTree;
      // Log the AST using node.toString() for the console
      console.log("Tree-sitter rootNode (raw toString()):", parsedTree.rootNode.toString());
      // Use prettyPrintAST for the UI display
      setAstOutput(prettyPrintAST(parsedTree.rootNode, { showText: true, compactMode: false }));
    } catch (e) {
      console.error("Parsing error:", e);
      setError(`Error parsing code: ${e.message}`);
      currentTreeRef.current = null;
    } finally {
      setIsParsing(false);
    }
    return parsedTree;
  };

  const handleRunQuery = async (currentQuery, treeToQuery) => {
    const targetTree = treeToQuery || currentTreeRef.current;
    const lang = purescriptLangRef.current;

    console.log("handleRunQuery called");
    console.log("Query string:", currentQuery);
    console.log("purescriptLangRef.current:", lang);
    console.log("Tree to query:", targetTree);

    if (!lang) {
      setError('PureScript language not loaded yet.');
      console.error('PureScript language not loaded.');
      return;
    }
    if (!targetTree) {
      setError('No code parsed yet, or parsing failed. Please parse the code first.');
      console.error('No tree parsed yet.');
      return;
    }
    if (!currentQuery || !currentQuery.trim()) {
      setError('Query cannot be empty.');
      console.error('Query is empty.');
      return;
    }

    setIsQuerying(true);
    setError('');
    setQueryResults('');
    console.log("Attempting to create Query object");

    try {
      const treeSitterQuery = new Query(lang, currentQuery);
      console.log("Query object created:", treeSitterQuery);
      const captures = treeSitterQuery.captures(targetTree.rootNode);
      console.log("Captures:", captures);

      if (captures.length === 0) {
        setQueryResults('No captures found for this query.');
        console.log('No captures found.');
      } else {
        const results = captures.map(capture => ({
          name: capture.name,
          text: capture.node.text,
          start: capture.node.startPosition,
          end: capture.node.endPosition,
        }));
        setQueryResults(JSON.stringify(results, null, 2));
        console.log("Query results set:", results);
      }
    } catch (e) {
      console.error("Query error:", e);
      setError(`Error executing query: ${e.message}. Check query syntax.`);
    } finally {
      setIsQuerying(false);
      console.log("handleRunQuery finished");
    }
  };
  
  const onParseButtonClick = async () => {
    if (code && parserRef.current && purescriptLangRef.current) {
      await handleParse(code, parserRef.current, purescriptLangRef.current);
    }
  };

  const onRunQueryButtonClick = async () => {
    await handleRunQuery(query, currentTreeRef.current);
  };

  const handleExampleClick = async (example) => {
    setCode(example.purescriptCode);
    setQuery(example.treeSitterQuery);
    const parsedTree = await handleParse(example.purescriptCode, parserRef.current, purescriptLangRef.current);
    if (parsedTree) {
      await handleRunQuery(example.treeSitterQuery, parsedTree);
    }
  };

  if (isLoading) {
    return <div className="loading-fullscreen">Loading Parser, Language, and Examples...</div>;
  }

  return (
    <div className="App">
      <aside className="sidebar">
        <h2>Examples</h2>
        <ul>
          {examples.map((ex, index) => (
            <li key={index} onClick={() => handleExampleClick(ex)}>
              {ex.title}
            </li>
          ))}
        </ul>
      </aside>
      <main className="main-content">
        <h1>PureScript Tree-Sitter Viewer & Query Dashboard</h1>
        {error && <div className="error-message">{error}</div>}
        
        <div className="container">
          <div className="panel">
            <h2>PureScript Code</h2>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={15}
              cols={60}
              spellCheck="false"
            />
            <button onClick={onParseButtonClick} disabled={isParsing || isLoading}>
              {isParsing ? 'Parsing...' : 'Parse Code'}
            </button>
          </div>

          <div className="panel">
            <h2>S-Expression (AST)</h2>
            <pre className="output-area">{astOutput || (isParsing ? 'Generating AST...' : 'Parse code to see AST.')}</pre>
          </div>
        </div>

        <div className="container">
          <div className="panel">
            <h2>Tree-Sitter Query</h2>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={10}
              cols={60}
              spellCheck="false"
            />
            <button onClick={onRunQueryButtonClick} disabled={!currentTreeRef.current || isQuerying || isLoading}>
              {isQuerying ? 'Querying...' : 'Run Query'}
            </button>
          </div>

          <div className="panel">
            <h2>Query Results</h2>
            <pre className="output-area">{queryResults || (isQuerying ? 'Fetching results...' : 'Run query to see results.')}</pre>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
