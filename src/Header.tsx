import { Logo } from "./Logo";
import { Codefreeze } from "./codefreeze";

import "./Header.css";

const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "full",
});

export const Header = () => (
  <header class="main">
    <h1>
      CODE
      <br />
      <small>FREEZE</small>
    </h1>
    <Logo class="logo" />

    <p>
      {dateFormat.format(Codefreeze.start)}
      &mdash;
      <br />
      {dateFormat.format(Codefreeze.end)}
    </p>
    <p>Kiilopää, Inari, Finland</p>
  </header>
);
