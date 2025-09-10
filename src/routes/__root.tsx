import Modal from "@/components/Modal";
import NotFound from "@/components/NotFound/NotFound";
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

interface RouterContext {
  queryClient: QueryClient;
  user: any;
  isAuthenticated: boolean;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: () => <NotFound />,

  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <Modal />
    </>
  );
}
