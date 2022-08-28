import { isObject, isPrimitive } from "../utils";

interface StoreNode {
  subscribers?: Set<any>;
  watcher?: ProxyHandler<Record<string, any>>;
  children: Record<string, StoreNode>;
}

function traverseAndCallSubscribers(node: StoreNode) {
  callNodeSubscribers(node);
  for (const key in node.children) {
    traverseAndCallSubscribers(node.children[key]);
  }
}

function callNodeSubscribers(node: StoreNode) {
  node?.subscribers?.forEach((subscriber) => subscriber(node.watcher));
}

function notifySubscribers(paths: string[], rootNode: StoreNode) {
  let node = rootNode;
  for (const path of paths) {
    node = node?.children[path];
    if (!node) return;
    callNodeSubscribers(node);
  }

  for (const key in node.children) {
    traverseAndCallSubscribers(node.children[key]);
  }
}

function shallowWatch({
  stateNode,
  node,
  rootNode,
  paths,
}: {
  stateNode: any;
  node: StoreNode;
  rootNode: StoreNode;
  paths: string[];
}) {
  if (node.watcher !== stateNode) {
    node.watcher = new Proxy(stateNode, {
      set(target, prop, value) {
        if (target.hasOwnProperty(prop)) {
          const currentPaths = [...paths, prop as string];
          target[prop] = value;
          const childNode = node.children[prop as string];
          if (value !== childNode.watcher) {
            deepWatch({
              stateNode: value,
              node: childNode,
              rootNode,
              paths: currentPaths,
            });
            notifySubscribers(currentPaths, rootNode);
          }

          return true;
        }

        return false;
      },
    });
  }

  return node.watcher;
}

function deepWatch({
  stateNode,
  node,
  rootNode,
  paths,
}: {
  stateNode: any;
  node: StoreNode;
  rootNode: StoreNode;
  paths: string[];
}) {
  if (
    (stateNode && stateNode === node.watcher) ||
    isPrimitive(stateNode) ||
    typeof stateNode === "function"
  ) {
    return stateNode;
  }

  if (isObject(stateNode)) {
    Object.keys(stateNode).forEach((path) => {
      const childState = stateNode[path];
      const nodeChildren = node.children;
      const childWatcher = nodeChildren[path];
      if (childState && childState !== nodeChildren?.watcher) {
        if (!childWatcher) {
          nodeChildren[path] = {
            children: {},
          };
        }

        stateNode[path] = deepWatch({
          stateNode: childState,
          node: nodeChildren[path],
          rootNode,
          paths: [...paths, path],
        });
      }
    });
  }

  return shallowWatch({
    stateNode,
    node,
    rootNode,
    paths,
  });
}

function findOrCreateNode(paths: string[], rootNode: StoreNode) {
  let node = rootNode;
  paths.forEach((child) => {
    if (!node.children[child]) {
      node.children[child] = {
        children: {},
      };
    }
    node = node.children[child];
  });

  return node;
}

export const createStore = (currentState: Record<string, any>) => {
  const rootNode: StoreNode = {
    children: {},
  };

  return {
    subscribe: (path: string, callback: any) => {
      const subpaths = path?.split(".");
      let node = rootNode;
      subpaths?.forEach((subpath, index) => {
        if (!subpath) return;

        if (!node.children[subpath]) {
          node.children[subpath] = {
            children: {},
          };
        }

        node = node.children[subpath];

        if (index === subpaths.length - 1) {
          if (!node.subscribers) {
            node.subscribers = new Set();
          }

          node.subscribers.add(callback);
        }
      });

      return () => {
        node?.subscribers?.delete(callback);
      };
    },

    getState: (path: string) => {
      const paths = path.split(".");
      const state = paths.reduce((acc, path) => acc[path], currentState);
      const node = findOrCreateNode(paths, rootNode);
      deepWatch({
        stateNode: state,
        node,
        rootNode,
        paths,
      });

      return {
        get ref() {
          return node.watcher as typeof state;
        },
        set ref(stateNode) {
          if (stateNode !== node.watcher) {
            deepWatch({
              stateNode,
              node,
              rootNode,
              paths,
            });
            notifySubscribers(paths, rootNode);
          }
        },
      };
    },
  };
};
