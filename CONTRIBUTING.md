# Contributing to the Project

## Installation

If all you want to do is use the system in Foundry, the installation instructions in the README will work. If you're looking to contribute, such as by making a pull request, you can get intellisense, linting, and `i18n-ally` support by installing the dependencies.

1. Install node.js. The generally-recommended method is to use [nvm](https://github.com/nvm-sh/nvm); you can also download binaries from [nodejs.org](https://nodejs.org/), including a Windows installer if you prefer that method.

2. Run `corepack enable` to enable the `yarn` package manager. You probably only need to do this once per system. You may need to use an elevated command prompt if you're in Windows.

3. Make a copy of `foundry-config-example.yaml` and name it `foundry-config.yaml`. Replace the placeholder with the path to your Foundry installation (the directory with the executable in it).

4. Install the dependencies with `yarn install`. The post-install script should automatically generate the symlinks necessary for intellisense and `i18n-ally` to work.
