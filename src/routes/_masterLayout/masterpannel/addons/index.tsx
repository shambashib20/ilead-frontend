import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_masterLayout/masterpannel/addons/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_masterLayout/masterpannel/addons/"!</div>
}
