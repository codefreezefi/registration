import { useRegistration } from "./context/Registration";
import { Show, type JSX } from "solid-js";
import { Avatar } from "./icons/Avatar";
import { GitHub, Homepage, LinkedIn } from "./LucideIcon";

import { Mastodon } from "./icons/Mastodon";
import { Matrix } from "./icons/Matrix";

import "./ProfilePreview.css";

export const ProfilePreview = () => {
  const { registration } = useRegistration();
  return (
    <Show when={registration.publicProfile}>
      <Show when={registration.name !== null}>
        <div class="profile-preview">
          <Show when={registration.photo !== null} fallback={<Avatar />}>
            <div class="photo">
              <img
                src={registration.photo!.toString()}
                alt={registration.name ?? "Photo"}
              />
            </div>
          </Show>
          <h1>
            {registration.name}
            <Show when={registration.pronouns !== null}>
              <br />
              <small>{registration.pronouns}</small>
            </Show>
          </h1>
          <dl class="links">
            <ProfileLink
              link={registration.homepage}
              title="Homepage"
              icon={<Homepage />}
            />
            <ProfileLink
              link={registration.mastodon}
              title="Mastodon"
              icon={<Mastodon />}
            />
            <ProfileLink
              link={registration.linkedin}
              title="LinkedIn"
              icon={<LinkedIn />}
            />
            <ProfileLink
              link={registration.matrix}
              title="Matrix"
              icon={<Matrix />}
            />
            <ProfileLink
              link={registration.github}
              title="GitHub"
              icon={<GitHub />}
            />
          </dl>
        </div>
      </Show>
    </Show>
  );
};

const ProfileLink = (props: {
  link: URL | null;
  title: string;
  icon: JSX.Element;
}) => (
  <Show when={props.link !== null}>
    <dt>
      {props.title}
      {props.icon}
    </dt>
    <dd>
      <a href={props.link!.toString()} target="_blank">
        {props
          .link!.toString()
          .replace(/^https?:\/\//, "")
          .replace(/\/$/, "")}
      </a>
    </dd>
  </Show>
);
