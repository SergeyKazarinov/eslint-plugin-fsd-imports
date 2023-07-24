/**
 * @fileoverview Disables the import of components inside a module
 * @author Sergey
 */
"use strict";

const { isPathRelative } = require('../helpers');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Disables the import of components inside a module",
      recommended: false,
      url: null,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ],
    messages: {
      publicApiImport: 'Absolute imports are only allowed from public Api'
    }
  },

  create(context) {
    const alias = context.options[0]?.alias || '';

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
        const isImportNotFromPublicApi = segments.length > 2
        const layer = segments[0];

        if (!availableLayers[layer]) {
          return;
        }

        if (isImportNotFromPublicApi) {
          context.report({ node, messageId: 'publicApiImport' });
        }
      }
    };
  },
};
