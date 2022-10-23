import {
  filterAndVersionDependencies,
  mergeDependencies,
  filterDependencies,
  formatSharedDependencies,
  getImplicitlySharedDependencies,
} from "./dependencies";

describe("dependencies:", () => {
  describe("filterAndVersionDependencies:", () => {
    it("uses a shared version if the version of a given name is * in peerDependencies and the name is a shared dependency", () => {
      const dependencies = {
        name_b: "*",
        name_c: "*",
      };
      const monorepoDependencies = {
        name_b: Math.random().toString(),
      };

      const actual = filterAndVersionDependencies({
        dependencies,
        filterAndVersionBy: monorepoDependencies,
      });

      expect(actual).toEqual({ name_b: monorepoDependencies.name_b });
    });

    it("uses a peerDependency version of a given name if the peerDependency version is different than * and the name is a shared dependency", () => {
      const dependencies = {
        name_a: Math.random().toString(),
        name_b: Math.random().toString(),
      };
      const monorepoDependencies = {
        name_b: Math.random().toString(),
      };

      const actual = filterAndVersionDependencies({
        dependencies,
        filterAndVersionBy: monorepoDependencies,
      });

      expect(actual).toEqual({ name_b: dependencies.name_b });
    });

    it("doesn't use any version if a name is not defined in the shared dependencies", () => {
      const dependencies = {
        name_a: Math.random().toString(),
        name_b: Math.random().toString(),
      };
      const monorepoDependencies = {};

      const actual = filterAndVersionDependencies({
        dependencies,
        filterAndVersionBy: monorepoDependencies,
      });

      expect(actual).toEqual({});
    });
  });

  describe("mergeDependencies:", () => {
    it("merges empty objects into an empty object", () => {
      const overridable = {};
      const nonoverridable = {};
      const actual = mergeDependencies(overridable, nonoverridable);

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
      const actual = mergeDependencies(overridable, nonoverridable);

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
      const actual = mergeDependencies(overridable, nonoverridable);

      expect(actual).toEqual({
        name_a: version_a,
        name_b: version_b,
      });
    });
  });

  describe("filterDependencies:", () => {
    it("removes dependencies from the dependencies argument given the filterDependencies argument", () => {
      const version_a = Math.random().toString();
      const version_b = Math.random().toString();
      const version_c = Math.random().toString();
      const dependencies = {
        name_a: version_a,
        [version_b]: Math.random().toString(),
        name_c: version_c,
      };
      const excludeDependencies = [version_b];
      const actual = filterDependencies({ dependencies, excludeDependencies });

      expect(actual).toEqual({
        name_a: version_a,
        name_c: version_c,
      });
    });

    it("doesn't remove any dependencies from the dependencies argument if the filterDependencies is not passed", () => {
      const version_a = Math.random().toString();
      const version_b = Math.random().toString();
      const version_c = Math.random().toString();
      const dependencies = {
        name_a: version_a,
        [version_b]: Math.random().toString(),
        name_c: version_c,
      };
      const actual = filterDependencies({ dependencies });

      expect(actual).toEqual(dependencies);
    });
  });

  describe("getImplicitlySharedDependencies:", () => {
    it("returns undefined if autoShared is false", () => {
      const actual = getImplicitlySharedDependencies({
        autoShared: false,
        packageName: "somePackage",
      });

      expect(actual).toEqual(undefined);
    });
  });

  describe("formatSharedDependencies:", () => {
    it("adds eager to each dependency if eager is passed as an argument", () => {
      const eager = Math.random() < 0.5;
      const explicitDependencies = {
        react: Math.random().toString(),
      };
      const implicitDependencies = {
        lodash: Math.random().toString(),
      };

      const actual = formatSharedDependencies({
        eager,
        explicitDependencies,
        implicitDependencies,
      });

      expect(actual).toEqual({
        react: { eager, requiredVersion: explicitDependencies.react },
        lodash: { eager, requiredVersion: implicitDependencies.lodash },
        "@leanjs/react/18": "*",
      });
    });

    it("doesn't override eager in an explicit dependency if eager is defined in the explicit dependency", () => {
      const eager = Math.random() < 0.5;
      const explicitDependencies = {
        react: { eager: !eager },
      };
      const implicitDependencies = {
        lodash: Math.random().toString(),
      };

      const actual = formatSharedDependencies({
        eager,
        explicitDependencies,
        implicitDependencies,
      });

      expect(actual).toEqual({
        react: { eager: !eager },
        lodash: { eager, requiredVersion: implicitDependencies.lodash },
        "@leanjs/react/18": "*",
      });
    });

    it("overrides requiredVersion in explicitDependencies with version from implicitDependencies if no requiredVersion is defined", () => {
      const explicitDependencies = {
        react: {
          eager: false,
        },
      };
      const implicitDependencies = {
        lodash: Math.random().toString(),
        react: Math.random().toString(),
      };

      const actual = formatSharedDependencies({
        explicitDependencies,
        implicitDependencies,
      });

      expect(actual).toEqual({
        react: { eager: false, requiredVersion: implicitDependencies.react },
        lodash: implicitDependencies.lodash,
        "@leanjs/react/18": "*",
      });
    });

    it("overrides requiredVersion in explicitDependencies with version from implicitDependencies if no requiredVersion is defined", () => {
      const eager = false;
      const explicitDependencies = {
        react: {
          eager: false,
        },
      };
      const implicitDependencies = {
        lodash: Math.random().toString(),
        react: Math.random().toString(),
      };

      const actual = formatSharedDependencies({
        eager,
        explicitDependencies,
        implicitDependencies,
      });

      expect(actual).toEqual({
        react: { eager: false, requiredVersion: implicitDependencies.react },
        lodash: { eager, requiredVersion: implicitDependencies.lodash },
        "@leanjs/react/18": "*",
      });
    });
  });
});
