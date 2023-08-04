# eslint-plugin-fsd-imports

plugin for file imports in [FSD architecture](https://feature-sliced.design/)

### Rules
- [Path Checker](#path)
- [Layer Imports](#layer)
- [Public Api Imports](#public)

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-kss-fsd-imports`:

```sh
npm install eslint-plugin-kss-fsd-imports --save-dev
```

## Usage

Add `kss-fsd-imports` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "kss-fsd-imports"
    ]
}
```
## Rules

### <a id="path" ></a>Path Checker

This rule prohibits the use of relative paths within a module.

```json
{
    "kss-fsd-imports/path-checker": "error",
}
```

#### Example
```javaScript
// Path:
// entities/Comment/ui/Comment/comment.ts

// Error:
import { IComment } from 'entities/Comment/model/types/comment';
// Correct:
import { IComment } from '../../model/types/comment';
```

- If you use aliases for absolute paths, then you can add them to the settings. The plugin will automatically replace them with an empty string.

#### Example


```json
{
    "kss-fsd-imports/path-checker": ["error", { "alias": "@" }]
}
```

```javaScript
import { ThemeEnum } from '@shared/const/theme';
// The import written above will be perceived as:
import { ThemeEnum } from 'shared/const/theme';
```
---
### <a id="layer" ></a>Layer Imports

This rule prohibits the use of imponts of higher layers in lower layers.

![App Screenshot](fsd.jpg)

```json
{
    "kss-fsd-imports/layer-imports": "error",
}
```

#### Example
```javaScript
// Path:
// entities/Comment/ui/Comment/comment.ts

// Error:
import { Page } from 'widgets/Page...';
// Correct:
import { Page } from 'shared/lib/...';
```

- If you use aliases for absolute paths, then you can add them to the settings. The plugin will automatically replace them with an empty string.

- Also you can ignore some imports using the following rule

```json
{
    "kss-fsd-imports/layer-imports": ["error", 
    {
        "alias": "@",
        "ignoreImportPatterns": ["**/StoreProvider"]
    }],
}
```
#### Example
```javaScript
// Path:
// entities/Comment/ui/Comment/comment.ts

// Correct:
import { StoreProvider } from '@app/providers/StoreProvider'
```

### <a id="public"></a>Public Api Imports

This rule allows you to use imports from other modules only from public Api (index.ts)

```json
{
    "kss-fsd-imports/public-api-imports": "error",
}
```

#### Example
```javaScript
// Path:
// entities/Comment/ui/Comment/comment.ts

// Error:
import { AddCommentForm } from 'features/addComment/ui/AddCommentForm'
// Correct:
import { AddCommentForm } from 'features/addComment';
```

- If you use aliases for absolute paths, then you can add them to the settings. The plugin will automatically replace them with an empty string.

- You can add an exception to this rule by adding the `testFilesPatterns` property

```json
{
    "kss-fsd-imports/public-api-imports": ["error", 
    {
        "alias": "@/",
        "testFilesPatterns": ["**/StoreDecorator.tsx"],
    }],
}
```
#### Example
```javaScript
// Path:
// app/decorators/StoreDecorator.ts

// Correct:
import { addCommentFormActions} from '@/entities/Article/model/slice'
```

