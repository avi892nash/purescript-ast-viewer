# PureScript Tree-Sitter Viewer & Query Dashboard

![PureScript AST Viewer](./logo.png)

A comprehensive web-based Tree-Sitter query dashboard for PureScript code analysis. Explore PureScript code structure, run custom queries, and learn Tree-Sitter patterns through an interactive interface.

## Features

- 🌳 **Interactive AST Visualization**: View PureScript code as S-expressions (AST)
- 🔍 **Tree-Sitter Query Engine**: Run custom Tree-Sitter queries against PureScript code
- 📚 **Comprehensive Examples Library**: Pre-built queries for common PureScript patterns including:
  - Finding Module Names
  - Finding Import Statements with Submodules  
  - Finding Function Names
  - Finding Type Signature Names
  - Finding Data Declaration Names
  - Finding Constructor Names
  - Finding Type Class Names
  - Finding Instance Names
  - Finding String & Integer Literals
  - Finding Variable References
  - Finding Record Field Names
  - Finding Case Patterns
  - Finding Let Binding Names
  - Finding Do Block Bindings
  - And many more...
- ⚡ **Real-time Parsing**: Instant AST generation and query execution
- 🎨 **Clean Dashboard Interface**: Four-panel layout for code, AST, queries, and results
- 🚀 **Educational Tool**: Perfect for learning Tree-Sitter query syntax and PureScript structure

## Interface Overview

The dashboard consists of four main panels:

1. **PureScript Code**: Input area for your PureScript source code
2. **S-Expression (AST)**: Real-time AST visualization of the parsed code
3. **Tree-Sitter Query**: Query editor for writing custom Tree-Sitter patterns
4. **Query Results**: Output showing matches from your queries

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/purescript-ast-viewer.git
   cd purescript-ast-viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Basic Usage
1. Enter or paste PureScript code in the "PureScript Code" panel
2. Click "Parse Code" to generate the AST
3. View the S-expression representation in the "S-Expression (AST)" panel

### Running Queries
1. Select an example from the sidebar or write a custom Tree-Sitter query
2. Enter your query in the "Tree-Sitter Query" panel
3. Execute the query to see matches in the "Query Results" panel

### Learning with Examples
- Browse the extensive examples in the left sidebar
- Each example demonstrates a specific Tree-Sitter pattern for PureScript
- Examples cover common use cases like finding imports, functions, types, and more
- Use examples as starting points for your own custom queries

## Query Examples

The dashboard includes ready-to-use queries for:

- **Module Analysis**: Find module declarations and imports
- **Function Discovery**: Locate function definitions and signatures
- **Type System**: Find type declarations, classes, and instances
- **Data Structures**: Locate constructors, records, and field names
- **Control Flow**: Find case patterns, let bindings, and do blocks
- **Literals**: Extract string and numeric literals from code

## Technology Stack

- **React** - UI framework
- **Vite** - Build tool and development server  
- **Tree-sitter** - Parsing library with PureScript grammar
- **web-tree-sitter** - WebAssembly bindings for browser usage

## Use Cases

- **Code Analysis**: Analyze PureScript codebases for patterns and structure
- **Learning Tool**: Understand how Tree-Sitter parses PureScript syntax
- **Query Development**: Develop and test Tree-Sitter queries interactively
- **Educational Resource**: Learn PureScript AST structure and Tree-Sitter patterns

## Contributing

Contributions are welcome! Please feel free to submit:
- New query examples
- UI improvements
- Bug fixes
- Documentation updates

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
