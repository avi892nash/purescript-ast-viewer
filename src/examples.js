export const queryExamples = [
  {
    title: "Finding Module Names",
    purescriptCode: `module Main where`,
    treeSitterQuery: `(purescript name: (qualified_module (module) @module.name))`
  },
  {
    title: "Finding Import Statements with Submodules",
    purescriptCode: `module Main where
import Data.Maybe (Maybe(..), fromMaybe)`,
    treeSitterQuery: `(import module: (qualified_module (module) @import.module (module) @import.submodule))`
  },
  {
    title: "Finding Function Names",
    purescriptCode: `module Main where
f1 = 1
f2 = 2`,
    treeSitterQuery: `(function name: (variable) @func.name)`
  },
  {
    title: "Finding Type Signature Names",
    purescriptCode: `module Main where
myFunction :: Int -> Int
myFunction x = x + 1`,
    treeSitterQuery: `(signature name: (variable) @sig.name)`
  },
  {
    title: "Finding Data Declaration Names",
    purescriptCode: `module Main where
data MyData a = MyConstructor1 a | MyConstructor2 String`,
    treeSitterQuery: `(data name: (type) @data.name)`
  },
  {
    title: "Finding Constructor Names",
    purescriptCode: `module Main where
data MyData = Constructor1 | Constructor2 String`,
    treeSitterQuery: `(constructor) @constructor`
  },
  {
    title: "Finding Type Class Names",
    purescriptCode: `module Main where
class MyShow a where
  myShow :: a -> String`,
    treeSitterQuery: `(class_declaration (class_head (class_name (type) @class.name)))`
  },
  {
    title: "Finding Instance Names",
    purescriptCode: `module Main where
instance myShowInt :: MyShow Int where
  myShow n = "test"`,
    treeSitterQuery: `(class_instance (instance_name) @instance.name)`
  },
  {
    title: "Finding String Literals",
    purescriptCode: `module Main where
message = "Hello" <> "World"`,
    treeSitterQuery: `(string) @string`
  },
  {
    title: "Finding Integer Literals",
    purescriptCode: `module Main where
result = 42 + 100`,
    treeSitterQuery: `(integer) @int`
  },
  {
    title: "Finding Variable References",
    purescriptCode: `module Main where
result = x + y`,
    treeSitterQuery: `(exp_name (variable) @var)`
  },
  {
    title: "Finding Record Field Names",
    purescriptCode: `module Main where
myRec = { foo: 1, bar: "hello" }`,
    treeSitterQuery: `(record_field (field_name) @field.name)`
  },
  {
    title: "Finding Case Patterns",
    purescriptCode: `module Main where
checkValue x = case x of
  0 -> "Zero"
  _ -> "Other"`,
    treeSitterQuery: `(alt pat: (pat_literal (integer) @case.pattern))`
  },
  {
    title: "Finding Let Binding Names",
    purescriptCode: `module Main where
result = let x = 10 in x + 1`,
    treeSitterQuery: `(exp_let_in (declarations (function name: (variable) @let.name)))`
  },
  {
    title: "Finding Do Block Bindings",
    purescriptCode: `module Main where
main = do
  val <- Just 10
  pure val`,
    treeSitterQuery: `(bind_pattern (pat_name (variable) @do.binding))`
  },
  {
    title: "Finding Let Bindings in Do Blocks",
    purescriptCode: `module Main where
main = do
  let message = "Hello"
  pure message`,
    treeSitterQuery: `(statement (let (declarations (function name: (variable) @do.let.name))))`
  },
  {
    title: "Finding Type Alias Names",
    purescriptCode: `module Main where
type MyRecord = { foo :: Int, bar :: String }`,
    treeSitterQuery: `(type_alias name: (type) @type.alias.name)`
  },
  {
    title: "Finding Record Type Field Names",
    purescriptCode: `module Main where
type Point = { x :: Number, y :: Number }`,
    treeSitterQuery: `(row_field (field_name) @record.type.field)`
  },
  {
    title: "Finding Function Names in Where Clauses",
    purescriptCode: `module Main where
outerFunction x = innerFunction x + 1
  where
  innerFunction y = y * 2`,
    treeSitterQuery: `(where) (declarations (function name: (variable) @where.func.name))`
  }
];
