/**
 * @fileoverview Disables the import of components inside a module
 * @author Sergey
 */
"use strict";

const { isPathRelative } = require("../helpers");
const micromatch = require('micromatch');
const path = require("path");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "suggestion", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Disables the import of components inside a module",
      recommended: false,
      url: null,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          },
          testFilesPatterns: {
            type: 'array'
          }
        }
      }
    ],
    messages: {
      publicApiImport: 'Absolute imports are only allowed from public Api',
      testApi: 'Test data needs to be imported from public Api'
    }
  },

  create(context) {
    const { alias = '', testFilesPatterns = [] } = context.options[0] ?? {};

    const availableLayers = {
      'pages': 'pages',
      'widgets': 'widgets',
      'features': 'features',
      'entities': 'entities',
    }

    return {
      ImportDeclaration(node) {
        // example app/entities/Article
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}`, '') : value;

        if (isPathRelative(importTo)) {
          return;
        }

        const segments = importTo.split('/')

        const layer = segments[0];
        const slice = segments[1];

        if (!availableLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4
        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({
            node,
            messageId: 'publicApiImport',
            fix: (fixer) => {
              return fixer.replaceText(node.source, `'${alias}${layer}/${slice}'`)
            }
          });
        }

        if (isTestingPublicApi) {
          const currentFilePath = context.filename;
          const normalizedPath = path.toNamespacedPath(currentFilePath);

          const isCurrentFileTesting = testFilesPatterns.some(
            pattern => micromatch.isMatch(normalizedPath, pattern)
          )

          if (!isCurrentFileTesting) {
            context.report({ node, messageId: 'testApi' });
          }
        }
      }
    };
  },
};
