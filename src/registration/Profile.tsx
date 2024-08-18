import { Show, createSignal, batch } from "solid-js";
import { useRegistration, type Registration } from "../context/Registration.js";
import { Collapsible } from "../Collapsible.js";

export const PublicProfile = () => {
  const { registration } = useRegistration();

  return (
    <Collapsible title="Your Profile">
      <p>Please help us by providing some information about yourself below.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <NoProfileCheckBox />
        <Show when={registration.publicProfile !== false}>
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
        </Show>
      </form>
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
  const [error, setError] = createSignal<Error>();
  return (
    <div class="form-row mb-lg-3">
      <label for={props.key} class="form-label mb-0 mb-lg-1">
        {props.title}
      </label>
      <div>
        <input
          type="text"
          class={`form-control ${error() !== undefined ? "is-invalid" : ""}`}
          aria-describedby={error() !== undefined ? `validate${props.key}` : ""}
          id={props.key}
          placeholder={`e.g. "${props.placeholder}"`}
          minLength={1}
          pattern={props.pattern.toString()}
          value={registration[props.key]?.toString() ?? ""}
          onBlur={(e) => {
            if (e.target.value.length === 0) return;
            try {
              const u = new URL(e.target.value);
              if (!props.pattern.test(u.toString())) {
                throw new Error(
                  `URL ${u.toString()} does not match pattern ${props.pattern.toString()}`,
                );
              }
              batch(() => {
                update(props.key, u);
                setError(undefined);
              });
            } catch (err) {
              console.error(`[ProfileURL:${props.key}]`, err);
              setError(err as Error);
            }
          }}
        />
        <Show when={error() !== undefined}>
          <span id={`validate${props.key}`} class="invalid-feedback">
            {error()!.message}
          </span>
        </Show>
      </div>
    </div>
  );
};

const NoProfileCheckBox = () => {
  const { registration, update } = useRegistration();

  return (
    <div class="form-check mb-lg-3">
      <input
        class="form-check-input"
        type="checkbox"
        id="noProfile"
        checked={registration.publicProfile === false}
        onChange={(e) => {
          update("publicProfile", !(registration.publicProfile ?? true));
        }}
      />
      <label class="form-check-label" for="noProfile">
        I prefer not to have a public profile on codefreeze.fi
      </label>
    </div>
  );
};
