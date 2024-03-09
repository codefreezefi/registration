import { createSignal, createEffect } from "solid-js";

export type ParticipantInfo = { name: string };

const noProfileMemo = {
  isChecked: () => localStorage.getItem("noProfile") !== null,
  check: () => localStorage.setItem("noProfile", "1"),
  uncheck: () => localStorage.removeItem("noProfile"),
};

export const Profile = ({
  profile,
  onProfile,
}: {
  profile: () => undefined | false | ParticipantInfo;
  onProfile: (profile: undefined | false | ParticipantInfo) => unknown;
}) => {
  if (profile?.() === false)
    return (
      <p class="d-flex justify-content-between">
        <span>
          You do not want a public profile on{" "}
          <a
            href="https://codefreeze.fi/"
            target="_blank"
            rel="noreferrer noopener friend"
          >
            codefreeze.fi
          </a>
          .
        </span>
        <button
          type="button"
          class="btn btn-sm btn-outline-warning"
          onClick={() => {
            onProfile(undefined);
          }}
        >
          change
        </button>
      </p>
    );

  return (
    <article>
      <h1>Your Profile</h1>
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
      <NoProfileCheckBox
        checked={profile?.() === false}
        onNoProfile={(noProfile) => {
          onProfile(noProfile ? false : undefined);
        }}
      />
    </article>
  );
};

const NoProfileCheckBox = ({
  onNoProfile,
  checked,
}: {
  onNoProfile: (noProfile: boolean) => unknown;
  checked: boolean;
}) => {
  const [noProfile, setNoProfile] = createSignal<boolean>(
    checked || noProfileMemo.isChecked()
  );
  createEffect(() => {
    if (noProfile() === true) {
      onNoProfile(true);
    }
  });

  return (
    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        id="noProfile"
        checked={noProfile()}
        onChange={(e) => {
          const checked = e.currentTarget.checked;
          setNoProfile(checked);
          if (checked) {
            noProfileMemo.check();
          } else noProfileMemo.uncheck();
          onNoProfile(checked);
        }}
      />
      <label class="form-check-label" for="noProfile">
        I prefer not to have a public profile on codefreeze.fi
      </label>
    </div>
  );
};
