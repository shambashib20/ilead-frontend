import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_masterLayout/masterpannel/todays-followups/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_masterLayout/masterpannel/todays-followups/"!</div>
}
