
import useToast from "./toast/use-toast";
import { useActionState, useEffect } from "react";

type State = { message: string, ok: boolean };

export default function useFormStateWithToast<TPayload>(
  action: (state: Awaited<State>, payload: TPayload) => State | Promise<State>,
  initState: State = { message: "", ok: true } as State
) {
  const [state, formAction] = useActionState(action, initState);
  const { showToast } = useToast();
  useEffect(() => {
    if (state?.message) {
      showToast(state.message, !state.ok);
    }
  }, [state]);
  return [formAction, state] as const
}
