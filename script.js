// FILE NAME: script.js

// ================================
// VAPI IMPORT
// ================================
import Vapi from "https://esm.sh/@vapi-ai/web";

// ================================
// KEEP SAME API KEY / ID
// ================================
const VAPI_PUBLIC_KEY = "d648daaf-46d7-4e71-961a-2514abe29941";
const ASSISTANT_ID = "69f60474-e400-4f64-8ddd-024cd110214b";

// ================================
// INIT VAPI
// ================================
const vapi = new Vapi(VAPI_PUBLIC_KEY);

// ================================
// PAGE DETECT
// ================================
const currentPage = window.location.pathname;

// ================================
// VOICE PAGE LOGIC
// ================================
const vapiBtn = document.getElementById("vapi-btn");
const stopBtn = document.getElementById("stop-btn");
const statusText = document.getElementById("status-text");
const micContainer = document.getElementById("mic-container");

const subject = document.getElementById("subject");
const difficulty = document.getElementById("difficulty");

let isCallActive = false;

// Start Viva
if (vapiBtn) {

    vapiBtn.addEventListener("click", async () => {

        if (isCallActive) return;

        const selectedSubject = subject ? subject.value : "General";
        const selectedDifficulty = difficulty ? difficulty.value : "Beginner";

        statusText.innerText =
            `Connecting for ${selectedSubject} (${selectedDifficulty})...`;

        vapiBtn.innerText = "Connecting...";
        vapiBtn.disabled = true;

        try {
            await vapi.start(ASSISTANT_ID);
        } catch (error) {

            console.error(error);

            statusText.innerText = "Connection failed.";
            vapiBtn.innerText = "Start Viva";
            vapiBtn.disabled = false;
        }

    });

}

// Stop Viva
if (stopBtn) {

    stopBtn.addEventListener("click", () => {

        if (isCallActive) {
            vapi.stop();
        }

    });

}

// Call Start
vapi.on("call-start", () => {

    isCallActive = true;

    if (statusText) {
        statusText.innerText =
            "Assistant is listening... Start speaking 🎤";
    }

    if (vapiBtn) {
        vapiBtn.innerText = "Running...";
        vapiBtn.disabled = true;
    }

    if (micContainer) {
        micContainer.classList.add("pulse-animation");
    }

});

// Call End
vapi.on("call-end", () => {

    isCallActive = false;

    if (statusText) {
        statusText.innerText =
            "Session ended. Start again anytime.";
    }

    if (vapiBtn) {
        vapiBtn.innerText = "Start Viva";
        vapiBtn.disabled = false;
    }

    if (micContainer) {
        micContainer.classList.remove("pulse-animation");
    }

});

// Error
vapi.on("error", (error) => {

    console.error("Vapi Error:", error);

    isCallActive = false;

    if (statusText) {
        statusText.innerText = "Something went wrong.";
    }

    if (vapiBtn) {
        vapiBtn.innerText = "Start Viva";
        vapiBtn.disabled = false;
    }

    if (micContainer) {
        micContainer.classList.remove("pulse-animation");
    }

});

// ================================
// TEXT PAGE LOGIC
// ================================
const topicInput = document.getElementById("topicInput");
const startChatBtn = document.getElementById("startChatBtn");
const chatBox = document.getElementById("chatBox");
const userMessage = document.getElementById("userMessage");
const sendBtn = document.getElementById("sendBtn");

let currentTopic = "";

// Add Chat Message
function addMessage(text, sender = "bot") {

    if (!chatBox) return;

    const div = document.createElement("div");

    div.className =
        sender === "user"
            ? "user-message"
            : "bot-message";

    div.innerText = text;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Start Practice
if (startChatBtn) {

    startChatBtn.addEventListener("click", () => {

        const topic = topicInput.value.trim();

        if (!topic) {
            addMessage("Please enter a topic first.");
            return;
        }

        currentTopic = topic;

        chatBox.innerHTML = "";

        addMessage(
            `Great! Starting viva practice for ${topic}.`
        );

        addMessage(
            `Question 1: Explain ${topic} in simple words.`
        );

    });

}

// Send User Answer
function sendMessage() {

    const text = userMessage.value.trim();

    if (!text) return;

    addMessage(text, "user");

    userMessage.value = "";

    setTimeout(() => {

        addMessage(
            `Good answer. Next question: Explain one important concept of ${currentTopic || "this topic"}.`
        );

    }, 700);

}

// Send Button
if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
}

// Enter Key
if (userMessage) {

    userMessage.addEventListener("keypress", (e) => {

        if (e.key === "Enter") {
            sendMessage();
        }

    });

}

// ================================
// READY
// ================================
console.log("Smart Viva AI Loaded");