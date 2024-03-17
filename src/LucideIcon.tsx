import {
  ChevronDown,
  ChevronUp,
  type IconNode,
  Home,
  Linkedin,
  Github,
  CircleCheckBig,
} from "lucide";
import { For } from "solid-js";
import { Dynamic } from "solid-js/web";

export const LucideIcon = (
  props: {
    icon: IconNode;
    class?: string;
  } & LucideProps
) => {
  const [, attrs, children] = props.icon;
  const svgProps = {
    "stroke-width": props.strokeWidth ?? attrs.strokeWidth ?? 2,
  };
  return (
    <svg
      {...{ ...attrs, ...svgProps }}
      style={{
        width: `${props.size ?? 24}px`,
        height: `${props.size ?? 24}px`,
      }}
      class={`icon ${props.class ?? ""}`}
    >
      <For each={children}>
        {([elementName, attrs]) => (
          <Dynamic component={elementName} {...attrs} />
        )}
      </For>
    </svg>
  );
};

export type LucideProps = {
  size?: number;
  strokeWidth?: number;
  class?: string;
};

export const Expand = (props: LucideProps) => (
  <LucideIcon icon={ChevronDown} {...props} />
);

export const Collapse = (props: LucideProps) => (
  <LucideIcon icon={ChevronUp} {...props} />
);

export const Homepage = (props: LucideProps) => (
  <LucideIcon icon={Home} {...props} />
);

export const LinkedIn = (props: LucideProps) => (
  <LucideIcon icon={Linkedin} {...props} />
);

export const GitHub = (props: LucideProps) => (
  <LucideIcon icon={Github} {...props} />
);

export const OK = (props: LucideProps) => (
  <LucideIcon icon={CircleCheckBig} {...props} />
);
