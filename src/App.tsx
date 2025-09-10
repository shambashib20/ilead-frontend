import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { ErrorComponent } from "@tanstack/react-router";
import { queryClient } from "./utils/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useUser } from "./features/auth/hooks/useUser";
import { Toaster } from "sonner";
import { CircleCheck, CircleX, Info, Loader, ShieldAlert } from "lucide-react";

// import { useTheme } from "./contexts/ThemeProvider";
import BrandLoader from "./components/BrandLoader/BrandLoader";

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className="h-screen flex items-center justify-center">
      <BrandLoader />
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  context: {
    queryClient,
    isAuthenticated: false,
    user: null,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
function App() {
  const { data } = useUser();
  // const { theme } = useTheme();

  return (
    <>
      <RouterProvider
        router={router}
        context={{
          queryClient,
          user: data,
          isAuthenticated: !!data,
        }}
      />
      <Toaster
        // theme={theme as ToasterProps["theme"]}
        icons={{
          success: <CircleCheck size={20} />,
          info: <Info size={20} />,
          warning: <ShieldAlert />,
          error: <CircleX size={20} />,
          loading: <Loader size={20} />,
        }}
        toastOptions={{
          classNames: {
            toast: "toast",
            title: "toast-title",
            description: "toast-description",
            actionButton: "toast-action-button",
            cancelButton: "toast-cancel-button",
            closeButton: "toast-close-button",
          },
        }}
      />
      <TanStackRouterDevtools router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export default App;
