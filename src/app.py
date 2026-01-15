import os
import streamlit as st
from dotenv import load_dotenv

# Azure SDKs
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from openai import AzureOpenAI

# -------------------------------------------------------------------------
# PAGE CONFIG
# -------------------------------------------------------------------------

st.set_page_config(
    page_title="Lara Tech Consulting | Employee Policy Assistant",
    page_icon="🏢",
    layout="centered"
)

# Load environment variables
load_dotenv()

# -------------------------------------------------------------------------
# INTERNAL USER CONTEXT
# -------------------------------------------------------------------------

EMPLOYEE_NAME = "Mansur"
EMPLOYEE_FOLDER = "mansur"

# -------------------------------------------------------------------------
# AZURE CONFIGURATION
# -------------------------------------------------------------------------

STORAGE_ACCOUNT_URL = os.getenv("AZURE_STORAGE_ACCOUNT_URL")
CONTAINER_NAME = os.getenv("BLOB_CONTAINER_NAME")

SEARCH_ENDPOINT = os.getenv("AZURE_SEARCH_ENDPOINT")
SEARCH_INDEX_NAME = os.getenv("AZURE_SEARCH_INDEX_NAME")
SEARCH_API_KEY = os.getenv("AZURE_SEARCH_API_KEY")

OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")

# -------------------------------------------------------------------------
# SIDEBAR
# -------------------------------------------------------------------------

with st.sidebar:
    st.markdown("## 🏢 Lara Tech Consulting")
    st.markdown("**Employee Policy Assistant**")
    st.markdown("---")
    st.info(f"👤 Employee: **{EMPLOYEE_NAME}**")

    st.markdown(
        """
        ### 📘 You can ask about
        - Working hours & shifts  
        - Remote / hybrid work  
        - Leave & holidays  
        - Company policies  
        """
    )

    st.markdown("---")
    st.caption("🔒 Internal use only")

# -------------------------------------------------------------------------
# RAG FUNCTIONS
# -------------------------------------------------------------------------

def search_documents(username: str, query: str, top_k: int = 3):
    try:
        client = SearchClient(
            endpoint=SEARCH_ENDPOINT,
            index_name=SEARCH_INDEX_NAME,
            credential=AzureKeyCredential(SEARCH_API_KEY)
        )

        prefix = f"{STORAGE_ACCOUNT_URL}/{CONTAINER_NAME}/{username}/"
        upper = prefix + "~"

        results = client.search(
            search_text=query,
            filter=(
                f"metadata_storage_path ge '{prefix}' "
                f"and metadata_storage_path lt '{upper}'"
            ),
            select=["content", "metadata_storage_path"],
            top=top_k
        )

        return [
            {"content": r.get("content", ""), "source": r.get("metadata_storage_path", "")}
            for r in results
        ]

    except Exception:
        return []


def generate_rag_answer(question: str, docs: list):
    if not docs:
        return (
            "I’m unable to find relevant information in the Employee Handbook. "
            "Please contact HR for clarification."
        )

    context = "\n\n".join(
        [f"Source: {d['source']}\n{d['content']}" for d in docs]
    )

    client = AzureOpenAI(
        azure_endpoint=OPENAI_ENDPOINT,
        api_key=OPENAI_API_KEY,
        api_version=OPENAI_API_VERSION
    )

    response = client.chat.completions.create(
        model=OPENAI_DEPLOYMENT,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are the official Employee Policy Assistant for Lara Tech Consulting. "
                    "Answer strictly from the Employee Handbook. "
                    "Be professional and concise."
                )
            },
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion:\n{question}"
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content

# -------------------------------------------------------------------------
# SESSION STATE
# -------------------------------------------------------------------------

if "messages" not in st.session_state:
    st.session_state.messages = []

if "greeted" not in st.session_state:
    st.session_state.greeted = False

if "pending_question" not in st.session_state:
    st.session_state.pending_question = None

# -------------------------------------------------------------------------
# GREETING
# -------------------------------------------------------------------------

if not st.session_state.greeted:
    st.session_state.messages.append(
        {
            "role": "assistant",
            "content": f"""
👋 **Welcome, {EMPLOYEE_NAME}**

I’m the **Employee Policy Assistant for Lara Tech Consulting** 🏢  
Ask me anything from the **official Employee Handbook**.

💬 **How may I assist you today?**
"""
        }
    )
    st.session_state.greeted = True

# -------------------------------------------------------------------------
# HANDLE USER QUESTION (STEP 1)
# -------------------------------------------------------------------------

def handle_user_question(question: str):
    st.session_state.messages.append(
        {"role": "user", "content": question}
    )
    st.session_state.pending_question = question
    st.rerun()

# -------------------------------------------------------------------------
# CHAT DISPLAY
# -------------------------------------------------------------------------

with st.container(border=True):
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

# -------------------------------------------------------------------------
# PROCESS PENDING QUESTION (STEP 2)
# -------------------------------------------------------------------------

if st.session_state.pending_question:
    q = st.session_state.pending_question

    with st.spinner("🔍 Searching Employee Handbook..."):
        docs = search_documents(EMPLOYEE_FOLDER, q)
        answer = generate_rag_answer(q, docs)

    st.session_state.messages.append(
        {"role": "assistant", "content": answer}
    )

    st.session_state.pending_question = None
    st.rerun()

# -------------------------------------------------------------------------
# QUICK QUESTIONS
# -------------------------------------------------------------------------

st.markdown("### 💡 Common Questions")

col1, col2, col3 = st.columns(3)

with col1:
    if st.button("🕒 Working hours"):
        handle_user_question("What are the official working hours at Lara Tech Consulting?")

with col2:
    if st.button("🏡 Remote work"):
        handle_user_question("What is the remote or hybrid work policy?")

with col3:
    if st.button("🏖 Leave policy"):
        handle_user_question("What leave options are available to employees?")

# -------------------------------------------------------------------------
# CHAT INPUT
# -------------------------------------------------------------------------

user_input = st.chat_input("Ask a question about company policies...")

if user_input:
    handle_user_question(user_input)

# -------------------------------------------------------------------------
# FOOTER
# -------------------------------------------------------------------------

st.markdown("---")
st.caption("© 2026 Lara Tech Consulting")
