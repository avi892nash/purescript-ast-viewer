// Tree-sitter AST Pretty Printer
export function prettyPrintAST(node, options = {}) {
  const {
    indent = 0,
    showPositions = false, // Default to false for cleaner initial view
    showText = true,
    maxTextLength = 50,
    compactMode = false // Default to false, as multi-line is usually preferred for AST
  } = options;
  
  if (!node) return 'null';
  
  const spaces = ' '.repeat(indent);
  const result = [];
  
  let nodeInfo = `(${node.type}`;
  
  if (showPositions) {
    nodeInfo += ` [${node.startPosition.row}:${node.startPosition.column}-${node.endPosition.row}:${node.endPosition.column}]`;
  }
  
  if (showText && node.childCount === 0 && node.text) {
    let text = node.text.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
    if (text.length > maxTextLength) {
      text = text.substring(0, maxTextLength) + '...';
    }
    if (text.trim()) { // Only add text if it's not just whitespace
      nodeInfo += ` "${text}"`;
    }
  }
  
  if (node.childCount === 0) {
    return spaces + nodeInfo + ')';
  }
  
  result.push(spaces + nodeInfo);
  
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child) {
      const fieldName = node.fieldNameForChild(i);
      let childStr = prettyPrintAST(child, {
        ...options,
        indent: indent + 2
      });
      
      // Add field name prefix if it exists
      if (fieldName) {
        const childSpaces = ' '.repeat(indent + 2);
        childStr = childSpaces + fieldName + ': ' + childStr.trim();
      }
      
      result.push(childStr);
    }
  }
  
  result.push(spaces + ')');
  
  // Compact mode logic (might need refinement based on desired output)
  if (compactMode && node.childCount <= 2) {
    const joined = result.map(s => s.trim()).join(' ');
    if (joined.length <= 100 && !joined.includes('\n')) { // Check length and ensure no newlines from children
      return spaces + joined.replace(/\s+/g, ' ').replace(/\( /g, '(').replace(/ \)/g, ')');
    }
  }
  
  return result.join('\n');
}

// Alternative S-expression style formatter
export function astToSExpression(node, options = {}) {
  const { showText = true, maxDepth = Infinity, currentDepth = 0 } = options;
  
  if (!node || currentDepth >= maxDepth) return 'null';
  
  const parts = [node.type];
  
  if (showText && node.childCount === 0 && node.text && node.text.trim()) {
    parts.push(`"${node.text.replace(/"/g, '\\"')}"`);
  }
  
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child) {
      const fieldName = node.fieldNameForChild(i);
      let childPart = astToSExpression(child, {
        ...options,
        currentDepth: currentDepth + 1
      });
      
      // Add field name prefix if it exists
      if (fieldName) {
        childPart = fieldName + ': ' + childPart;
      }
      
      parts.push(childPart);
    }
  }
  
  return `(${parts.join(' ')})`;
}

// Simplified tree view
export function astToTree(node, options = {}) {
  const { 
    indent = 0, 
    showText = true, 
    useUnicode = true,
    isLast = true,
    prefix = ''
  } = options;
  
  if (!node) return '';
  
  const connector = useUnicode ? 
    (isLast ? '└── ' : '├── ') : 
    (isLast ? '`-- ' : '|-- ');
  
  let line = prefix + connector + node.type;
  
  if (showText && node.childCount === 0 && node.text && node.text.trim()) {
    const text = node.text.replace(/\n/g, '\\n').replace(/\t/g, '\\t');
    line += `: "${text}"`;
  }
  
  const result = [line];
  
  const childPrefix = prefix + (isLast ? '    ' : '│   ');
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child) {
      const fieldName = node.fieldNameForChild(i);
      const childIsLast = i === node.childCount - 1;
      
      let childTree = astToTree(child, {
        ...options,
        prefix: childPrefix,
        isLast: childIsLast
      });
      
      // Add field name to the first line if it exists
      if (fieldName && childTree) {
        const lines = childTree.split('\n');
        const firstLine = lines[0];
        const connector = firstLine.match(/^(\s*)(└──|├──|\`--|--\s)/);
        if (connector) {
          lines[0] = firstLine.replace(connector[2], connector[2] + fieldName + ': ');
          childTree = lines.join('\n');
        }
      }
      
      result.push(childTree);
    }
  }
  
  return result.join('\n');
}

// JSON-like representation
export function astToJSON(node, options = {}) {
  const { showText = true, showPositions = false, maxDepth = Infinity, currentDepth = 0 } = options;
  
  if (!node || currentDepth >= maxDepth) return null;
  
  const result = {
    type: node.type,
    ...(showPositions && {
      start: { row: node.startPosition.row, column: node.startPosition.column },
      end: { row: node.endPosition.row, column: node.endPosition.column }
    }),
    ...(showText && node.childCount === 0 && node.text && { text: node.text })
  };
  
  if (node.childCount > 0) {
    result.children = [];
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child) {
        const fieldName = node.fieldNameForChild(i);
        const childJSON = astToJSON(child, {
          ...options,
          currentDepth: currentDepth + 1
        });
        
        // Add field name if it exists
        if (fieldName && childJSON) {
          result.children.push({
            fieldName: fieldName,
            ...childJSON
          });
        } else {
          result.children.push(childJSON);
        }
      }
    }
  }
  
  return result;
}