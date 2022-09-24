```tsx
const ZimaBlueLazyComponent = React.lazy(
  () => import("../src/works/zima-blue")
);

<Suspense fallback={<Fallback />}>
  <ZimaBlueLazyComponent />
</Suspense>;
```

```tsx
const ZimaBlueLazyApp = () => import("@art-boards/zima-blue");

<Host fallback={<Fallback />} app={ZimaBlueLazyApp} />;
```

```tsx
import ChatApp from "@art-boards/chat";

<Host app={ChatApp} />;
```
