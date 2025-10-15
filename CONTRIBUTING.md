# Contributing to the Project

## Installation

If all you want to do is use the system in Foundry, the installation instructions in the README will work. If you want to contribute, such as by making a pull request, use the following steps to enable intellisense, automatic code formatting, and the i18n-ally localization tool.

1. Install node.js. The generally-recommended method is to use [nvm](https://github.com/nvm-sh/nvm); you can also download binaries from [nodejs.org](https://nodejs.org/).

2. Run `corepack enable` to enable the `yarn` package manager. You only need to do this once per system. You may need to use an elevated command prompt in Windows.

3. Make a copy of `foundry-config-example.yaml` and name it `foundry-config.yaml`. Replace the placeholder with the path to your Foundry installation (the directory with the executable in it).

4. Install the dependencies with `yarn install`. If the path in `foundry-config.yaml` is correct, the post-install script should automatically generate the symlinks necessary for intellisense, eslint, and i18n-ally to work.
