import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import templateBgImg from "@/assets/templates.png";
export const Route = createFileRoute("/_dashboardLayout/general-templates/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="space-y-7 mt-7">
      <div className="bg-primary py-5 px-5 rounded-sm shadow-lead">
        <h2 className="text-xl sm:text-2xl font-medium tracking-tight ">
          Category Wise Template
        </h2>
      </div>
      <Card className="border-0 shadow-none py-3">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Links list */}
          <div>
            <CardContent className="divide-y divide-gray-300 dark:divide-gray-500">
              <LinkRow
                title="Lead Template"
                href="/general-templates/lead-template"
              />
              <LinkRow title="Meeting Template" href="#" active />
              <LinkRow title="Invoice Template" href="#" />
              <LinkRow title="Reminder Template" href="#" />
              <LinkRow title="Greeting Template" href="#" />
            </CardContent>
          </div>

          {/* Vector / PNG placeholder */}
          <div className="">
            <CardContent className="p-0">
              <div
                className="w-full aspect-[4/3] rounded-xl mt-6"
                aria-label="Vector placeholder"
              >
                <img src={templateBgImg} alt="" />
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </section>
  );
}

/**
 * Inner main section only (no header, footer, or sidebar)
 * Left: list of link rows
 * Right: vector/png placeholder (black box)
 * Tech: shadcn/ui + Tailwind + lucide-react
 */

function LinkRow({
  title,
  href,
}: {
  title: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      to={href}
      className={`flex items-center  justify-between py-5 transition-colors  `}
    >
      <div className="flex items-center gap-3 text-foreground">
        <span className="grid h-6 w-6 place-items-center rounded-full ">
          <PlusIcon size={20} />
        </span>
        <span className="text-sm font-normal hover:font-medium hover:text-violet-900 dark:hover:text-violet-200">
          {title}
        </span>
      </div>
    </Link>
  );
}
