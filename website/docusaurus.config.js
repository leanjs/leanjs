// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
// eslint-disable-next-line @typescript-eslint/no-var-requires
const lightCodeTheme = require("prism-react-renderer/themes/github");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "LeanJS",
  tagline: "Tools for building maintainable and performant micro-frontends ",
  url: "https://leanjs.org",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "leanjs", // Usually your GitHub org/user name.
  projectName: "leanjs", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          editUrl: "https://github.com/leanjs/leanjs/edit/main/docs/",
          path: "../docs",
          routeBasePath: "/",
          sidebarPath: "sidebars.js",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "packages",
        breadcrumbs: false,
        path: "../packages",
        routeBasePath: "packages",
        include: ["**/*.md", "**/*.mdx"],
        exclude: [
          "**/_*.{js,jsx,ts,tsx,md,mdx}",
          "**/_*/**",
          "**/*.test.{js,jsx,ts,tsx}",
          "**/CHANGELOG.md",
          "**/__tests__/**",
          "**/node_modules/**",
        ],
        sidebarItemsGenerator: async (
          /** @type {{ docs: { id: string; sourceDirName: string; }[]; }} */ items
        ) => {
          return items.docs
            .sort((a, b) =>
              a.sourceDirName < b.sourceDirName
                ? -1
                : a.sourceDirName > b.sourceDirName
                ? 1
                : 0
            )
            .reduce((acc, { id, sourceDirName }) => {
              const item = {
                label: sourceDirName,
                id,
                type: "doc",
              };
              if (id === "runtime/README") {
                return acc;
              } else if (id === "create-micro-frontends/README") {
                return [item, ...acc];
              } else {
                return [...acc, item];
              }
            }, []);
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "LeanJS",
        // logo: {
        //   alt: "My Site Logo",
        //   src: "img/logo.svg",
        // },
        items: [
          {
            type: "doc",
            docId: "introduction",
            position: "left",
            label: "Docs",
          },
          {
            to: "/packages/create-micro-frontends",
            label: "Packages",
            position: "left",
          },
          {
            href: "https://github.com/leanjs/leanjs",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/leanjs",
              },
            ],
          },
          {
            title: "Code",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/leanjs/leanjs",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                href: "https://alexlobera.com",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} LeanJS.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
