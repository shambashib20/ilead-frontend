import HeaderActionButton from "./HeaderBtn";
import { Funnel, Plus } from "lucide-react";
import { useModalStore } from "@/store/useModalStore";
import CreateLeadModal from "@/features/leads/components/HeaderBtnModals/CreateLeadModal";

const headerButtons = [
  {
    label: "Lead",
    icon: Plus,
    afterIcon: Funnel,
    modalEl: <CreateLeadModal />,
  },
];

function HeaderBtnLists() {
  // const { mobileOpen } = useSidebarStore();
  const { openModal, setModalSize } = useModalStore();

  return (
    <ul className="hidden sm:flex gap-2 items-center ">
      {headerButtons.map((btn, index) => (
        <li
          key={index}
          onClick={() => {
            setModalSize?.("md");
            openModal({
              type: "info",
              content: btn.modalEl,
            });
          }}
        >
          <HeaderActionButton
            icon={btn.icon}
            label={btn.label}
            afterIcon={btn.afterIcon}
          />
        </li>
      ))}
    </ul>
  );
}

export default HeaderBtnLists;
