import { Collapsible } from "../Collapsible.js";
import { useRegistration } from "../context/Registration.js";

export const CodeOfConduct = () => {
  const { registration, update } = useRegistration();

  return (
    <Collapsible
      title="Code of Conduct"
      ok={
        registration.codeOfConductAccepted &&
        registration.codeOfConductInformTravelParty
      }
    >
      <p>
        Please review our{" "}
        <a href="https://codefreeze.fi/#code-of-conduct" target="_blank">
          Code of Conduct
        </a>{" "}
        carefully and confirm the following:
      </p>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="acceptCodeOfConduct"
          checked={registration.codeOfConductAccepted ?? false}
          onChange={(e) => {
            update("codeOfConductAccepted", e.currentTarget.checked);
          }}
        />
        <label class="form-check-label" for="acceptCodeOfConduct">
          I have read and accept Codefreeze's Code of Conduct.
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="educateTravelParty"
          checked={registration.codeOfConductInformTravelParty ?? false}
          onChange={(e) => {
            update("codeOfConductInformTravelParty", e.currentTarget.checked);
          }}
        />
        <label class="form-check-label" for="educateTravelParty">
          I will make sure to educate the people who are traveling with me about
          the Code of Conduct.
        </label>
      </div>
    </Collapsible>
  );
};
