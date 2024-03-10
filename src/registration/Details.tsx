import { Email } from "./Email";
import { Name } from "./Name";

export const Details = () => {
  return (
    <section class="mt-4">
      <h2>Your Details</h2>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
        }}
      >
        <Email />
        <Name />
      </form>
    </section>
  );
};
