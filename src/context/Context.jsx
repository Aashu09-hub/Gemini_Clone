
import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setResultData(""); // Clear previous result
    };

    const onSent = async (prompt = input) => {
        if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
            console.error(" Error: Input must be a non-empty string.");
            return;
        }

        setResultData("");
        setLoading(true);
        setShowResult(true);

        try {
            setRecentPrompt(prompt);
            if (!prevPrompts.includes(prompt)) {
                setPrevPrompts((prev) => [...prev, prompt]);
            }

            let response = await run(prompt.trim());
            if (!response || typeof response !== "string") {
                throw new Error("Invalid response from API");
            }

            let responseArray = response.split("**");
            let formattedResponse = responseArray
                .map((text, i) => (i % 2 === 1 ? `<b>${text}</b>` : text))
                .join("");

            formattedResponse = formattedResponse.replace(/\*/g, "<br />");
            let wordsArray = formattedResponse.split(" ");

            wordsArray.forEach((word, i) => delayPara(i, word + " "));
        } catch (error) {
            console.error(" Error during API call:", error);
            setResultData("An error occurred while generating content.");
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
    };

    return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
