import { versionDependencies, mergeDependencyVersions } from "./dependencies";

describe("dependencies:", () => {
  describe("versionDependencies:", () => {
    it("uses a shared version if the version of a given name is * in peerDependencies and the name is a shared dependency", () => {
      const dependencies = {};
      const peerDependencies = {
        name_b: "*",
        name_c: "*",
      };
      const sharedDependencies = {
        name_b: Math.random().toString(),
      };

      const actual = versionDependencies({
        dependencies,
        peerDependencies,
        sharedDependencies,
      });

      expect(actual).toEqual({ name_b: sharedDependencies.name_b });
    });

    it("uses a peerDependency version of a given name if the peerDependency version is different than * and the name is a shared dependency", () => {
      const dependencies = {
        name_a: Math.random().toString(),
      };
      const peerDependencies = {
        name_b: Math.random().toString(),
      };
      const sharedDependencies = {
        name_b: Math.random().toString(),
      };

      const actual = versionDependencies({
        dependencies,
        peerDependencies,
        sharedDependencies,
      });

      expect(actual).toEqual({ name_b: peerDependencies.name_b });
    });

    it("doesn't use any version if a name is not defined in the shared dependencies", () => {
      const dependencies = {
        name_a: Math.random().toString(),
      };
      const peerDependencies = {
        name_b: Math.random().toString(),
      };
      const sharedDependencies = {};

      const actual = versionDependencies({
        dependencies,
        peerDependencies,
        sharedDependencies,
      });

      expect(actual).toEqual({});
    });
  });

  describe("mergeDependencyVersions:", () => {
    it("merges empty objects into an empty object", () => {
      const overridable = {};
      const nonoverridable = {};
      const actual = mergeDependencyVersions(overridable, nonoverridable);

      expect(actual).toEqual({});
    });

    it("merges two different version sets", () => {
      const version_a = Math.random().toString();
      const version_b = Math.random().toString();
      const overridable = {
        name_a: version_a,
      };
      const nonoverridable = {
        name_b: version_b,
      };
      const actual = mergeDependencyVersions(overridable, nonoverridable);

      expect(actual).toEqual({
        name_a: version_a,
        name_b: version_b,
      });
    });

    it("merges two different version sets and takes the non overridable version when a name overlaps", () => {
      const version_a = Math.random().toString();
      const version_b = Math.random().toString();
      const overridable = {
        name_a: version_a,
        name_b: Math.random().toString(),
      };
      const nonoverridable = {
        name_b: version_b,
      };
      const actual = mergeDependencyVersions(overridable, nonoverridable);

      expect(actual).toEqual({
        name_a: version_a,
        name_b: version_b,
      });
    });
  });
});
