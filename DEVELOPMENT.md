# Developer's Guide

- [Developer's Guide](#developers-guide)
  - [Setting Up Your macOS Development Environment](#setting-up-your-macos-development-environment)
  - [Testing and Linting](#testing-and-linting)
  - [Installing Pre-Commit Hooks](#installing-pre-commit-hooks)
  - [Contributing Notebooks](#contributing-notebooks)
  - [Building the Package](#building-the-package)
  - [Installing a Phoenix Build](#installing-a-phoenix-build)
  - [Installing a `git` Branch on Colab](#installing-a-git-branch-on-colab)
  - [Setting Up Your Windows Test Environment](#setting-up-your-windows-test-environment)
    - [Selecting a Virtualization Option](#selecting-a-virtualization-option)
    - [Installing Python and Phoenix](#installing-python-and-phoenix)
    - [Configuring a Remote Interpreter](#configuring-a-remote-interpreter)
    - [Troubleshooting](#troubleshooting)
  - [Publishing a New Release](#publishing-a-new-release)
  - [Best Practices](#best-practices)
    - [REST API](#rest-api)
      - [HTTP Methods](#http-methods)
      - [Status Codes](#status-codes)
      - [Path Structure](#path-structure)
      - [Query Parameters](#query-parameters)
      - [Pagination](#pagination)
      - [Response Format](#response-format)

## Setting Up Your macOS Development Environment

We recommend using a virtual environment to isolate your Python dependencies. This guide will use `conda`, but you can use a different virtual environment management tool if you want.

First, ensure that your virtual environment manager is installed. For macOS users, we recommend installing `conda` via `brew` with

```
brew install --cask mambaforge
```

For non-mac users, you can follow the instruction [here](https://github.com/conda-forge/miniforge#miniforge) to install `conda` for your particular operating system.

Create a new virtual environment with a Phoenix-compatible Python version. For example,

```bash
conda create --name phoenix python=3.12
```

Second, install the web build dependencies.

We recommend installing [nodejs via nvm](https://github.com/nvm-sh/nvm) and then
installing `pnpm` globally to manage the web frontend dependencies.

```bash
# install nvm
# https://github.com/nvm-sh/nvm
# install node via nvm, our .nvmrc file will automatically instruct nvm to install 
# the version specified in the file
nvm install
# set it as default (optional)
nvm alias default <version-that-was-installed>
# install pnpm globally for v22
npm i -g pnpm@9.15.5
```

Then we will build the web app. Change directory to `app` and run:

```bash
pnpm install
pnpm run build
```

Finally, change directory back to repository root and install `phoenix` in
development mode (using the `-e` flag), and with development dependencies
(using the `[dev,test]` extra) by running

```bash
pip install -e ".[dev,test]"
```

If you are working on our LLM orchestration framework integrations, you may also wish to install LlamaIndex or LangChain from source. To install LlamaIndex from source,

-   Uninstall any pre-existing version of LlamaIndex with `pip uninstall llama-index`.
-   Fork and clone LlamaIndex using one of the following two methods:
    -   If you are an Arize employee, clone [Arize's fork of LlamaIndex](https://github.com/Arize-ai/llama_index).
    -   If you are an external contributor, fork and clone [LlamaIndex's upstream repository](https://github.com/run-llama/llama_index).
-   Run `pip install -e .` from the repository root.

To install LangChain from source,

-   Uninstall any pre-existing version of LangChain with `pip uninstall langchain`.
-   Fork and clone LangChain using one of the following two methods:
    -   If you are an Arize employee, clone [Arize's fork of LangChain](https://github.com/Arize-ai/langchain).
    -   If you are an external contributor, fork and clone [LangChain's upstream repository](https://github.com/langchain-ai/langchain).
-   Run `pip install -e .` from `libs/langchain`.

## Testing and Linting

Phoenix is backed with either a `sqlite` or `postgresql` database. By default, tests that involve
persistence in some way run against both backends. Ensure that `postgresql` is installed on your
system.

```bash
brew install postgresql
```

Ensure your environment is set up so that `pg_config` points to the correct binary.

```bash
pg_config --bindir
```

This command should point to the `homebrew` install of `postgresql`, if it doesn't, try creating
a fresh Python environment or modifying your `PATH`.

Phoenix uses `hatch` as the project management tool to lint and test source code and to build the package. After creating and activating your `phoenix` virtual environment, view your `hatch` environments, dependencies and, scripts defined in `pyproject.toml` with

```bash
hatch env show
```

Scripts belonging to the various environments can be run with

```bash
hatch run <env-name>:<script-name>
```

To type-check your code, run

```bash
hatch run type:check
```

To format your code, run

```bash
hatch run style:fix
```

To run tests

```bash
hatch run tests
```

By default, database tests only run against `sqlite`, in order to run database tests against
a `postgresql` database as well, use the `--run-postgres` flag

```bash
hatch run tests --run-postgres
```

The following resources are helpful to learn more about the capabilities of `hatch` and to familiarize yourself with the CLI.

-   [Hatch Quickstart](https://hatch.pypa.io/latest/)
-   [Hatch CLI Reference](https://hatch.pypa.io/latest/cli/reference/)

## Installing Pre-Commit Hooks

We recommend to install project pre-commit hooks with

```bash
pre-commit install
```

Once installed, the pre-commit hooks configured in `.pre-commit-config.yaml` will automatically run prior to each `git commit`. Pre-commit hooks can be skipped by passing the `-n`/ `--no-verify` flag to the `git commit` command.

## Contributing Notebooks

To add or modify a Jupyter notebook, the following commands are needed to pass CI.

- `hatch run type:check`: Run type checks
- `hatch run style:fix`: Runs formatters
- `hatch run notebooks:clean`: Removes cell output and notebook metadata to keep the diff as small as possible

## Building the Package

To build Phoenix, you must build the `app` and the python package.

To build the `app`, navigate to the `app` directory and run

```bash
pnpm run build
```

Then, from the root directory of the repo, run

```bash
hatch build
```

If successful, a source distribution (a tarball) and a Python `wheel` will appear in the `dist` folder at the repo base directory.

## Installing a Phoenix Build

We recommend using a separate virtual environment (e.g., `phoenixtest`) for installing and testing the builds created above.

To install Phoenix from the source distribution (i.e., tarball), run

```bash
pip install /path/to/source/distribution/tarball.tar.gz
```

To install Phoenix from the Python `wheel`, you must first install `wheel` with

```bash
pip install wheel
```

Then run

```bash
pip install /path/to/wheel.whl
```

(You should only install one of the source distribution or the `wheel` at a time.)

To make sure everything works, install `jupyter` with

```bash
pip install jupyter
```

and run the notebooks in the `tutorials` directory.

## Installing a `git` Branch on Colab

The code below installs the `main` branch in [Colab](https://colab.research.google.com/notebooks/empty.ipynb) and takes roughly 3 minutes to run.

```jupyterpython
!npm install -g -s n
!n latest
!npm install -g -s npm@latest
%pip install git+https://github.com/Arize-ai/phoenix.git@main
```

## Setting Up Your Windows Test Environment

It is occasionally necessary to manually test a Phoenix build or to run Phoenix from source on Windows. The following instructions enable macOS developers who do not have a PC to quickly set up a Windows Python environment in a cloud or local virtual machine.

### Selecting a Virtualization Option

We recommend to use a virtual machine either with Microsoft Azure (a cloud virtual machine) or using the Parallels Desktop app (a local virtual machine). Which option you select will depend on your hardware and whether you wish to run a remote IDE. The following resources are helpful to make a decision:

-   [Parallels Desktop for Mac System Requirements](https://kb.parallels.com/en/124223)
-   [Supported SSH Clients for Remote Development with VSCode](https://code.visualstudio.com/docs/remote/troubleshooting#_installing-a-supported-ssh-client)

At the time of this writing in December 2022,

-   Windows 11 is the only Windows OS with a supported ARM version,
-   JetBrains does not support remote development on Windows servers,
-   VSCode supports remote development on certain Windows versions not including Windows 11.

Hence, if you are a macOS developer using an Apple Silicon machine and you wish to use a remote interpreter, running a Windows VM locally is not straightforward and we recommend you use a Windows VM on Azure.

If you elect to use an Azure VM, we recommend that you select a non-headless OS (we use Windows Server 2019), configure an inbound port rule for RDP on port 3389 while creating the VM and screenshare with your VM using Microsoft Remote Desktop, which can be downloaded from the Apple App Store. This will enable you to [configure an SSH server](#configuring-a-remote-interpreter) on the VM for remote development.

### Installing Python and Phoenix

The following instructions assume you have created a Windows virtual machine either locally or in the cloud. These instructions have been tested on Windows Server 2019 and assume you are using Powershell.

Install `chocolatey`, a package manager for Windows, by following the instructions [here](https://chocolatey.org/install#individual).

Open a new shell and run

```powershell
choco install nvm pyenv-win git
```

Open a new shell and install the latest long-term supported version of `node` using

```powershell
nvm install lts
```

Activate this version using

```powershell
nvm use lts
```

Open a new shell and confirm that `node` and `npm` are available with

```powershell
node --version
npm --version
```

Install your desired Python version with

```powershell
$env:PHOENIX_PYTHON_VERSION = "desired-python-version"
pyenv install $env:PHOENIX_PYTHON_VERSION
```

Set the global `pyenv` version with

```powershell
pyenv global $env:PHOENIX_PYTHON_VERSION
```

Install `virtualenvwrapper-win` with

```powershell
pip install virtualenvwrapper-win
```

Create a virtual environment called `phoenix` with

```powershell
mkvirtualenv phoenix-env
```

Activate your virtual environment. You can now [install a Phoenix build](#installing-a-phoenix-build). Alternatively, if you wish to run Phoenix from source, clone the repo and install Phoenix in development mode with

```powershell
pip install -e ".[dev]"
```

### Configuring a Remote Interpreter

If you wish to use a remote SSH interpreter (e.g., via VSCode), you must install and run an SSH server on your Windows VM. We recommend to install OpenSSH Server by navigating to `Settings > Apps > Manage optional features > Add a feature`, selecting `OpenSSH Server` in the list and clicking `Install`. To start the SSH server, navigate to `Control Panel > System and Security > Administrative Tools > View local services`, select `OpenSSH Server` and press `Start`. If you wish to configure the server to start automatically on startup, select `Actions > Properties` while `OpenSSH Server` is selected from the list (or just double-click on `OpenSSH Server`), select `Automatic` in the `Startup type` dropdown and hit `Apply`.

You must also ensure that port 22 of your Windows VM is reachable by your SSH client.

-   If using an Azure VM, this can be accomplished by defining an appropriate inbound port rule for TCP on port 22 either during creation of the virtual machine or after creation in the VM's networking settings.
-   If using Parallels Desktop, navigate to `Preferences > Network` and define a port forwarding rule for TCP on destination port 22.

### Troubleshooting

-   In our experience, the `workon` command familiar to users of `virtualenvwrapper` may not properly run on Windows with `virtualenvwrapper-win`. In order to activate a virtual environment, you can manually run the appropriate activation script (`activate.ps1` if using Powershell) typically located in `$env:USERPROFILE\Envs\<env-name>\Scripts`.

## Publishing a New Release

To publish a new release, follow the steps below.

1. Make sure your branch is up-to-date with `main`
2. Update the version number in `src/phoenix/version.py`
3. Remove the `dist` folder with `rm -rf dist`.
4. By default, the web app is not rebuilt. Change directory to `app` and run `rm -rf node_modules && pnpm install --frozen-lockfile && pnpm run build` to rebuild the web app.
5. From the root directory of the repo, build the package with `hatch build`.
6. Publish the package with `hatch publish -u __token__`. Note you must publish using a pypi token. The token should be stored securely in your `.pypirc` file (see [docs](https://packaging.python.org/en/latest/specifications/pypirc/))
7. Commit the changes using the version number as the message (e.x. `0.0.1`) and get it into to `main`
8. Using the [GitHub CLI](https://cli.github.com/), create a draft release with `gh release create <version> --generate-notes --draft`
9. Edit the release notes as needed and publish the release. This will trigger a slack notification to the `#phoenix-releases` channel.
10. A conda-forge PR will be automatically created. If the PR is not created, you can create it manually by following the instructions [here](https://conda-forge.org/docs/maintainer/updating_pkgs.html#forking-and-pull-requests).

## Best Practices

### REST API

-   The API should communicate over JSON unless otherwise specified by the URL.
-   The API should be versioned. If a backwards incompatible change is made, the new route should be nested under a new version.

#### HTTP Methods

-   **GET** Used to retrieve a representation of a resource.
-   **POST** Used to create new resources and sub-resources.
-   **PUT** Used to update existing resources. Use PUT when you want to replace a resource.
-   **PATCH** Used to update existing resources. Use PATCH when you want to apply a partial update to the resource.
-   **DELETE** Used to delete existing resources.

#### Status Codes

-   **4xx** The client application behaved erroneously - client error
-   **5xx** The API behaved erroneously - server error
-   **2xx** The client and API worked

#### Path Structure

-   Use nouns for resources and sub-resources.
-   Avoid using verbs in the path.
-   Nouns should be pluralized and followed by a globally unique identifier for specific resources (e.g., `/datasets/:dataset_id` where the dataset ID is the globally unique identifier consistent with the GraphQL API).

#### Query Parameters

Use query parameters for filtering, sorting, and pagination. Query parameters should use `_` as a separator.

#### Pagination

Use cursor-based pagination. Each request gives a cursor to the next page of results.

#### Response Format

-   The response should be a JSON object with a `data` key.
-   Payload content should use snake case to make it easier to work with when translating to objects.
