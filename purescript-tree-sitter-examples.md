# PureScript Tree-sitter Query Examples

## Overview

This document demonstrates Tree-sitter queries for PureScript code with clear examples showing the input code, query pattern, and expected results.

## Module and Import Queries

### Finding Module Names

**What we're doing:** Extract the module name from a PureScript module declaration

**PureScript Code:**
```purescript
module Main where
```

**Tree-sitter Query:**
```scm
(purescript name: (qualified_module (module) @module.name))
```

**Expected Response:**
```json
[
  { "name": "module.name", "text": "Main" }
]
```

---

### Finding Import Statements with Submodules

**What we're doing:** Extract module and submodule names from qualified imports

**PureScript Code:**
```purescript
module Main where
import Data.Maybe (Maybe(..), fromMaybe)
```

**Tree-sitter Query:**
```scm
(import module: (qualified_module (module) @import.module (module) @import.submodule))
```

**Expected Response:**
```json
[
  { "name": "import.module", "text": "Data" },
  { "name": "import.submodule", "text": "Maybe" }
]
```

---

## Function and Value Declaration Queries

### Finding Function Names

**What we're doing:** Extract function names from function declarations

**PureScript Code:**
```purescript
module Main where
f1 = 1
f2 = 2
```

**Tree-sitter Query:**
```scm
(function name: (variable) @func.name)
```

**Expected Response:**
```json
[
  { "name": "func.name", "text": "f1" },
  { "name": "func.name", "text": "f2" }
]
```

---

### Finding Type Signature Names

**What we're doing:** Extract function names from type signatures

**PureScript Code:**
```purescript
module Main where
myFunction :: Int -> Int
myFunction x = x + 1
```

**Tree-sitter Query:**
```scm
(signature name: (variable) @sig.name)
```

**Expected Response:**
```json
[
  { "name": "sig.name", "text": "myFunction" }
]
```

---

## Data Type and Type Class Queries

### Finding Data Declaration Names

**What we're doing:** Extract the name of data type declarations

**PureScript Code:**
```purescript
module Main where
data MyData a = MyConstructor1 a | MyConstructor2 String
```

**Tree-sitter Query:**
```scm
(data name: (type) @data.name)
```

**Expected Response:**
```json
[
  { "name": "data.name", "text": "MyData" }
]
```

---

### Finding Constructor Names

**What we're doing:** Extract constructor names from data declarations

**PureScript Code:**
```purescript
module Main where
data MyData = Constructor1 | Constructor2 String
```

**Tree-sitter Query:**
```scm
(constructor) @constructor
```

**Expected Response:**
```json
[
  { "name": "constructor", "text": "Constructor1" },
  { "name": "constructor", "text": "Constructor2" }
]
```

---

### Finding Type Class Names

**What we're doing:** Extract type class names from class declarations

**PureScript Code:**
```purescript
module Main where
class MyShow a where
  myShow :: a -> String
```

**Tree-sitter Query:**
```scm
(class_declaration (class_head (class_name (type) @class.name)))
```

**Expected Response:**
```json
[
  { "name": "class.name", "text": "MyShow" }
]
```

---

### Finding Instance Names

**What we're doing:** Extract instance names from type class instances

**PureScript Code:**
```purescript
module Main where
instance myShowInt :: MyShow Int where
  myShow n = "test"
```

**Tree-sitter Query:**
```scm
(class_instance (instance_name) @instance.name)
```

**Expected Response:**
```json
[
  { "name": "instance.name", "text": "myShowInt" }
]
```

---

## Expression and Literal Queries

### Finding String Literals

**What we're doing:** Extract all string literals from expressions

**PureScript Code:**
```purescript
module Main where
message = "Hello" <> "World"
```

**Tree-sitter Query:**
```scm
(string) @string
```

**Expected Response:**
```json
[
  { "name": "string", "text": "\"Hello\"" },
  { "name": "string", "text": "\"World\"" }
]
```

---

### Finding Integer Literals

**What we're doing:** Extract all integer literals from expressions

**PureScript Code:**
```purescript
module Main where
result = 42 + 100
```

**Tree-sitter Query:**
```scm
(integer) @int
```

**Expected Response:**
```json
[
  { "name": "int", "text": "42" },
  { "name": "int", "text": "100" }
]
```

---

### Finding Variable References

**What we're doing:** Extract variable names used in expressions

**PureScript Code:**
```purescript
module Main where
result = x + y
```

**Tree-sitter Query:**
```scm
(exp_name (variable) @var)
```

**Expected Response:**
```json
[
  { "name": "var", "text": "x" },
  { "name": "var", "text": "y" }
]
```

---

### Finding Record Field Names

**What we're doing:** Extract field names from record literals

**PureScript Code:**
```purescript
module Main where
myRec = { foo: 1, bar: "hello" }
```

**Tree-sitter Query:**
```scm
(record_field (field_name) @field.name)
```

**Expected Response:**
```json
[
  { "name": "field.name", "text": "foo" },
  { "name": "field.name", "text": "bar" }
]
```

---

## Control Flow Queries

### Finding Case Patterns

**What we're doing:** Extract literal patterns from case expressions

**PureScript Code:**
```purescript
module Main where
checkValue x = case x of
  0 -> "Zero"
  _ -> "Other"
```

**Tree-sitter Query:**
```scm
(alt pat: (pat_literal (integer) @case.pattern))
```

**Expected Response:**
```json
[
  { "name": "case.pattern", "text": "0" }
]
```

---

### Finding Let Binding Names

**What we're doing:** Extract variable names from let expressions

**PureScript Code:**
```purescript
module Main where
result = let x = 10 in x + 1
```

**Tree-sitter Query:**
```scm
(exp_let_in (declarations (function name: (variable) @let.name)))
```

**Expected Response:**
```json
[
  { "name": "let.name", "text": "x" }
]
```

---

### Finding Do Block Bindings

**What we're doing:** Extract variable names bound in do blocks

**PureScript Code:**
```purescript
module Main where
main = do
  val <- Just 10
  pure val
```

**Tree-sitter Query:**
```scm
(bind_pattern (pat_name (variable) @do.binding))
```

**Expected Response:**
```json
[
  { "name": "do.binding", "text": "val" }
]
```

---

### Finding Let Bindings in Do Blocks

**What we're doing:** Extract variable names from let statements within do blocks

**PureScript Code:**
```purescript
module Main where
main = do
  let message = "Hello"
  pure message
```

**Tree-sitter Query:**
```scm
(statement (let (declarations (function name: (variable) @do.let.name))))
```

**Expected Response:**
```json
[
  { "name": "do.let.name", "text": "message" }
]
```

---

## Advanced Pattern Matching

### Finding Type Alias Names

**What we're doing:** Extract names from type alias declarations

**PureScript Code:**
```purescript
module Main where
type MyRecord = { foo :: Int, bar :: String }
```

**Tree-sitter Query:**
```scm
(type_alias name: (type) @type.alias.name)
```

**Expected Response:**
```json
[
  { "name": "type.alias.name", "text": "MyRecord" }
]
```

---

### Finding Record Type Field Names

**What we're doing:** Extract field names from record type definitions

**PureScript Code:**
```purescript
module Main where
type Point = { x :: Number, y :: Number }
```

**Tree-sitter Query:**
```scm
(row_field (field_name) @record.type.field)
```

**Expected Response:**
```json
[
  { "name": "record.type.field", "text": "x" },
  { "name": "record.type.field", "text": "y" }
]
```

---

## Problematic Queries and Workarounds

### Finding Function Names in Where Clauses

**What we're doing:** Extract function names from where clause declarations (requires workaround)

**PureScript Code:**
```purescript
module Main where
outerFunction x = innerFunction x + 1
  where
  innerFunction y = y * 2
```

**Tree-sitter Query:**
```scm
(where) (declarations (function name: (variable) @where.func.name))
```

**Expected Response:**
```json
[
  { "name": "where.func.name", "text": "innerFunction" }
]
```

**Note:** This query uses a workaround approach since direct structural queries into where clauses often fail. The query matches `where` nodes and then separately matches `declarations` that follow them in the AST structure.

---

## AST Structure Examples

This section shows PureScript code alongside its corresponding Abstract Syntax Tree (AST) structure as generated by tree-sitter-purescript. Understanding these patterns is crucial for writing effective queries.

### Module Declaration

**PureScript Code:**
```purescript
module Main where
```

**AST Structure:**
```
(purescript
  name: (qualified_module
    (module)))
```

**Key Nodes:**
- `purescript` - Root node for the entire file
- `qualified_module` - Container for module path
- `module` - The actual module name token

---

### Simple Function Declaration

**PureScript Code:**
```purescript
myFunc x = x + 1
```

**AST Structure:**
```
(function
  name: (variable)
  patterns: (patterns
    (pat_name
      (variable)))
  body: (exp_infix
    left: (exp_name
      (variable))
    operator: (operator)
    right: (integer)))
```

**Key Nodes:**
- `function` - Function declaration node
- `patterns` - Container for function parameters
- `pat_name` - Pattern for named parameters
- `exp_infix` - Infix expression (operator between operands)

---

### Data Type Declaration

**PureScript Code:**
```purescript
data Maybe a = Nothing | Just a
```

**AST Structure:**
```
(data_declaration
  name: (constructor)
  parameters: (type_variable)
  constructors: (constructors
    (constructor)
    (constructor
      (type_application
        (type)
        (type_variable)))))
```

**Key Nodes:**
- `data_declaration` - Data type declaration
- `constructors` - Container for all constructors
- `constructor` - Individual constructor
- `type_application` - Constructor with type parameters

---

### Import Statement

**PureScript Code:**
```purescript
import Data.Maybe (Maybe(..), fromMaybe)
```

**AST Structure:**
```
(import
  module: (qualified_module
    (module)
    (module))
  imports: (import_list
    (import_item
      name: (constructor)
      items: (import_item_children
        (import_all)))
    (import_item
      name: (variable))))
```

**Key Nodes:**
- `import` - Import declaration
- `qualified_module` - Multi-part module name
- `import_list` - Explicit import list
- `import_item` - Individual imported item
- `import_all` - The `(..)` syntax for importing all constructors

---

### Record Literal

**PureScript Code:**
```purescript
person = { name: "Alice", age: 30 }
```

**AST Structure:**
```
(function
  name: (variable)
  body: (record_literal
    (record_field
      name: (field_name)
      value: (field_value
        (string)))
    (record_field
      name: (field_name)
      value: (field_value
        (integer)))))
```

**Key Nodes:**
- `record_literal` - Record construction expression
- `record_field` - Individual field assignment
- `field_name` - Field identifier
- `field_value` - Wrapper for field values

---

### Case Expression

**PureScript Code:**
```purescript
checkValue x = case x of
  0 -> "Zero"
  n | n > 0 -> "Positive"
  _ -> "Other"
```

**AST Structure:**
```
(function
  name: (variable)
  patterns: (patterns
    (pat_name
      (variable)))
  body: (exp_case
    expression: (exp_name
      (variable))
    alts: (alts
      (alt
        pat: (pat_literal
          (integer))
        exp: (string))
      (alt
        pat: (pat_name
          (variable))
        (gdpat
          guards: (guards
            (guard
              (exp_infix
                left: (exp_name
                  (variable))
                operator: (operator)
                right: (integer))))
          exp: (string)))
      (alt
        pat: (pat_wildcard)
        exp: (string)))))
```

**Key Nodes:**
- `exp_case` - Case expression
- `alts` - Container for all alternatives
- `alt` - Individual case alternative
- `gdpat` - Guarded pattern (when guards are present)
- `guards` - Container for guard expressions
- `guard` - Individual guard condition
- `pat_wildcard` - The `_` pattern

---

### Do Block

**PureScript Code:**
```purescript
main = do
  val <- Just 10
  let message = "Hello"
  pure val
```

**AST Structure:**
```
(function
  name: (variable)
  body: (exp_do
    (statement
      (bind_pattern
        pattern: (pat_name
          (variable))
        expression: (exp_application
          function: (exp_name
            (constructor))
          argument: (integer))))
    (statement
      (let
        (declarations
          (function
            name: (variable)
            body: (string)))))
    (statement
      (exp_application
        function: (exp_name
          (variable))
        argument: (exp_name
          (variable))))))
```

**Key Nodes:**
- `exp_do` - Do block expression
- `statement` - Individual statement in do block
- `bind_pattern` - Monadic bind (`<-`) operation
- `let` - Let binding within do block
- `exp_application` - Function application

---

### Type Signature

**PureScript Code:**
```purescript
myFunction :: Int -> String -> String
```

**AST Structure:**
```
(signature
  name: (variable)
  type: (type_function
    left: (type)
    right: (type_function
      left: (type)
      right: (type))))
```

**Key Nodes:**
- `signature` - Type signature declaration
- `type_function` - Function type (`->`)
- `type` - Simple type name

---

### Where Clause

**PureScript Code:**
```purescript
outerFunc x = innerFunc x + 1
  where
  innerFunc y = y * 2
```

**AST Structure:**
```
(function
  name: (variable)
  patterns: (patterns
    (pat_name
      (variable)))
  body: (exp_infix
    left: (exp_application
      function: (exp_name
        (variable))
      argument: (exp_name
        (variable)))
    operator: (operator)
    right: (integer))
  (where)
  (declarations
    (function
      name: (variable)
      patterns: (patterns
        (pat_name
          (variable)))
      body: (exp_infix
        left: (exp_name
          (variable))
        operator: (operator)
        right: (integer)))))
```

**Key Nodes:**
- `where` - Where keyword (note: declarations are siblings, not children)
- `declarations` - Container for where clause declarations
- The `declarations` node follows the `where` node as a sibling in the parent `function` node

---

### Type Class Declaration

**PureScript Code:**
```purescript
class Show a where
  show :: a -> String
```

**AST Structure:**
```
(class_declaration
  (class_head
    (class_name
      (type))
    (type_variable))
  (class_body
    (where)
    (declarations
      (signature
        name: (variable)
        type: (type_function
          left: (type_variable)
          right: (type))))))
```

**Key Nodes:**
- `class_declaration` - Type class declaration
- `class_head` - Class name and parameters
- `class_name` - The class name
- `class_body` - Body containing method signatures
- `type_variable` - Type parameter

---

### Instance Declaration

**PureScript Code:**
```purescript
instance showInt :: Show Int where
  show n = "Int: " <> show n
```

**AST Structure:**
```
(class_instance
  (instance_name)
  (instance_head
    (class_name
      (type))
    (type))
  (where)
  (declarations
    (function
      name: (variable)
      patterns: (patterns
        (pat_name
          (variable)))
      body: (exp_infix
        left: (string)
        operator: (operator)
        right: (exp_application
          function: (exp_name
            (variable))
          argument: (exp_name
            (variable)))))))
```

**Key Nodes:**
- `class_instance` - Instance declaration
- `instance_name` - Optional instance name
- `instance_head` - Class and type being instanced
- Method implementations in `declarations` after `where`

---

## Query Syntax Reference

### Basic Patterns
- `(node_type)` - Matches nodes of a specific type
- `@capture.name` - Captures the matched node with a given name
- `field: (child_node)` - Matches a named field within the node
- `?` - Makes a pattern optional
- `*` - Matches zero or more occurrences
- `+` - Matches one or more occurrences

### Advanced Patterns
- `[(option1) (option2)]` - Matches any of the listed alternatives
- `(_)` - Matches any node type (wildcard)
- `(node1) (node2)` - Matches nodes that appear in sequence

### Best Practices
1. Start with simple patterns and build complexity gradually
2. Test queries incrementally on small code samples
3. Use specific node types rather than wildcards when possible
4. Be aware of AST structure limitations (like where clause navigation)
5. Consider performance implications of broad vs. specific queries
