import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { authFetch } from "../network"

export const useAnswerMutation = (opts: UseMutationOptions<any, any, any, any>) => {
    const { data, error, mutateAsync } = useMutation(["user_onboarding_answer"], async (answer: any) => {
        return authFetch("user-onboarding-answers", {
            method: "POST",
            body: { data: answer } as any,
        })
    }, opts)

    return {
        data, error, mutateAsync
    }
}