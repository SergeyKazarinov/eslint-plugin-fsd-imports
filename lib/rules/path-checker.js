/**
 * @fileoverview FSD relative path checker
 * @author Sergey
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const path = require('path');
const { isPathRelative } = require('../helpers');

const getNormalizedCurrentFilePath = (currentFilePath) => {
  const normalizedPath = path.toNamespacedPath(currentFilePath);
  const projectFrom = normalizedPath.split('src')[1];
  return projectFrom.split('\\').join('/');
}
/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "FSD relative path checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ], // Add a schema if the rule has options
    messages: { relativePath: 'Within a single slide, all paths must be relative.' }
  },

  create(context) {
    const alias = context.options[0]?.alias || '';

    return {
      ImportDeclaration(node) {
        // example app/entities/Article
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}`, '') : value;

        // example D:\Frontend\Projects\advanced-frontend\src\entities\Article
        const fromFilename = context.filename;

        if (shouldBeRelative(fromFilename, importTo)) {
          context.report({
            node,
            messageId: 'relativePath',
            fix: (fixer) => {
              const normalizedPath = getNormalizedCurrentFilePath(fromFilename) // entities/Article/Article.tsx
                .split('/')
                .slice(0, -1)
                .join('/');

              let relativePath = path.relative(normalizedPath, `/${importTo}`)
                .split('\\')
                .join('/');

              if (!relativePath.startsWith('.')) {
                relativePath = './' | relativePath;
              }

              return fixer.replaceText(node.source, `'${relativePath}'`)
            }
          });
        }
      }
    };
  },
};

const layers = {
  'pages': 'pages',
  'widgets': 'widgets',
  'features': 'features',
  'entities': 'entities',
  'shared': 'shared',
}

function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }

  // example entities/Article
  const toArray = to.split('/')
  const toLayer = toArray[0]; // entities
  const toSlice = toArray[1]; // Article

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const projectFrom = getNormalizedCurrentFilePath(from);
  const fromArray = projectFrom.split('/')

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;
}
