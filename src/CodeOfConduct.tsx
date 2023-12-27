import { createSignal, createEffect } from "solid-js";

export const CodeOfConduct = ({
  onConfirm,
}: {
  onConfirm: (confirmed: boolean) => unknown;
}) => {
  const [acceptCodeOfConduct, setAcceptCodeOfConduct] =
    createSignal<boolean>(false);
  const [educateTravelParty, setEducateTravelParty] =
    createSignal<boolean>(false);

  createEffect(() => {
    onConfirm(acceptCodeOfConduct() && educateTravelParty());
  });
  return (
    <article>
      <h1>Code of Conduct</h1>
      <p>
        Thank you for registering for Codefreeze. Before you continue, please
        review our{" "}
        <a href="https://codefreeze.fi/#code-of-conduct" target="_blank">
          Code of Conduct
        </a>{" "}
        carefully.
      </p>
      <p>Please confirm:</p>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="acceptCodeOfConduct"
          checked={acceptCodeOfConduct()}
          onChange={(e) => setAcceptCodeOfConduct(e.currentTarget.checked)}
        />
        <label class="form-check-label" for="acceptCodeOfConduct">
          I have read and accept the Code of Conduct.
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="educateTravelParty"
          checked={educateTravelParty()}
          onChange={(e) => setEducateTravelParty(e.currentTarget.checked)}
        />
        <label class="form-check-label" for="educateTravelParty">
          I will make sure to educate the people who are traveling with me about
          the Code of Conduct.
        </label>
      </div>
    </article>
  );
};
