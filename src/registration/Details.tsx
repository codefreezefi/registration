import { Collapsible } from "../Collapsible";
import { Email } from "./Email";
import { Name } from "./Name";

export const Details = () => {
  return (
    <Collapsible title="Your Details">
      <section class="mt-4">
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
          }}
        >
          <Name />
          <Email />
        </form>
      </section>
    </Collapsible>
  );
};
