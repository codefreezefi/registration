import { useRegistration, type Registration } from "../context/Registration.js";
import { Show, createSignal, createResource, createEffect } from "solid-js";
import { Progress } from "./Progress.js";

export const register = async (
  registration: Registration
): Promise<
  { success: false; id: undefined } | { success: true; id: string }
> => {
  const res = await fetch(REGISTER_API, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(registration),
  });
  if (!res.ok) {
    console.error(await res.text());
    return {
      success: false,
      id: undefined,
    };
  }
  return {
    success: true,
    id: (await res.json()).id,
  };
};

export const Submit = () => {
  const { registration, update } = useRegistration();
  const isValidName = () => (registration.name?.length ?? 0) > 0;
  const isValidEmail = () => registration.emailVerified === true;
  const isCodeOfConductAccepted = () =>
    registration.codeOfConductAccepted === true &&
    registration.codeOfConductInformTravelParty === true;
  const isValid = () =>
    [isValidName(), isValidEmail(), isCodeOfConductAccepted()].reduce(
      (allValid, v) => (v === false ? false : allValid),
      true
    );
  const [registrationData, submitRegistration] = createSignal<Registration>();
  const [submittedRegistration] = createResource(registrationData, register);

  createEffect(() => {
    const id = submittedRegistration()?.id;
    if (id !== undefined) {
      update("id", id);
    }
  });

  return (
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Submit your registration</h2>
      </div>
      <div class="card-body">
        <Show
          when={isValid()}
          fallback={
            <>
              <p>Please complete the registration first!</p>
              <ol>
                <Show when={!isCodeOfConductAccepted()}>
                  <li>
                    <a href="#code-of-conduct">
                      Please accept our Code of Conduct!
                    </a>
                  </li>
                </Show>
                <Show when={!isValidName()}>
                  <li>
                    <a href="#details">Please provide your name!</a>
                  </li>
                </Show>
                <Show when={!isValidEmail()}>
                  <li>
                    <a href="#email">Please verify your email!</a>
                  </li>
                </Show>
              </ol>
            </>
          }
        >
          <p>
            You are now ready to submit your application. If you change your
            mind later, just contact us.
          </p>
        </Show>
        <Show when={submittedRegistration.loading}>
          <Progress title="Submitting registration..." />
        </Show>
      </div>
      <div class="card-footer">
        <button
          type="button"
          class="btn btn-primary"
          disabled={!isValid()}
          onClick={() => submitRegistration({ ...registration })}
        >
          submit
        </button>
      </div>
    </div>
  );
};
