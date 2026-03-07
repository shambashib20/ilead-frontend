function Header() {
  return (
    <header>
      <div className="container">
        <div className="flex items-center">
          <div className="logo">
            <a href="">
              <img src="/img/logo_dark.png" alt="" />
            </a>
          </div>
          <nav>
            <ul className="flex items-center justify-center">
              <li className="active">
                <a href=""> Home </a>
              </li>
              <li>
                <a href="/pricing"> Pricing </a>
              </li>

              <li>
                <a href="/contact.html"> Contacts </a>
              </li>
            </ul>
          </nav>
          <div className="options">
            <ul className="flex justify-end items-center">
              <li>
                <select name="" id="">
                  <option value="">en</option>
                </select>
              </li>
              <li>
                <a href="/login" className="login">
                  Login
                </a>
              </li>
              <li>
                <button className="register" id="openModalBtn">
                  <span>
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-arrow-right"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </li>
            </ul>
          </div>

          <div className="hamburger">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-menu-icon lucide-menu"
              >
                <path d="M4 5h16" />
                <path d="M4 12h16" />
                <path d="M4 19h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
