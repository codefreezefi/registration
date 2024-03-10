import "./Header.css";
import { Logo } from "./Logo";
import { Codefreeze } from "./codefreeze";

const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "full",
});

export const Header = () => (
  <header>
    <Logo class="logo" />
    <h1>
      CODE
      <br />
      <small>FREEZE</small>
    </h1>
    <p>Kiilopää, Inari, Finland</p>
    <p>
      {dateFormat.format(Codefreeze.start)}
      &mdash;
      <br />
      {dateFormat.format(Codefreeze.end)}
    </p>
  </header>
);
