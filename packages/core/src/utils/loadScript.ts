export const loadScript = (src: string) =>
  typeof document === "undefined"
    ? Promise.resolve()
    : new Promise<void>((resolve, reject) => {
        const element = document.createElement("script");
        const { head } = document;
        element.src = src;
        element.async = true;

        element.onload = () => {
          head.removeChild(element);
          resolve();
        };

        element.onerror = () => {
          head.removeChild(element);
          reject(new Error(`Failed to load script ${src}`));
        };

        head.appendChild(element);
      });
