import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_masterLayout/masterpannel/workspace/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_masterLayout/masterpannel/workspace/"!</div>
}
