import { useRegistration } from "../context/Registration";

const isValidName = (v?: string): v is string => /^.+$/.test(v ?? "");

export const Name = () => {
  const { update } = useRegistration();

  return (
    <>
      <div class="mb-3">
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
          placeholder="Alex Doe"
          minLength={1}
          required
          onBlur={(e) => {
            const name = e.target.value;
            if (isValidName(name)) {
              update("name", name);
            }
          }}
        />
      </div>
      <div class="mb-3">
        <label for="pronouns" class="form-label">
          Your pronouns
        </label>
        <input
          type="text"
          class="form-control"
          id="pronouns"
          placeholder="they/them"
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
