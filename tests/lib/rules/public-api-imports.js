/**
 * @fileoverview Disables the import of components inside a module
 * @author Sergey
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});

const aliasOptions = [
  {
    alias: '@'
  }
]

ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '../../model/slices/addCommentFormSlice'",
      errors: [],
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@features/addComment'",
      errors: [],
      options: aliasOptions,
    },
    {
      code: "import { DynamicModuleLoader, TReducerList } from '@shared/lib/ui/DynamicModuleLoader';",
      errors: [],
      options: aliasOptions,
    },
    {
      code: "import { ThemeEnum } from '@app/providers/ThemeProvider';",
      errors: [],
      options: aliasOptions,
    },

  ],

  invalid: [
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from 'features/addComment/model/slices/addCommentFormSlice'",
      errors: [{ message: "Absolute imports are only allowed from public Api" }],
    },
    {
      code: "import { addCommentFormActions, addCommentFormReducer } from '@features/addComment/model/slices/addCommentFormSlice'",
      errors: [{ message: "Absolute imports are only allowed from public Api" }],
      options: aliasOptions,
    },
  ],
});
