import { Show, type ParentProps, type JSX } from "solid-js";

export const Row = (props: ParentProps<{ aside?: JSX.Element }>) => (
  <div class="row mb-4">
    <div class="col-12 col-lg-8 col-xl-7">{props.children}</div>
    <Show when={props.aside !== undefined}>
      <div class="col-12 col-lg-4 col-xl-4 offset-xl-1">{props.aside}</div>
    </Show>
  </div>
);
