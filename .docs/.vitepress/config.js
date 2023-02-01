import { version } from '../../package.json';
import aneoSvg from './aneo-svg';

/**
 * @type {import('vitepress').UserConfig}
 */
export default {
  base: process.env.NODE_ENV === 'production' ? '/ArmoniK.Admin.GUI/' : '/',

  lang: 'en-US',
  title: 'Admin GUI - ArmoniK',
  description: 'A user interface to monitor and manage an ArmoniK cluster',

  lastUpdated: true,
  cleanUrls: 'without-subfolders',

  themeConfig: {
    siteTile: 'Admin GUI',

    nav: nav(),

    sidebar: {
      '/guide/': sidebarGuide(),
    },

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
      {
        icon: {
          svg: aneoSvg,
        },
        link: 'https://aneo.eu',
      },
    ],

    footer: {
      message: 'Released under the Apache-2 License.',
      copyright: '2022-present Aneo',
    },
  },
};

function nav() {
  return [
    { text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
    {
      text: version,
      items: [
        {
          text: 'Releases',
          link: 'https://github.com/aneoconsulting/ArmoniK.Admin.GUI/releases',
        },
      ],
    },
  ];
}

function sidebarGuide() {
  return [
    {
      text: 'Introduction',
      collapsible: true,
      items: [
        { text: 'Getting Started', link: '/guide/getting-started' },
        {
          text: 'Understand the layout',
          link: '/guide/understand-layout',
        },
      ],
    },
    {
      text: 'Authentication',
      collapsible: true,
      items: [
        { text: 'Login', link: '/guide/login' },
        {
          text: 'Logout',
          link: '/guide/logout',
        },
        {
          text: 'Permissions',
          link: '/guide/permissions',
        },
      ],
    },
    {
      text: 'Datagrid',
      collapsible: true,
      items: [
        { text: 'Introduction', link: '/guide/datagrid-introduction' },
        {
          text: 'Filtering',
          link: '/guide/datagrid-filtering',
        },
        {
          text: 'Sorting',
          link: '/guide/datagrid-sorting',
        },
        {
          text: 'Pagination',
          link: '/guide/datagrid-pagination',
        },
        {
          text: 'Custom Columns',
          link: '/guide/datagrid-custom-columns',
        },
      ],
    },
    {
      text: 'Data',
      collapsible: true,
      items: [
        { text: 'Applications', link: '/guide/applications' },
        {
          text: 'Partitions',
          link: '/guide/partitions',
        },
      ],
    },
    {
      text: 'Compute',
      collapsible: true,
      items: [
        { text: 'Sessions', link: '/guide/sessions' },
        {
          text: 'Tasks',
          link: '/guide/tasks',
        },
        {
          text: 'Results',
          link: '/guide/results',
        },
      ],
    },
    {
      text: 'Goodies',
      collapsible: true,
      items: [
        { text: 'Languages', link: '/guide/languages' },
        {
          text: 'External Services',
          link: '/guide/external-services',
        },
        {
          text: 'Favorites',
          link: '/guide/favorites',
        },
        {
          text: 'History',
          link: '/guide/history',
        },
      ],
    },
  ];
}
