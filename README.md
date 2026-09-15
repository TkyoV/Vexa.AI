# Vexa Web Prototype V1

**Mr. Hazil's Personal AI Assistant**

## Run it
1. Extract the ZIP.
2. Open `index.html` in a modern browser.
3. Allow microphone permission if the browser asks.
4. Try the quick buttons or type a message.

## What is included
- Futuristic red holographic Vexa interface
- Responsive mobile layout
- Text chat prototype
- Browser speech recognition when supported
- Browser text-to-speech
- English voice input by default
- Local demo responses

## Important
This V1 does **not** contain a real AI API, phone-number calling, call forwarding, or Android app control yet. Those require a secure backend and explicit device/telephony permissions.

## Planned architecture
Web UI -> Vexa backend -> AI model -> voice service -> Android app / telephony agent

Never put a private AI API key directly into `app.js` or any browser-delivered file.


## Connect the real AI brain

This version uses a small Node.js backend so the API key is **not exposed in browser code**.

### 1. Install Node.js
Install a current Node.js LTS release on the computer where you will run Vexa.

### 2. Start the backend
Open a terminal inside the `server` folder and run:

```bash
npm install
```

Copy `.env.example` to `.env`, then put your own OpenAI API key in `.env`:

```text
OPENAI_API_KEY=your_key_here
```

Then run:

```bash
npm start
```

The server should report:

`Vexa AI server running on http://localhost:3000`

### 3. Open Vexa
Open the project's `index.html` in your browser and send a message.

The browser calls `/api/chat`, and the server calls the OpenAI Responses API.

### Security
Never put your API key in `app.js`, `index.html`, or any file served directly to users.
For a public deployment, add authentication, rate limits, usage limits, and HTTPS.
