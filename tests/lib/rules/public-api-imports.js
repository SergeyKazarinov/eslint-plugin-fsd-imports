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
    alias: '@',
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
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
      }],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
      }],
    }

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
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@entities/Article/testing/file.tsx'",
      errors: [{ message: 'Absolute imports are only allowed from public Api' }],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
      }],
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\forbidden.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@entities/Article/testing'",
      errors: [{ message: 'Test data needs to be imported from public Api' }],
      options: [{
        alias: '@',
        testFilesPatterns: ['**/*.test.ts', '**/*.test.ts', '**/StoreDecorator.tsx']
      }],
    }
  ],
});
