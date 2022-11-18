import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import styles from "./index.module.css";
import useBaseUrl from "@docusaurus/useBaseUrl";

function Index({ config: siteConfig }) {
  return (
    <div>
      <Head>
        <title>
          {siteConfig.title}| {siteConfig.tagline}
        </title>
      </Head>
      <header className={clsx("hero", styles.heroBanner)}>
        <div className="container padding-top--lg">
          <p style={{ fontSize: "6rem" }}>🤸🏽‍♀️</p>
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--primary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/getting-started")}
            >
              Get Started&nbsp;&nbsp;→
            </Link>
            <Link
              className="margin-left--md"
              to="https://github.com/leanjs/leanjs"
            >
              Star on GitHub{" "}
              <strong className={styles.star}>&nbsp;&nbsp;⭐️</strong>
            </Link>
          </div>
        </div>
      </header>
      <main>
        <div className="container padding-vert--xl">
          <h2 className="text--center margin-bottom--xl">Why LeanJS?</h2>
          <div className="row">
            <div className="col col--4 margin-bottom--lg">
              <div className="card">
                <div className="card__header">
                  <h3>🏗 Safe architecture</h3>
                </div>
                <div className="card__body">
                  <p>
                    Incrementally break up front-end monoliths into independent
                    applications. Switch back from independent applications to
                    monolith at ease.
                  </p>
                </div>
              </div>
            </div>
            <div className="col col--4 margin-bottom--lg">
              <div className="card">
                <div className="card__header">
                  <h3>👩🏻‍💻 Developer experience</h3>
                </div>
                <div className="card__body">
                  <p>
                    Modern and familiar development. Use components, React
                    hooks, Vue composables, etc to interact with and compose
                    your independent apps.
                  </p>
                </div>
              </div>
            </div>
            <div className="col col--4 margin-bottom--lg">
              <div className="card">
                <div className="card__header">
                  <h3>🛡 TypeScript everywhere </h3>
                </div>
                <div className="card__body">
                  <p>
                    Built with TypeScript from the ground up. Full TypeScript
                    support across independent apps.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col col--4 margin-bottom--lg">
              <div className="card">
                <div className="card__header">
                  <h3>🔋 Batteries included</h3>
                </div>
                <div className="card__body">
                  <p>
                    Communicate state changes between apps, safely share runtime
                    resources, deploy independently, and more.
                  </p>
                </div>
              </div>
            </div>
            <div className="col col--4 margin-bottom--lg">
              <div className="card">
                <div className="card__header">
                  <h3>⚙️ Powered by your tech stack</h3>
                </div>
                <div className="card__body">
                  <p>
                    It integrates with your tech stack beyond your UI library.
                  </p>
                </div>
              </div>
            </div>
            <div className="col col--4 margin-bottom--lg">
              <div className="card">
                <div className="card__header">
                  <h3>🔌 Minimal APIs</h3>
                </div>
                <div className="card__body">
                  <p>Minimal design and APIs to fit into many solutions.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col col--4 margin-bottom--lg">
              <div className="card">
                <div className="card__header">
                  <h3>🧩 Composable apps</h3>
                </div>
                <div className="card__body">
                  <p>
                    Seamlessly compose Web applications at runtime or build
                    time. Slice your front-end monolith both horizontally and
                    vertically.
                  </p>
                </div>
              </div>
            </div>
            <div className="col col--4 margin-bottom--lg">
              <div className="card">
                <div className="card__header">
                  <h3>🔖 Low learning curve</h3>
                </div>
                <div className="card__body">
                  <p>
                    Use all the modern front-end concepts that you are already
                    know: component composition, reactivity, suspense,
                    monorepos, packages, etc.
                  </p>
                </div>
              </div>
            </div>
            <div className="col col--4 margin-bottom--lg">
              <div className="card">
                <div className="card__header">
                  <h3>🏁 Easy to get started</h3>
                </div>
                <div className="card__body">
                  <p>Create a quick PoC in a few minutes.</p>
                </div>
                <div className="card__footer">
                  <a
                    href={useBaseUrl("docs/getting-started")}
                    className="button button--secondary button--block"
                  >
                    Let's get started!
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function IndexPage(props) {
  return (
    <Layout>
      <Index {...props} />
    </Layout>
  );
}
