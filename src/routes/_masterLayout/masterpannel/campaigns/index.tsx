import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_masterLayout/masterpannel/campaigns/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_masterLayout/masterpannel/campaigns/"!</div>
}
