// Seed LangChain articles part 2 (transcribed from the author's OneNote PDF).
// Safe: upserts by (track, title), never deletes.
// Usage: node scripts/seed-langchain-2.js
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const ARTICLES = [
  {
    name: "Chains",
    title: "Chains: Pipelines, Types & Runnables",
    desc: "What chaining is, why chains exist, the four chain types, and the modern Runnable foundation.",
    tags: ["LangChain", "Chains", "Runnable"],
    exampleImages: [],
    content: `# Chains

Chaining means connecting different components to build complex LLM-powered applications. Each component takes some input, processes it and passes the output to the next component. This helps in building sophisticated and complex applications. **Chains help in building pipelines.**

## Motivating example: English-to-Hindi translator

Say you want to make an English to Hindi translator:

- **Chain 1:** Input → LLM → process the input
- **Chain 2:** processed input → LLM → output

In real life each problem is not just about a single step. We need to process things — in LangChain, **1 process → 1 chain (1 LLM call)**.

## Why do we need Chains?

Before the coding part, the *why* behind using chains in an application:

1. **Simplify Data Flow** — Chains handle how data moves between steps for you, so you don't have to manually wire everything together. This makes code cleaner, easier to understand, and less prone to errors.
2. **Multi-step application logic** — Real-world applications often require multiple LLM calls and various prompt templates to handle complex tasks. Manually managing this gets messy and error-prone; chains organize it into a clear, structured flow.
3. **Scaling Becomes Easier** — Chaining makes each component reusable, so you can switch between models or services without reworking your entire app. For example — switch LLM models from Gemini to OpenAI with a single line of code.

## Types of Chains

We use the **pipe symbol** \`|\` operator: in LangChain it composes components together into clear, readable pipelines. Example — \`prompt | llm | parser\`: the output of \`prompt\` becomes the input to \`llm\`, and the output of \`llm\` becomes the input to \`parser\`.

There are 4 types of chains:

1. **Simple Chain** — only one operation
2. **Sequential Chain** — extension of the simple chain, multiple operations
3. **Parallel Chain**
4. **Conditional Chain**

## Definition

A chain is a way to connect multiple processing steps together so that the **output of one step becomes the input of the next step**.

Without chains you write manual glue code — calling \`.invoke()\` each time and coordinating everything yourself. As the application grows that means lots of glue code, hard-to-read workflows, duplicated logic, harder debugging, difficult composition, streaming, and async execution. LangChain's abstraction makes these operations composable.

## Runnables — the modern foundation

Modern LangChain chains are built on the **Runnable** abstraction: something executable with standardized operations like \`.invoke()\`, \`.batch()\`, \`.stream()\`, \`.ainvoke()\`, \`.abatch()\`, \`.astream()\`. Using chains/Runnables lets you skip all the manual coordination:

\`\`\`python
result = chain.invoke(input)
\`\`\`

## Simple Chain example

A Simple Chain is the most basic chain: the output of one component is directly passed as the input to the next — a straight line of steps, one after another, with no branching or conditions.

Example — study any topic in easy language without technical jargon:

\`\`\`python
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from dotenv import load_dotenv
load_dotenv()

llm = GoogleGenerativeAI(model="gemini-1.5-pro")

prompt = PromptTemplate(
    template="Explain me {topic} in easy language.",
    input_variables=["topic"]
)

parser = StrOutputParser()

chain = prompt | llm | parser
result = chain.invoke({"topic": "Generative AI"})
print(result)
\`\`\`

Flow: User input → LLM → output.

## Real-world use cases

1. Prompt → LLM
2. Prompt → LLM → Parser
3. RAG
4. Multi-step processing workflows
5. Translation & classifications
`,
  },
  {
    name: "Indexes",
    title: "Indexes: Loaders, Splitters, Stores & Retrievers",
    desc: "The four indexing stages that feed external data into LLM apps.",
    tags: ["LangChain", "Indexes", "RAG"],
    exampleImages: ["/diagrams/lc-indexes.png"],
    content: `# Indexes

Indexes connect external data to the LLM through four stages:

- **Document Loader** — loads the data from external storages
- **Text Splitter** — chunking
- **Vector Stores** — vectors embedded (embedding)
- **Retriever** — fetches relevant chunks

![](image:0)
`,
  },
  {
    name: "Memory",
    title: "Memory: Types, Trade-offs & Use Cases",
    desc: "Why memory matters, the five memory types, how to choose, and a worked food-delivery example.",
    tags: ["LangChain", "Memory"],
    exampleImages: [
      "/diagrams/lc-memory-table.png",
      "/diagrams/lc-memory-flow-1.png",
      "/diagrams/lc-memory-flow-2.png",
    ],
    content: `# Memory

Memory in LLM applications is a strategic enabler for enterprise AI. It allows applications to **retain context**, **personalize interactions**, and **support multi-turn workflows** — leading to better customer experiences, operational efficiency, and data-driven decision-making.

By enabling continuity across conversations, memory modules help AI systems understand user intent more deeply, reduce redundancy, and deliver tailored responses — making memory a foundational component of the next generation of intelligent enterprise solutions.

## Why memory matters in LLM applications

- **Continuity:** maintains context across interactions
- **Personalization:** remembers user preferences and history
- **Efficiency:** reduces repetition and improves automation
- **Scalability:** enables long-term learning and summarization

## LangChain memory: types, trade-offs & use cases

| Memory Type | Description | Pros | Cons | Example Use Case |
|---|---|---|---|---|
| ConversationBufferMemory | Stores full conversation history | Simple, complete context | Grows large quickly | Internal IT helpdesk bot |
| ConversationBufferWindowMemory | Stores last k interactions | Lightweight, recent context | Loses older context | Food delivery assistant |
| ConversationTokenBufferMemory | Stores memory based on token count | Token-efficient | May cut off mid-thought | Voice assistant on mobile |
| ConversationSummaryBufferMemory | Summarizes past interactions using LLM | Scales well, retains key info | Summary quality depends on LLM | Executive scheduling assistant |
| EntityMemory | Tracks entities and attributes across turns | Great for personalization | Requires entity extraction setup | E-commerce chatbot remembering preferences |

![](image:0)

Rule of thumb: the difference is in **Window / Token / Summary**. Use this decision flow: is the context length short? If no → ConversationSummaryBufferMemory. If yes: is personalization needed? If no → ConversationBufferMemory. If yes: are token constraints strict? If no → ConversationBufferMemory. If yes: is memory session-only? If yes → ConversationTokenBufferMemory, else → EntityMemory (entity = the user).

![](image:1)

![](image:2)

## Example: food-delivery chatbot with window memory

Imagine a chatbot for a food delivery app that only needs to remember the last few messages in a session:

\`\`\`python
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferWindowMemory

llm = ChatOpenAI(temperature=0.0)
memory = ConversationBufferWindowMemory(k=3)
conversation = ConversationChain(llm=llm, memory=memory)
conversation.predict(input="I want to order a pizza.")
conversation.predict(input="Make it a Margherita.")
conversation.predict(input="Add extra cheese.")
conversation.predict(input="What did I order?")
\`\`\`
`,
  },
  {
    name: "Models",
    title: "Language Models vs Chat Models",
    desc: "Base LLMs vs instruction-following chat models, with a side-by-side example.",
    tags: ["LangChain", "Models", "LLM"],
    exampleImages: [],
    content: `# Language Models vs Chat Models

The main difference is that an **LLM** is a type of AI model, while a **chat model** is an LLM (or another language model) configured or trained to interact through conversations. Think of it this way:

- **LLM:** the underlying language-generating model. Almost deprecated in LangChain standalone use; no memory, stateless; one text input → output.
- **Chat model:** a model designed to respond to user messages in a conversational format. Preferred in modern apps; multi-text input can be given; usually carries the conversation history.

## Simple example

**LLM — base model.** Input: \`The capital of India is\`. Output: \`New Delhi\`. It predicts likely continuations of text, without necessarily being trained to follow conversational instructions.

**Chat model — instruction-following.** Input: \`What is the capital of India?\`. Output: \`The capital of India is New Delhi.\` It is trained or adapted to respond to user instructions and conversational messages.

Both can be based on the same underlying architecture. The difference is largely in their training, formatting, and intended use.
`,
  },
  {
    name: "Models",
    title: "Setup and First Examples",
    desc: "Python venv setup plus first ChatOllama and OllamaEmbeddings runs.",
    tags: ["LangChain", "Models", "Ollama", "Setup"],
    exampleImages: [],
    content: `# Setup and First Examples

## Environment setup

1. Create a new venv (folder name is your choice):
\`\`\`bash
python -m venv .venv
\`\`\`
2. Activate the venv:
\`\`\`bash
venv\\Scripts\\Activate
\`\`\`
3. Create \`requirements.txt\`
4. Install packages from it:
\`\`\`bash
pip install -r requirements.txt
\`\`\`
5. Verify the LangChain installation.

## Chat example (Ollama)

\`\`\`python
from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="llama3.2:1b",
    temperature=0.9
)
response = llm.invoke("What is 2+2 and validate your annnnswer?")
print(response.content)
\`\`\`

## Embeddings example (Ollama)

\`\`\`python
from langchain_ollama import OllamaEmbeddings

embeddings = OllamaEmbeddings(
    model="llama3.2:1b",
    temperature=0.9,
    dimensions=2
)
response = embeddings.embed_query("What is 2+2 and validate your annnnswer?")
print(response)
response = embeddings.embed_query("What is 2+2 and validate your annnnswer?")
print(response)
\`\`\`
`,
  },
  {
    name: "Prompts",
    title: "Chat Prompts & Message Placeholders",
    desc: "Core prompt classes, multi-role chat templates, and dynamic chat-history placeholders.",
    tags: ["LangChain", "Prompts"],
    exampleImages: [],
    content: `# Chat Prompts & Message Placeholders

Prompts are reusable **template** classes in LangChain core that let us insert dynamic variables into text or chat messages before sending them to a language model.

## Core prompt classes

- **PromptTemplate** — single text with {variables}
- **ChatPromptTemplate** — multi-role, like a chat: AI / Human / System messages
- **MessagesPlaceholder** — inserts a dynamic list of chat history messages

## PromptTemplate example

\`\`\`python
from langchain_core.prompts import PromptTemplate
from langchain_ollama import ChatOllama

model = ChatOllama(
    model="llama3.2:1b",
    temperature=1.9
)

question = 'What is the capital of France?'

template = PromptTemplate(
    template="You are a helpful assistant. Answer the following question: {question}",
    input_variables=["question"]
)

prompt = template.invoke({"question": question})  # turn template into prompt
response = model.invoke(prompt)  # pass the prompt to model
print(response.content)
\`\`\`

## Why multi-role prompts?

The model doesn't know, if we share chat history, which message belongs to AI and which to human — so we have multi-role prompts. Now the model will know which message is AI, system, or human.

## ChatPromptTemplate example

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama

model = ChatOllama(
    model="llama3.2:1b",
    temperature=1.9
)

chat_template = ChatPromptTemplate([
    ("system", "You are a helpful {domain} expert"),
    ("human", "Explain in simple terms, what is {topic}")
])

prompt = chat_template.invoke({
    "domain": "science",
    "topic": "quantum physics"
})

response = model.invoke(prompt)
print(response.content)
\`\`\`

## Message placeholders example

\`\`\`python
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_ollama import ChatOllama

chat_template = ChatPromptTemplate([
    ("system", "You are a helpful customer support agent"),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{query}")
])

prompt = chat_template.invoke(
    "query": "What is my Name?",
    "chat_history": [
        HumanMessage(
            content="Hi! My name is Avneet Singh."
        ),
        AIMessage(
            content="Hi! How can I assist you today?"
        )
    ]
)

model = ChatOllama(
    model="llama3.2:1b",
    temperature=1.9
)

response = model.invoke(prompt)
print(response.content)
\`\`\`
`,
  },
  {
    name: "Messages",
    title: "Messages: AI, Human & System",
    desc: "The three message roles, why roles matter, and a worked multi-turn example.",
    tags: ["LangChain", "Messages"],
    exampleImages: [],
    content: `# Messages

We have **03 types of messages**: **AI**, **Human**, **System**.

**Need:** to clarify that a message was written by Human/AI or that it is a system message. Example: if we store the messages in chat history and share them with the AI with each inference, then the model will not know whose message this is and may give wrong answers.

## Worked example

\`\`\`python
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

model = ChatOpenAI()

messages = [
    SystemMessage(content='You are a helpful assistant'),
    HumanMessage(content='Tell me about LangChain')
]

result = model.invoke(messages)

messages.append(AIMessage(content=result.content))
print(messages)
\`\`\`
`,
  },
  {
    name: "Structured Output",
    title: "Structured Output & Schema Validation",
    desc: "Why structured output matters, closed vs open models, and TypedDict vs Pydantic vs JSON Schema.",
    tags: ["LangChain", "Structured Output", "Pydantic"],
    exampleImages: [
      "/diagrams/lc-structured-table.png",
      "/diagrams/lc-structured-tree.png",
    ],
    content: `# Structured Output

Structured output refers to the practise of having language models which return responses in a more structured manner rather than receiving the response in free-text manner, which makes model output easier to parse and work with programmatically.

## Why do we need structured output?

- **Agents:** agents often pass tasks to each other. If output is unstructured text, the next agent may misinterpret it. Structured output like JSON guarantees the next agent receives data in a format it expects, for example \`{"task": "search_hotels", "location": "Goa", "check_in": "2025-09-15"}\`. This makes coordination smooth and reduces failure.
- **API Building:** APIs are built to consume structured data such as JSON or XML. If an LLM generates structured output, you can directly map it to API requests. Without structured output, extra parsing and error handling is needed.
- **Data Extraction:** extracting info from documents such as invoices, resumes, or medical reports requires specific fields. Structured output gives direct mapping like \`{"invoice_number": "12345", "amount": 5000, "due_date": "2025-09-30"}\`, which makes it reliable for analytics or reporting.
- **Database Entry:** databases expect structured input in rows and columns. If an LLM produces JSON aligned with a schema, data can be inserted directly — no messy parsing, better data quality.

> Note: structured output works only with **closed-source models**. To structure responses in **open-source models**, use an **Output Parser** (covered in the next guide).

Closed-source models → \`with_structured_output\`. Open-source models → output parsers only.

## Ways to structure & validate data in Python

![](image:0)

| Feature | TypedDict ✅ | Pydantic 🚀 | JSON Schema 🌐 |
|---|---|---|---|
| Basic structure | ✅ | ✅ | ✅ |
| Type enforcement | ✅ | ✅ | ✅ |
| Data validation | ❌ | ✅ | ✅ |
| Default values | ❌ | ✅ | ❌ |
| Automatic conversion | ❌ | ✅ | ❌ |
| Cross-language compatibility | ❌ | ❌ | ✅ |

- **TypedDict** offers a lightweight way to define structure in Python, but lacks runtime validation, defaults, and constraint enforcement. No runtime validation — you can assign a number into a String field.
- **Pydantic** adds runtime validation, data coercion (automatic type conversion), defaults, and powerful field-level controls — best when correctness and safety are critical.
- **JSON Schema** provides a language-agnostic standard so teams across stacks collaborate and validate consistently.

Choosing the right schema: use **TypedDict** if you only need type hints, no validation, and trust the LLM; use **Pydantic** if you need data validation, default values, or automatic type conversion; use **JSON Schema** if you don't want extra Python libraries, need validation but not Python objects, and want a standard JSON format.

![](image:1)
`,
  },
  {
    name: "Output Parsers",
    title: "Output Parsers: From Text to Structure",
    desc: "What output parsers do and when you need them.",
    tags: ["LangChain", "Output Parsers"],
    exampleImages: [],
    content: `# Output Parsers

An Output Parser in LangChain is like a translator that takes the raw text generated by a language model and turns it into a format your program can actually work with — like a list, dictionary, or any custom structure. This is useful when working with tools, chains, or agents where the response needs to be parsed before further processing.

When a language model generates text, the output is just a string. But if your application expects structured data (e.g. a JSON object, dictionary, Pydantic model, etc.), you need to parse it using a proper parsing class of LangChain.
`,
  },
  {
    name: "Document Loaders",
    title: "Document Loaders: CSV, PDF, Web & Custom",
    desc: "Built-in loaders, lazy vs eager loading, and WebBaseLoader.",
    tags: ["LangChain", "Document Loaders", "RAG"],
    exampleImages: [],
    content: `# Document Loaders

We have several loaders like CSV, PDF, or directory loaders directly from the LangChain library.

## Lazy loading vs eager loading

- **Lazy loading** returns one document at a time in the RAM.
- **Eager loading** returns a list of all documents.

## WebBase Loader

Used to extract the webpage content and load it into LangChain.

## Custom Document Loaders

For sources LangChain doesn't cover out of the box, implement a custom document loader that yields documents in the same format.
`,
  },
];

async function upsertArticle(data) {
  const existing = await prisma.topic.findFirst({
    where: { track: data.track, title: data.title },
  });
  if (existing) {
    await prisma.topic.update({ where: { id: existing.id }, data });
    console.log("Updated:", data.title);
  } else {
    const created = await prisma.topic.create({ data });
    console.log("Created:", data.title, created.id);
  }
}

async function main() {
  for (const a of ARTICLES) {
    await upsertArticle({ track: "LangChain", kind: "article", ...a });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
