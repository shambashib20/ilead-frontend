import HeaderBtnLists from "./ui/HeaderBtnLists";
import HeaderOptionsBox from "./ui/HeaderOptions";
import UserProfileBox from "./ui/UserProfile";

function Header() {
  return (
    <header className="bg-primary p-3 flex items-center justify-between shadow rounded-sm">
      <HeaderBtnLists />
      <HeaderOptionsBox />
      <UserProfileBox />

      <button className="lg:hidden" onClick={() => {}}>
        menu
      </button>
    </header>
  );
}

export default Header;
