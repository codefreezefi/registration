import type { ParentProps } from "solid-js";
import { createContext, useContext } from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";

type Registration = {
  codeOfConductAccepted: boolean;
  codeOfConductInformTravelParty: boolean;
  publicProfile: boolean;
  email: string | null;
  emailVerified: boolean;
  registered: boolean;
  name: string | null;
  pronouns: string | null;
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
};

export const Provider = (props: ParentProps) => {
  const [registration, updateRegistration] =
    createStore<Registration>(defaultRegistration);
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
