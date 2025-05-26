import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

interface RouterContext {
  queryClient: QueryClient;
  user: any;
  isAuthenticated: boolean;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: () => {
    return <p>Global Notfound page</p>;
  },
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}
