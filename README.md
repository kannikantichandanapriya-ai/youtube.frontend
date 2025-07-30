# 🎥 YouTube Transcript Summarizer (Frontend)

This is a **Next.js 14 (App Router)** frontend application for summarizing YouTube videos. Users can input a YouTube link along with a custom prompt (e.g., time range or desired summary type), and receive a structured summary powered by an AI backend.

The backend, built with FastAPI + CrewAI + OpenAI (GPT-4o), handles transcript extraction, parsing, and summarization.

---

## 🚀 Features

- 🔗 Input a YouTube URL and a summarization prompt
- 📄 View the full transcript of the video (retrieved via backend)
- ✨ Get AI-generated summaries based on the prompt
- 🧠 Powered by GPT-4o (via FastAPI backend)
- ⚙️ Uses React Server Components and App Router
- 🌐 Fully responsive UI with **Tailwind CSS**
- ☁️ Easily deployable on Vercel, Cloud Run, or any platform

---

## 🧰 Technologies Used

| Tech             | Purpose                                  |
|------------------|------------------------------------------|
| **Next.js 14**   | React-based frontend framework           |
| **TypeScript**   | Static typing for JavaScript             |
| **Tailwind CSS** | Utility-first styling                    |
| **Axios**        | API communication with the backend       |
| **Lucide Icons** | Elegant and minimal icons                |
| **Framer Motion**| Smooth animations and transitions        |

---

📁 File Structure Overview
.
├── app/                # App router pages
│   └── page.tsx        # Main component logic
├── components/         # Reusable UI components
├── lib/                # Axios instance and helpers
├── public/             # Static assets
├── styles/             # Tailwind styles
├── tailwind.config.ts  # Tailwind configuration
└── tsconfig.json       # TypeScript config


