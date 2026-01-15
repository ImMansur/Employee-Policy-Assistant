# 🏢 Employee Policy Assistant

*A Retrieval-Augmented Generation (RAG) web application for internal employee policy queries using Azure AI.*

A **Next.js-based application** that allows employees to ask questions about **company policies** and receive accurate, grounded answers using **Azure OpenAI** and **Azure AI Search**.

---

## 🌐 Live Demo

🔗 **[https://employee-policy-assistant.vercel.app/](https://employee-policy-assistant.vercel.app/)**

> ⚠️ Demo uses limited sample policy data and is for **demonstration purposes only**.

---

## 🚀 Features

* Ask questions about **employee policies & handbook rules**
* Retrieval-Augmented Generation (RAG) using **Azure AI Search**
* Responses generated using **Azure OpenAI**
* Policy answers grounded strictly in indexed documents
* Common question shortcuts (Working hours, Remote work, Leave policy)
* Modern, clean UI built with **Next.js (App Router)**
* Secure, environment-variable based configuration
* Server-side API routes for secure Azure access

---

## 🛠️ Tech Stack

* **Next.js (App Router)**
* **TypeScript**
* **Azure OpenAI**
* **Azure AI Search**
* **Azure Blob Storage**
* **Node.js**

---

## 🧩 Project Structure

```text
├── app/                # Next.js app router
│   ├── api/            # Server-side API routes (Azure calls)
│   └── page.tsx        # Main UI page
├── components/         # UI components
├── hooks/              # Custom React hooks
├── lib/                # Azure & helper utilities
├── public/             # Static assets
├── styles/             # Global styles
├── .env                # Environment variables (not committed)
├── package.json
├── next.config.mjs
└── tsconfig.json
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# Storage
AZURE_STORAGE_ACCOUNT_URL=https://<storage-account>.blob.core.windows.net
BLOB_CONTAINER_NAME=<container-name>

# Azure AI Search
AZURE_SEARCH_ENDPOINT=https://<search-service>.search.windows.net
AZURE_SEARCH_INDEX_NAME=<index-name>
AZURE_SEARCH_API_KEY=<search-api-key>

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://<resource-name>.openai.azure.com/
AZURE_OPENAI_API_KEY=<openai-api-key>
AZURE_OPENAI_DEPLOYMENT_NAME=<deployment-name>
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

---

## ▶️ Run the Application Locally

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Start development server

```bash
npm run dev
```

### 3️⃣ Open in browser

```
http://localhost:3000
```

---

## 💡 Example Questions

* What are the official working hours?
* What is the remote or hybrid work policy?
* What leave options are available?
* What is the company attendance policy?

---

## 🧠 How It Works (RAG Flow)

1. User submits a policy-related question from the UI
2. Server-side API route queries **Azure AI Search**
3. Relevant policy documents are retrieved
4. **Azure OpenAI** generates an answer strictly from retrieved content
5. Response is returned and displayed in the chat interface

---

## 🔒 Security & Compliance

* Azure credentials are used **only on the server**
* No API keys exposed to the client
* Answers are grounded in indexed policy documents
* If information is unavailable, the assistant responds appropriately
* Designed for **internal organizational use**

---

## ✏️ Customization

* **Add / Modify Common Questions**
  Update the UI components to include additional shortcuts.

* **Change Policy Scope**
  Modify Azure Search index or filtering logic.

* **Multi-Employee Support**
  Add authentication and user-based document filtering.

---

## 🌐 Azure Services Used

* Azure AI Search
* Azure OpenAI
* Azure Blob Storage

---

## 👤 Author

**Mansur**
GitHub: [https://github.com/ImMansur](https://github.com/ImMansur)

---
