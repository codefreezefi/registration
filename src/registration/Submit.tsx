import { useRegistration, type Registration } from "../context/Registration.js";
import { Show, createSignal, createResource, createEffect } from "solid-js";
import { generateCode } from "./code.js";
import { Progress } from "./Progress.js";

export const register = async (
  registration: Registration
): Promise<{ id: string }> => {
  await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  try {
    return { id: generateCode() };
  } catch (err) {
    console.error(err);
    throw Error("Fail!");
  }
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
    if (submittedRegistration()?.id !== undefined) {
      update("id", submittedRegistration()!.id);
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
          onClick={() => submitRegistration(registration)}
        >
          submit
        </button>
      </div>
    </div>
  );
};
