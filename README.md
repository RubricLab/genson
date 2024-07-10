# Genson

Genson is a generative-ui web app that allows users to leverage the abilities of `Claude-3.5-sonnet` to generate functional UI using typesafe JSON.

The model is given a schema written in typescript for all supported components via Zod, making it very intuitive to define actions (functions, server actions, APIs) and frontend components. Users can generate full dashboards with forms, buttons, dropdowns, and more with nested components, shared data, full customizability, APIs. Just send a natural language query!

## Getting Started

```bash
pnpm install
```

Setup your .env.local file. And set your own.

```bash
cp .env.example .env.local
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
