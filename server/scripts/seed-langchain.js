// Seed the first LangChain article (transcribed from the author's OneNote).
// Safe: only touches track "LangChain", DSA data is preserved.
// Usage: node scripts/seed-langchain.js
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const introContent = `# Introduction to LangChain

**LangChain** is an open-source framework for building applications around LLMs.
It helps developers connect LLMs with external data, tools, and workflows.
Available in both **Python** and **JavaScript**.

## Key Components

LangChain has six key components:

- **Chains** — Define a sequence of steps where each step can use an LLM, process data or call tools. Simple chains use one step, while multi-step chains combine multiple actions.
- **Prompt Management** — Helps design and manage prompts using templates, making it easier to control input, output format and model behavior.
- **Agents** — LLM-driven components that decide which actions to take, such as calling tools or APIs, based on input and predefined capabilities.
- **Vector Databases** — Store data as vectors to enable similarity search, helping retrieve relevant information for tasks like document search and RAG. (You need a DB in real applications.)
- **Models** — Support multiple LLMs like OpenAI, Hugging Face and others, allowing flexibility in choosing the best model.
- **Memory Management** — Maintains context from past interactions, enabling better responses in conversations and multi-step tasks.

Prompts are given to the LLM through LangChain, and agents/chains are created inside the LLM workflow.

## From Chatbots to LLMs

1. Using **NLP**, people wanted to make **chatbots**.
2. But chatbots had challenges: **NLU** (Natural Language Understanding) for the chatbot, and replies that were **context aware** for the user.
3. **LLMs solved this problem** — but LLMs had their own challenge: **too large in size**. LLM files are very large; you can't run them on a local system.
4. So LLMs moved to **cloud providers** — **Anthropic**, **OpenAI**, and others.

## Models: One Interface, Any Provider

LangChain provides a **model interface** so that we can connect to any AI provider (Anthropic / OpenAI) with the same code.

**Before models:** the code for using two different providers meant writing two different codebases — one for OpenAI's API, one for Anthropic's API.

\`\`\`python
# Before: OpenAI (direct API)
import openai
openai.api_key = "sk-..."
result = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello"}],
)
print(result.choices[0].message.content)
\`\`\`

\`\`\`python
# Before: Anthropic (direct API)
import anthropic
client = anthropic.Anthropic(api_key="sk-ant-...")
result = client.messages.create(
    model="claude-3-opus-20240229",
    messages=[{"role": "user", "content": "Hello"}],
)
print(result.content)
\`\`\`

**After models:** just a single line change — the provider name. The model interface exposes the same methods, so for all providers we call these same methods:

\`\`\`python
# After: LangChain (OpenAI)
from langchain_openai import ChatOpenAI
model = ChatOpenAI(model="gpt-4", temperature=0)
result = model.invoke("Divide the result by 5")
print(result.content)
\`\`\`

\`\`\`python
# After: LangChain (Anthropic) — only this line changes
from langchain_anthropic import ChatAnthropic
model = ChatAnthropic(model="claude-3-opus-20240229")
result = model.invoke("Who are you?")
print(result.content)
\`\`\`

## Two Types of LangChain Models

- **Language models** — LLMs and Chat Models. Input text in, **text output** out.
- **Embedding models** — used for semantic search. Text in, **vector** out (text → vector, vector is the output).
`;

const promptsContent = `# Prompts: Static, Dynamic & Few-Shot

Prompts are very crucial in **deciding what the response of the LLM is**. Hence, it has to be designed very precisely so that the model responds with the response that we are interested in. LangChain helps you structure and manage these prompts, especially when you're building apps like chatbots, Q&A systems, etc.

The prompts can be broadly classified into two categories:

1. **Static Prompts**
2. **Dynamic Prompts**

## Static Prompts

A static prompt is a **hardcoded message** defining a task to model. It does not contain any blank fields that can be filled based on the requirements of users. Let us understand with an example —

\`\`\`python
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
load_dotenv()

chat_model = ChatGoogleGenerativeAI(model="gemini-1.5-pro")

static_prompt = "Explain the concept of Sentiment Analysis in under 2 sentences."
response = chat_model.invoke(static_prompt)
print(response.content)
\`\`\`

## Dynamic Prompts

A dynamic prompt is a **template with variables** that you can fill in with different values. It allows the prompt to change depending on the situation, user input, or program logic.

Dynamic prompts are not pre-defined but rather generated or modified dynamically during the run-time. They can change based on user history, external data sources, or prior conversations.

Let us understand this with the help of an example —

\`\`\`python
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
load_dotenv()

chat_model = ChatGoogleGenerativeAI(model="gemini-1.5-pro")

# Dynamic placeholders: {topic} and {length}
dynamic_prompt_template = PromptTemplate(
    template="Explain the concept of {topic} in under {length} sentences.",
    input_variables=["topic", "length"],
)

user_topic = input("Enter Topic to Study: ")
user_length = input("Enter Length of Response: ")
dynamic_prompt = dynamic_prompt_template.format(topic=user_topic, length=user_length)

print(f"\\nQuery after filling blank fields: {dynamic_prompt}\\n")
response = chat_model.invoke(dynamic_prompt)
print(f"Response: {response.content}\\n")
\`\`\`

## Few-Shot Prompts

\`\`\`python
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate, FewShotPromptTemplate
from dotenv import load_dotenv
load_dotenv()

chat_model = ChatGoogleGenerativeAI(model="gemini-1.5-pro")

# 1. Define a list of examples
examples = [
    {"shape": "Square", "sides": "Eight (8)"},
    {"shape": "Triangle", "sides": "Six (6)"},
]

# Create the FewShotPromptTemplate
example_prompt = PromptTemplate(
    input_variables=["shape", "sides"],
    template="Shape:{shape}\\nSides:{sides}\\n",
)

few_shot_prompt = FewShotPromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
    prefix="Understand the pattern and provide me the response for my query.",
    suffix="Shape: {shape}",
    input_variables=["shape"],
)

# 2. Passing our data to few shot prompt
final_prompt = few_shot_prompt.format(shape="Pentagon")

# How the final prompt template looks like
print("\\nFull Prompt:\\n")
print(final_prompt)

# 3. Passing final prompt template to the chat model
response = chat_model.invoke(final_prompt)
print(response.content)
\`\`\`

## Reusable Prompts

The main usage of prompts is **reusable prompts**. A reusable prompt is built once and filled with different values on every run:

1. Define the template with variables (placeholders).
2. Fill the blank fields at run-time with user input or program data.
3. Invoke the model with the final prompt — same template, any values.
`;

async function upsertArticle(data) {
  const existing = await prisma.topic.findFirst({
    where: { track: data.track, title: data.title },
  });
  if (existing) {
    await prisma.topic.update({ where: { id: existing.id }, data });
    console.log("Updated article:", data.title);
  } else {
    const created = await prisma.topic.create({ data });
    console.log("Created article:", data.title, created.id);
  }
}

async function main() {
  await upsertArticle({
    track: "LangChain",
    kind: "article",
    name: "Introduction",
    title: "Introduction, Components & Models",
    desc: "What LangChain is, its six key components, and how the model interface unifies providers.",
    content: introContent,
    tags: ["LangChain", "LLM", "Agents", "RAG"],
    exampleImages: ["/diagrams/langchain-models-types.png"],
  });
  await upsertArticle({
    track: "LangChain",
    kind: "article",
    name: "Prompts",
    title: "Prompts: Static, Dynamic & Few-Shot",
    desc: "Static vs dynamic prompts, few-shot templates, and reusable prompt patterns with Gemini.",
    content: promptsContent,
    tags: ["LangChain", "Prompts", "Gemini"],
    exampleImages: [],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
