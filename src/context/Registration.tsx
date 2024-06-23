import type { ParentProps } from "solid-js";
import { createContext, useContext } from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";

export type Registration = {
  codeOfConductAccepted?: boolean;
  codeOfConductInformTravelParty?: boolean;
  publicProfile?: boolean;
  email?: string;
  code?: string;
  emailVerified?: boolean;
  name?: string;
  pronouns?: string;
  photo?: URL;
  homepage?: URL;
  mastodon?: URL;
  linkedin?: URL;
  matrix?: URL;
  github?: URL;
  // The ID this registration has received from the server
  id?: string;
};

export const Provider = (props: ParentProps) => {
  const [registration, updateRegistration] = createStore<Registration>({});
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
  registration: {},
  update: () => undefined,
});

export const useRegistration = () => useContext(Context);
