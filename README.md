# Archive

Archive is a file repository.

*Note: this README is a work in progress. So is the rest of the code.*

## Architecture

This project is in the earliest of early stages. What is written in this section may not match the code (yet?).

### Packages

This is a multi-package repository managed by Yarn. Individual packages are found under `packages` in the root directory.

Each package has different Yarn scripts. Generally, you can run `yarn build` to produce a production build or `yarn dev` to produce a development build and rebuild on file changes. Look at the `scripts` field in each `package.json` for more details.

#### archive-core

Code which is common to all Archive functions.

- Models: Records, Tags, Slugs.
- Storage plugin registry and storage namespace for use in storage clients.
- Processor plugin registry -- mainly for use in the consumers, but also available for other client-side use cases
- Logger/logger wrappers. These may eventually become plugins as well.

#### archive-types

TypeScript types. Other than some of the web UI types (for now), this is where all types are defined.

#### archive-consumer

Modular file consumer for ingesting new files into Archive.

#### archive-web

Web UI for accessing and updating Archive.

The web UI is currently an entirely client-side single-page app. This means that storage plugins must be compatible with web browsers, and that bulk file operations require lots of data transfer. This may change in the future.

#### Plugins

There are plugins as well. For now, see their respective READMEs (if they exist) or code for details.