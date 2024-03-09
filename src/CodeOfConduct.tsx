import { createSignal, createEffect } from "solid-js";

const travelPartyMemo = {
  isChecked: () => localStorage.getItem("travelPartyChecked") !== null,
  check: () => localStorage.setItem("travelPartyChecked", "1"),
};

const codeOfConductMemo = {
  isChecked: () => localStorage.getItem("codeOfConductChecked") !== null,
  check: () => localStorage.setItem("codeOfConductChecked", "1"),
};

export const CodeOfConduct = ({
  onConfirm,
}: {
  onConfirm: (confirmed: boolean) => unknown;
}) => {
  const [acceptCodeOfConduct, setAcceptCodeOfConduct] = createSignal<boolean>(
    codeOfConductMemo.isChecked()
  );
  const [educateTravelParty, setEducateTravelParty] = createSignal<boolean>(
    travelPartyMemo.isChecked()
  );

  createEffect(() => {
    onConfirm(acceptCodeOfConduct() && educateTravelParty());
  });

  if (acceptCodeOfConduct() && educateTravelParty())
    return (
      <p>
        You have accepted our{" "}
        <a href="https://codefreeze.fi/#code-of-conduct" target="_blank">
          Code of Conduct
        </a>
        .
      </p>
    );
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
          onChange={(e) => {
            setAcceptCodeOfConduct(e.currentTarget.checked);
            codeOfConductMemo.check();
          }}
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
          onChange={(e) => {
            setEducateTravelParty(e.currentTarget.checked);
            travelPartyMemo.check();
          }}
        />
        <label class="form-check-label" for="educateTravelParty">
          I will make sure to educate the people who are traveling with me about
          the Code of Conduct.
        </label>
      </div>
    </article>
  );
};
