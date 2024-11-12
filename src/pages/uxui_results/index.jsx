// components/Results/Results.js
import { useRouter } from "next/router";
import Result from "@/components/Result_uxui/Result";
import Head from "next/head";
import Header from "@/components/Header/Header";
import Background from "@/components/Background_uxui/Background_uxui";

const Results = () => {
    const router = useRouter();
    const { score } = router.query;

    const getFeedbackMessage = (score) => {
        if (score <= 1) {
            return "Вы набрали 1 балл — это плохо.";
        } else if (score == 6) {
            return "Вы набрали 6 баллов — это круто!";
        } else {
            return `Ваш результат: ${score} баллов. Вы молодец!`;
        }
    };

    return (
        <>
            <Head>
                <title>Результаты вашего теста</title>
            </Head>
            <Header />
            <Background />
            <div style={{ textAlign: "center" }}>
                {score !== null && (
                    <div>
                        <Result score={score} />
                    </div>
                )}
            </div>
        </>
    );
};

export default Results;
