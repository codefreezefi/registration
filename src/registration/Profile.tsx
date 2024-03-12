import { Show } from "solid-js";
import { useRegistration, type Registration } from "../context/Registration";
import { Collapsible } from "../Collapsible";

export const PublicProfile = () => {
  const { registration } = useRegistration();

  return (
    <Collapsible title="Your Profile">
      <section class="mt-4">
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
        <p>
          Please help us by providing some information about yourself below.
        </p>
        <NoProfileCheckBox />
        <Show when={registration.publicProfile}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ProfileURL
              key="photo"
              pattern={/^http?s:\/\/.+/}
              placeholder="https://example.com/photo.jpeg"
              title="A URL to your photo"
            />
            <ProfileURL
              key="homepage"
              pattern={/^http?s:\/\/.+/}
              placeholder="https://example.com/"
              title="Your homepage"
            />
            <ProfileURL
              key="mastodon"
              pattern={/^https:\/\/[^\/]+\/@[^\/]+/}
              placeholder="https://mastodon.social/@alex.doe"
              title="Your Mastodon profile"
            />
            <ProfileURL
              key="linkedin"
              pattern={/^https:\/\/www\.linkedin\.com\/in\/[^\/]+/}
              placeholder="https://www.linkedin.com/in/alex.doe"
              title="Your LinkedIn profile"
            />
            <ProfileURL
              key="matrix"
              pattern={/^https:\/\/matrix.to\/#\/@[^\/:]+:[^\/]/}
              placeholder="https://matrix.to/#/@alex.doe:matrix.im"
              title="Your Matrix profile"
            />
            <ProfileURL
              key="github"
              pattern={/^https:\/\/github\.com\/[^\/]+/}
              placeholder="https://github.com/alex.doe"
              title="Your GitHub profile"
            />
          </form>
        </Show>
      </section>
    </Collapsible>
  );
};

const ProfileURL = (props: {
  key: keyof Registration;
  pattern: RegExp;
  placeholder: string;
  title: string;
}) => {
  const { update, registration } = useRegistration();
  return (
    <div class="mb-3">
      <label for={props.key} class="form-label">
        {props.title}
      </label>
      <input
        type="text"
        class="form-control"
        id={props.key}
        placeholder={`e.g. "${props.placeholder}"`}
        minLength={1}
        pattern={props.pattern.toString()}
        value={registration[props.key]?.toString() ?? ""}
        onBlur={(e) => {
          try {
            const u = new URL(e.target.value);
            if (!props.pattern.test(u.toString()))
              throw new Error(
                `URL ${u.toString()} does not match pattern ${props.pattern.toString()}`
              );
            update(props.key, u);
          } catch (err) {
            console.error(`[ProfileURL:${props.key}]`, err);
          }
        }}
      />
    </div>
  );
};

const NoProfileCheckBox = () => {
  const { registration, update } = useRegistration();

  return (
    <div class="form-check mb-3">
      <input
        class="form-check-input"
        type="checkbox"
        id="noProfile"
        checked={!registration.publicProfile}
        onChange={(e) => {
          update("publicProfile", !registration.publicProfile);
        }}
      />
      <label class="form-check-label" for="noProfile">
        I prefer not to have a public profile on codefreeze.fi
      </label>
    </div>
  );
};
