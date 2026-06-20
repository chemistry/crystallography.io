# Vendored dependency

`@chemistry/cif-2-json@0.0.18` was unpublished from npm, which broke this
container's isolated `npm install` (Docker build) and the monorepo install.
Until it is republished, this tarball vendors the package (the published build
extracted from the last image built before the unpublish; `dist` only).
Referenced from `package.json` as `file:vendor/chemistry-cif-2-json-0.0.18.tgz`.

To revert: republish the package to npm, restore the version range in
`package.json`, run `npm install`, and delete this directory.
