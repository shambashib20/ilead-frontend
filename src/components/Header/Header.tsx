import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import {
  Bell,
  Calendar,
  Copy,
  Ellipsis,
  Funnel,
  ListChecks,
  Moon,
  PhoneMissed,
  Plus,
  Presentation,
  Search,
  SquareCheckBig,
  SunDim,
} from "lucide-react";

function Header() {
  return (
    <header className="bg-white p-4 flex items-center justify-between  shadow rounded-sm">
      <ul className="flex gap-2 items-center ">
        <li>
          <Button variant={"rounded"}>
            {" "}
            <Plus /> Lead <Funnel />
          </Button>
        </li>
        <li>
          <Button variant={"rounded"}>
            {" "}
            <Plus /> Task <Calendar />
          </Button>
        </li>
        <li>
          <Button variant={"rounded"}>
            {" "}
            <Plus /> Note <SquareCheckBig />
          </Button>
        </li>
        <li>
          <Button variant={"rounded"}>
            {" "}
            <Plus /> Remider <Bell />
          </Button>
        </li>
        <li>
          <Button variant={"rounded"}>
            {" "}
            <Plus /> Meeting <Presentation />
          </Button>
        </li>
        <li>
          <Button size={"icon"} className="rounded-full">
            <Ellipsis />
          </Button>
        </li>
      </ul>
      <div className="options-box">
        <ul className="flex gap-2">
          <li>
            <Link to=".">
              <PhoneMissed size={20} />
            </Link>
          </li>
          <li>
            <Link to=".">
              <ListChecks size={20} />
            </Link>
          </li>
          <li>
            <Link to=".">
              <Copy size={20} />
            </Link>
          </li>
          <li>
            <Link to=".">
              <Search size={20} />
            </Link>
          </li>
          <li>
            <Link to=".">
              <Moon /> <SunDim />
            </Link>
          </li>
          <li>
            <Link to=".">
              <Bell />
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h3 className="flex flex-col">
          Usernmae <span>Staff</span>
        </h3>
        <img src="" alt="" />
      </div>
      <button className="lg:hidden" onClick={() => {}}>
        menu
      </button>
    </header>
  );
}

export default Header;
