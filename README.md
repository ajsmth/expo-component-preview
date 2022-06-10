# Expo Component Preview

**Experimental**

A minimal approach to quickly previewing your React Native components


## Getting Started

Install the package: 
```bash
yarn add expo-component-preview
```

Update your `metro.config.js`:

```js
// metro.config.js
const withExpoComponentPreview = require("expo-component-preview/withExpoComponentPreview");

// ...other configuration stuff

module.exports = withExpoComponentPreview(config)
```

Wrap your application in the provider: 

```js
// e.g App.js

import { ExpoPreviewProvider } from "expo-component-preview";

function App() {
  return (
    <ExpoPreviewProvider>
      {...}
    </ExpoPreviewProvider>
  )
}

``` 

# Development guide

## Running the VSCode extension locally 

You can test the VSCode extension locally by navigating to `vscode-extension` and pressing `Control + F5` - this will start a debug window that has a local version of the extension installed

In that debug window, navigate to the `example` directory to see the extension at work!

In a separate terminal, start the example app via `yarn start` and launch the app on a device / emulator. That should be it!


## Developing the library

`yarn start`: Start the app in `example`

`yarn build`: Start the library bundler

Run these commands in separate terminal windows and you should be able to make updates to the library which will be reflected in the example app

Note: Updates in the library that impact the metro config will require the example app server to be restarted manually

#### Manually preview a component

Components can be previewed by updating the export found in `example/.expo/expo-component-preview.js`:

```js
module.exports = require("../One").default;
```

This manual process is effectively what is achieved by the preview server, which can update the selected preview component with the following `GET` request:
```
GET http://localhost:{PORT_OF_PREVIEW_SERVER}?filePath=${PATH_TO_FILE}&componentName={NAME_OF_EXPORTED_COMPONENT}
```
