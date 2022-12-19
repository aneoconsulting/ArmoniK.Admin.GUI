export default {
  lang: 'en-US',
  title: 'Admin GUI - ArmoniK',
  description: 'A user interface to monitor and manage an ArmoniK cluster',

  lastUpdated: true,
  cleanUrls: 'without-subfolders',

  themeConfig: {
    siteTile: 'Admin GUI',

    editLink: {
      pattern:
        'https://github.com/aneoconsulting/ArmoniK.Admin.GUI/edit/main/.docs/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/aneoconsulting/ArmoniK.Admin.GUI',
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Aneo',
    },

    sidebar: {
      '/guide/': sidebarGuide(),
    },
  },
};

function sidebarGuide() {
  return [
    {
      text: 'Getting Started',
      collapsible: true,
      items: [
        { text: 'Introduction', link: '/guide/introduction' },
        {
          text: 'Understand the layout',
          link: '/guide/understand-layout',
        },
      ],
    },
  ];
}
