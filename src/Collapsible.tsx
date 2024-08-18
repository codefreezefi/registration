import { type ParentProps, createSignal, Show } from "solid-js";
import { Collapse, Expand, OK } from "./LucideIcon.js";

import "./Collapsible.css";

export const Collapsible = (
  props: ParentProps<{ title: string; ok?: boolean }>,
) => {
  const [expanded, setExpanded] = createSignal<boolean>(true);

  return (
    <Show
      when={expanded()}
      fallback={
        <div class="collapsible card">
          <header class="card-body">
            <span>
              <h2 class="card-title">{props.title}</h2>
              <Show when={props.ok ?? false}>
                <OK class="ok" strokeWidth={4} size={30} />
              </Show>
            </span>
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
          <span>
            <h2 class="card-title">{props.title}</h2>
            <Show when={props.ok ?? false}>
              <OK class="ok" strokeWidth={4} size={30} />
            </Show>
          </span>
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
