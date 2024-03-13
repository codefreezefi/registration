import { type ParentProps, createSignal, Show } from "solid-js";
import { Collapse, Expand } from "./LucideIcon";

import "./Collapsible.css";

export const Collapsible = (props: ParentProps<{ title: string }>) => {
  const [expanded, setExpanded] = createSignal<boolean>(true);

  return (
    <Show
      when={expanded()}
      fallback={
        <div class="collapsible card">
          <header class="card-body">
            <h2 class="card-title">{props.title}</h2>
            <button
              type="button"
              class="btn btn-link"
              onClick={() => setExpanded((e) => !e)}
            >
              <Expand />
            </button>
          </header>
        </div>
      }
    >
      <div class="collapsible card">
        <header class="card-header">
          <h2 class="card-title">{props.title}</h2>
          <button
            type="button"
            class="btn btn-link"
            onClick={() => setExpanded((e) => !e)}
          >
            <Collapse />
          </button>
        </header>
        <div class="card-body">{props.children}</div>
      </div>
    </Show>
  );
};
