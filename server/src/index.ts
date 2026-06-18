import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import {
  listProjectFiles,
  walkProject,
  writeProjectFile,
} from './projectFiles.js';
import type { Message, ProjectSnapshot } from './types.js';
import { generateWithGPT } from './gemini.js';

const app = express();
const port = Number(process.env.PORT ?? 8787);
const previewUrl = process.env.PROJECT_PREVIEW_URL ?? 'http://localhost:5174';
const messageHistory: Message[] = [];

// update this prompt to be more efficient
const systemPrompt =
  'You are helping update the React project in the project folder. Make sure you return response in the same structure as request. return update files with their path and content and a small summary';

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.get('/api/project', async (_request, response) => {
  // you'll use this endpoint to show preview of your running react project , messages  , files , only one project for now is supported.
  // make sure the above state is synced with fe, even some changes are applied
  // return ProjectSnapshot type here
  const files: any = await listProjectFiles();
  console.log({ files });

  const res = {
    summary: 'test',

    messageHistory: messageHistory,
    files: files,
    updatedAt: Date.now().toString(),
    previewUrl: previewUrl,
  };

  response.json(res);
});

app.post('/api/messages', async (request, response) => {
  // read user message here and make changes to files present in projects folder in root dir
  // writeProjectFile(path, content). After writes, return a fresh project snapshot.

  const req_msg = request.body.message;

  console.log({ req_msg });

  messageHistory.push({
    role: 'user',
    content: req_msg,
    createdAt: Date.now().toString(),
  });

  const files: any = await listProjectFiles();
  console.log({ files });

  const gptRes = await generateWithGPT(files, req_msg, systemPrompt);

  console.log({ gptRes });
  messageHistory.push({
    role: 'assistant',
    content: gptRes,
    createdAt: Date.now().toString(),
  });

  const generatedFiles = gptRes.files;

  console.log({ generatedFiles });

  for (let i = 0; i < generatedFiles.length; i++) {
    await writeProjectFile(generatedFiles[i].path, generatedFiles[i].content);
  }

  const new_files: any = await listProjectFiles();
  console.log({ new_files });
  const res: any = {
    summary: gptRes?.summary,
    messageHistory: messageHistory,
    files: new_files,
    updatedAt: Date.now().toString(),
    previewUrl: previewUrl,
  };
  console.log({ res });

  response.json(res);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
