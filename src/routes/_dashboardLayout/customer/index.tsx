import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboardLayout/customer/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboardLayout/customer/"!</div>
}
