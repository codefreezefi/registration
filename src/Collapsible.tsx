import { type ParentProps, createSignal, Show } from "solid-js";
import { Collapse, Expand } from "./LucideIcon";

import "./Collapsible.css";

export const Collapsible = (props: ParentProps<{ title: string }>) => {
  const [expanded, setExpanded] = createSignal<boolean>(true);
  return (
    <div class="collapsible">
      <header>
        <Show when={expanded()} fallback={<p>{props.title}</p>}>
          <h2>{props.title}</h2>
        </Show>
        <button
          type="button"
          class="btn btn-link"
          onClick={() => setExpanded((e) => !e)}
        >
          <Show when={expanded()} fallback={<Expand />}>
            <Collapse />
          </Show>
        </button>
      </header>
      <Show when={expanded()}>{props.children}</Show>
    </div>
  );
};
