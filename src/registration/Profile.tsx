import { Show } from "solid-js";
import { useRegistration } from "../context/Registration";

export const PublicProfile = () => {
  const { registration, update } = useRegistration();

  return (
    <section class="mt-4">
      <h2>Your Profile</h2>
      <p>
        Codefreeze is an Unconference which means we do not have a traditional
        conference program with speaker profiles.
      </p>
      <p>
        Therefore we list participants' profiles on{" "}
        <a
          href="https://codefreeze.fi/"
          target="_blank"
          rel="noreferrer noopener friend"
        >
          codefreeze.fi
        </a>{" "}
        so new attendees can get an impression of who to meet.
      </p>
      <p>Please help us by providing some information about yourself below.</p>
      <NoProfileCheckBox />
      <Show when={registration.publicProfile}>Profile form goes here</Show>
    </section>
  );
};

const NoProfileCheckBox = () => {
  const { registration, update } = useRegistration();

  return (
    <div class="form-check">
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
