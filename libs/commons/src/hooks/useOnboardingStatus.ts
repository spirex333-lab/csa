import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { authFetch } from "../network"

export const useOnboardingStatus = () => {
    const [status, setStatus] = useState<"pending" | "done" | undefined>();
    const uoaResp = useQuery(["user-onboarding-answers"], async () => {
        return await authFetch("user-onboarding-answers/fetch")
    }, { refetchOnWindowFocus: false })
    const uoqResp = useQuery(["user-onboarding-questions"], async () => {
        return await authFetch("user-onboarding-questions?populate=options&filters[active][$eq]=true")
    }, { refetchOnWindowFocus: false })

    const { data } = uoaResp?.data ?? {}
    const { data: questions } = uoqResp?.data ?? {}
    const answers = data?.[0] ?? []

    useEffect(() => {
        if (answers && questions && questions.length) {
            if (answers.length < questions.length) {
                setStatus("pending")
            } else {
                setStatus("done")
            }
        }
    }, [answers, questions])

    const refetch = async () => {
        console.log("ref")
        uoqResp.refetch()
        uoaResp.refetch()
    }

    const unansweredQuestions = questions?.filter((q: any) => !answers?.find((a: any) => a?.user_onboarding_question?.id === q?.id))

    return {
        status,
        questions,
        answers,
        unansweredQuestions,
        refetchQuestions: uoqResp.refetch,
        refetchAnswers: uoaResp.refetch,
        refetch
    }
}