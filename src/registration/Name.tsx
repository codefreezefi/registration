import { useRegistration } from "../context/Registration";

const isValidName = (v?: string): v is string => /^.+$/.test(v ?? "");

export const Name = () => {
  const { update, registration } = useRegistration();

  return (
    <>
      <div class="form-row mb-3">
        <label for="name" class="form-label">
          Your name{" "}
          <abbr title="required">
            <small>*</small>
          </abbr>
        </label>
        <input
          type="text"
          class="form-control"
          id="name"
          placeholder='e.g. "Alex Doe"'
          minLength={1}
          required
          value={registration.name ?? ""}
          onBlur={(e) => {
            const name = e.target.value;
            if (isValidName(name)) {
              update("name", name);
            }
          }}
        />
      </div>
      <div class="form-row mb-3">
        <label for="pronouns" class="form-label">
          Your pronouns
        </label>
        <input
          type="text"
          class="form-control"
          id="pronouns"
          placeholder='e.g. "they/them"'
          value={registration.pronouns ?? ""}
          onBlur={(e) => {
            const pronouns = e.target.value;
            if (isValidName(pronouns)) {
              update("pronouns", pronouns);
            }
          }}
        />
      </div>
    </>
  );
};
