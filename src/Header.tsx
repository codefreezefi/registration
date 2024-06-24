import { Logo } from "./Logo.js";
import { Codefreeze } from "./codefreeze.js";

import "./Header.css";

export const Header = () => (
  <header class="main">
    <h1>
      CODE
      <br />
      <small>FREEZE</small>
    </h1>
    <Logo class="logo" />

    <p>
      Sat {Codefreeze.start.getDate()}. &mdash; Sat {Codefreeze.end.getDate()}.
      <br />
      January {Codefreeze.end.getFullYear()}
    </p>
    <p>
      Kiilopää
      <br />
      Finland
    </p>
  </header>
);
