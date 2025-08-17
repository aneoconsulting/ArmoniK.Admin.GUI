export default defineAppConfig({
  docus: {
    title: 'ArmoniK Admin GUI',
    description: 'ArmoniK GUI Documentation',
    titleTemplate: '%s - ArmoniK',
    image: '',
    socials: {
      linkedin: {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/company/aneo/',
        icon: 'mdi:linkedin',
      },
      instagram: 'aneoconsulting/',
      twitter: 'ANEOConseil',
      website: {
        label: 'Website',
        href: 'https://armonik.fr',
        icon: 'mdi:web',
        rel: 'noopener',
      },
      github: 'aneoconsulting/ArmoniK.Admin.GUI',
    },
    github: {
      dir: 'content',
      branch: 'main',
      repo: 'ArmoniK.Admin.GUI',
      owner: 'aneoconsulting',
      edit: true,
    },
    main: {
      fluid: true,
    },
    header: {
      showLinkIcon: true,
      exclude: [],
      fluid: true,
    },
    footer: {
      fluid: true,
      credits: {
        text: '',
        href: 'https://www.aneo.eu',
        icon: 'LogosAneo',
      },
      textLinks: [
        {
          text: 'ArmoniK',
          target: '_blank',
          rel: 'noopener',
          href: 'https://aneoconsulting.github.io/ArmoniK/',
        },
        {
          text: 'ArmoniK.Core',
          target: '_blank',
          rel: 'noopener',
          href: 'https://aneoconsulting.github.io/ArmoniK.Core/',
        },
        {
          text: 'ArmoniK.Api',
          target: '_blank',
          rel: 'noopener',
          href: 'https://aneoconsulting.github.io/ArmoniK.Api/',
        },
        {
          text: 'ArmoniK.Community',
          target: '_blank',
          rel: 'noopener',
          href: 'https://aneoconsulting.github.io/ArmoniK.Community/',
        },
      ],
      iconLinks: [],
    },
  },
})