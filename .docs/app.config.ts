export default defineAppConfig({
  docus: {
    title: 'ArmoniK',
    description: 'The next-gen orchestrator',
    socials: {
      github: 'aneoconsulting/ArmoniK'
    },
    github: {
      dir: '.docs/content',
      repo: 'ArmoniK',
      owner: 'aneoconsulting'
    },
    main: {
      fluid: true,
    },
    header: {
      logo: false,
      showLinkIcon: true,
      exclude: [],
      fluid: true,
    },
  }
})