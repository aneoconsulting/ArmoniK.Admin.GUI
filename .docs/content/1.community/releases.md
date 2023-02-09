---
navigation.icon: heroicons:newspaper
---

# Releases


## Edge Release Channel

Admin GUI is landing commits, improvements and bug fixes every day. You can opt-in to the Edge release channel to get the latest features and fixes as soon as they are ready.

After each commit is merged into the `main` branch, a new Docker image is built and published to the `edge` tag on [Docker Hub](https://hub.docker.com/r/dockerhubaneo/armonik_admin_app). You can use this image to run Admin GUI in the Edge release channel.

Also, each PR generate a new Docker image with the PR number as tag (ex: `pr-345`). You can use this image to test the PR before it is merged into the `main` branch.

The build and publishing method and quality of edge releases are the same as stable ones. The only difference is that you should open check the GitHub repository for updates. There is a slight change of regressions not being caught during the review process and by the automated tests. Therefore, we internally use this channel to double-check everything before each release.

## Releases per event

| Event | Description | Tag(s) |
| --- | --- | --- |
| **Release** | When a new version is published | `latest`, `<major>`, `<major>.<minor>`, `<version>` |
| **Edge** | When a new commit landing on main | `edge` |
| **Pull** Request | When a new PR is opened or synchronized | `pr-<pr_number>` |
