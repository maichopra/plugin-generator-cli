# plugin-generator-cli
CLI Tool for generating C# Plugin Files based on Templates.
Currently only generates Late Bound Plugins.

This tool is a work in progress.

# Index
- [Installation](#installation)
- [Options](#options)


## Installation
```shell
# Using npm, installing to local project
npm i --save d365-plugin-generator

# Using npm, installing globally for global cli usage
npm i -g d365-plugin-generator

# Using yarn
yarn add d365-plugin-generator
```

## Options
- `File Path`: Determines the File Path for the Selected Template Folder

- `Project Templates`:
  Simple Plugin: Early Bound Plugin. All Stages and Messages selected will be generated in a single file. Requires the Helper File.
  Complex Plugin: Early Bound Plugin. Individual File Generated for each combination of Stage and Message selected. 

- `Namespace`: The Namespace of the Plugin

- `Class Name`: The Class Name of the Plugin

- `Entity`: The Logical Name of the entity

- `Configuration (Messages and Stages)`:
   - Create
      - Pre-Validation
      - Pre-Operation
      - Post-Operation
    - Update
      - Pre-Validation
      - Pre-Operation
      - Post-Operation
    - Delete
      - Pre-Validation
      - Pre-Operation
      - Post-Operation

- `Helper File`: Generates a Helper File with the same Namespace as specified above.


