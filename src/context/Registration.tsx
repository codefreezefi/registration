import type { ParentProps } from "solid-js";
import { createContext, useContext } from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";

export type Registration = {
  codeOfConductAccepted: boolean;
  codeOfConductInformTravelParty: boolean;
  publicProfile: boolean;
  email: string | null;
  emailVerified: boolean;
  registered: boolean;
  name: string | null;
  pronouns: string | null;
  photo: URL | null;
  homepage: URL | null;
  mastodon: URL | null;
  linkedin: URL | null;
  matrix: URL | null;
  github: URL | null;
};

const defaultRegistration: Registration = {
  codeOfConductAccepted: false,
  codeOfConductInformTravelParty: false,
  publicProfile: true,
  email: null,
  emailVerified: false,
  registered: false,
  name: null,
  pronouns: null,
  photo: null,
  homepage: null,
  mastodon: null,
  linkedin: null,
  matrix: null,
  github: null,
};

const markus: Registration = {
  codeOfConductAccepted: true,
  codeOfConductInformTravelParty: true,
  publicProfile: true,
  email: "m@coderbyheart.com",
  emailVerified: true,
  registered: false,
  name: "Markus Tacker",
  pronouns: "he/him",
  photo: new URL(
    "https://images.ctfassets.net/bncv3c2gt878/18M7LZPr4Dah1nSJagy6bk/09d2f6f4f373d983d0214ecd896bd89f/Me_2022-08?w=300&fm=webp"
  ),
  homepage: new URL("https://coderbyheart.com/"),
  mastodon: new URL("https://chaos.social/@coderbyheart"),
  linkedin: new URL("https://www.linkedin.com/in/markustacker"),
  matrix: new URL("https://matrix.to/#/@coderbyheart:matrix.im"),
  github: new URL("https://github.com/coderbyheart"),
};

export const Provider = (props: ParentProps) => {
  const [registration, updateRegistration] = createStore<Registration>(markus);
  return (
    <Context.Provider
      value={{
        registration,
        update: updateRegistration,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export const Context = createContext<{
  registration: Registration;
  update: SetStoreFunction<Registration>;
}>({
  registration: defaultRegistration,
  update: () => undefined,
});

export const useRegistration = () => useContext(Context);
