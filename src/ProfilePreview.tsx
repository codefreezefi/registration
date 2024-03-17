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
    <Show when={registration.name !== undefined}>
      <aside class="mt-4">
        <h2>Preview</h2>
        <p>
          Codefreeze is an Unconference which means we do not have a traditional
          conference program with speaker profiles. Therefore we list
          participants' profiles on{" "}
          <a
            href="https://codefreeze.fi/"
            target="_blank"
            rel="noreferrer noopener friend"
          >
            codefreeze.fi
          </a>{" "}
          so new attendees can get an impression of who to meet.
        </p>
        <p>Below is a preview of your public profile:</p>
        <div class="profile-preview">
          <Show when={registration.photo !== undefined} fallback={<Avatar />}>
            <div class="photo">
              <img
                src={registration.photo!.toString()}
                alt={registration.name ?? "Photo"}
              />
            </div>
          </Show>
          <h1>
            {registration.name}
            <Show when={registration.pronouns !== undefined}>
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
              text={registration.linkedin
                ?.toString()
                .replace(/https:\/\/(www)?\.linkedin\.com\/in\//, "")}
              title="LinkedIn"
              icon={<LinkedIn />}
            />
            <ProfileLink
              link={registration.matrix}
              text={registration.matrix
                ?.toString()
                .replace("https://matrix.to/#/", "")}
              title="Matrix"
              icon={<Matrix />}
            />
            <ProfileLink
              link={registration.github}
              text={registration.github
                ?.toString()
                .replace("https://github.com/", "@")}
              title="GitHub"
              icon={<GitHub />}
            />
          </dl>
        </div>
      </aside>
    </Show>
  );
};

const ProfileLink = (props: {
  link?: URL;
  text?: string;
  title: string;
  icon: JSX.Element;
}) => (
  <Show when={props.link !== undefined}>
    <dt>
      {props.title}
      {props.icon}
    </dt>
    <dd>
      <a href={props.link!.toString()} target="_blank">
        {(props.text ?? props.link!.toString())
          .replace(/^https?:\/\//, "")
          .replace(/\/$/, "")}
      </a>
    </dd>
  </Show>
);
