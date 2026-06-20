# Vendored dependency

`@chemistry/molecule3d@1.5.1` (and its dep `@crystallography/space-groups@1.0.7`)
were unpublished from npm, which broke `npm install` for this workspace and the
whole monorepo. Until they are republished, this tarball vendors the package
(extracted from the last image built before the unpublish, with space-groups
bundled via `bundleDependencies`). Referenced from `package.json` as
`file:vendor/chemistry-molecule3d-1.5.1.tgz`.

To revert: republish both packages to npm, restore the semver range in
`package.json`, run `npm install`, and delete this directory.
