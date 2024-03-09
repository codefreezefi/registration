import { CodeOfConduct } from "./CodeOfConduct";
import { EmailVerification } from "./EmailVerification";
import { createSignal, Show } from "solid-js";
import { Profile, type ParticipantInfo } from "./Profile";

export const Registration = () => {
  const [emailVerified, setEmailVerified] = createSignal<boolean>();
  const [codeOfConductAccepted, setCodeOfConductAccepted] =
    createSignal<boolean>();
  const [profile, setProfile] = createSignal<ParticipantInfo | false>();
  return (
    <div class="container">
      <div class="row">
        <aside class="col"></aside>
        <main class="col col-10 col-lg-8">
          <div class="card">
            <div class="card-header">
              <h1>Codefreeze Registration</h1>
            </div>
            <div class="card-body">
              <EmailVerification onVerified={setEmailVerified} />
              <Show when={emailVerified() && !codeOfConductAccepted()}>
                <hr />
                <CodeOfConduct onConfirm={setCodeOfConductAccepted} />
              </Show>
              <Show when={codeOfConductAccepted()}>
                <CodeOfConduct onConfirm={setCodeOfConductAccepted} />
              </Show>
              <Show
                when={
                  emailVerified() &&
                  codeOfConductAccepted() &&
                  profile() === undefined
                }
              >
                <hr />
                <Profile profile={profile} onProfile={setProfile} />
              </Show>
              <Show when={profile() !== undefined}>
                <Profile
                  profile={profile}
                  onProfile={(v) => {
                    console.log({ v });
                    setProfile(v);
                  }}
                />
              </Show>
              <Show when={profile() !== undefined}>
                <hr />
                Submit
              </Show>
            </div>
          </div>
        </main>
        <aside class="col"></aside>
      </div>
    </div>
  );
};
