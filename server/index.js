import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import { initializeApp } from 'firebase/app';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import {
  listCollection,
  upsertCollectionItem,
  removeCollectionItem,
} from './store.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const SYSTEM_PROMPT = `You are Sekale, an Afropolitan AI assistant that helps with coding, analysis, learning and creativity. Be concise, technical and precise. Format code and technical output with clear Markdown.`;

const DEFAULT_MODEL = process.env.VITE_AI_MODEL || process.env.FIREBASE_AI_MODEL || 'gemini-2.5-flash';
const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY || 'AIzaSyClq1QxiYkPjGvzupbcKZ7OLSiB5RpDIUs',
  authDomain: 'sekale-bot.firebaseapp.com',
  projectId: 'sekale-bot',
  storageBucket: 'sekale-bot.firebasestorage.app',
  messagingSenderId: '305651116997',
  appId: '1:305651116997:web:307414d1d89b87a258b9ac',
  measurementId: 'G-N2SG16RGFP',
};

const firebaseApp = initializeApp(FIREBASE_CONFIG);
const firebaseAI = getAI(firebaseApp, { backend: new GoogleAIBackend() });
const firebaseModel = getGenerativeModel(firebaseAI, { model: DEFAULT_MODEL });

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'sekale-backend',
    model: DEFAULT_MODEL,
    provider: 'firebase-ai',
    hasFirebaseConfig: Boolean(FIREBASE_CONFIG.apiKey),
  });
});

app.get('/api/config', (_req, res) => {
  res.json({
    model: DEFAULT_MODEL,
    provider: 'firebase-ai',
    hasFirebaseConfig: Boolean(FIREBASE_CONFIG.apiKey),
  });
});

const normalizeUserId = (value) => String(value || 'guest').trim() || 'guest';

app.get('/api/projects', async (req, res) => {
  try {
    const userId = normalizeUserId(req.query.userId);
    const projects = (await listCollection('projects')).filter((item) => item.userId === userId || (!item.userId && userId === 'guest'));
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load projects', details: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const payload = req.body || {};
    const userId = normalizeUserId(payload.userId || req.query.userId);
    const project = {
      id: payload.id || crypto.randomUUID(),
      userId,
      name: payload.name || 'Untitled Project',
      description: payload.description || '',
      category: payload.category || 'General',
      createdAt: new Date().toISOString(),
      ...payload,
    };
    const saved = await upsertCollectionItem('projects', project);
    res.status(201).json({ project: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save project', details: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await removeCollectionItem('projects', req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project', details: error.message });
  }
});

app.get('/api/chats', async (req, res) => {
  try {
    const userId = normalizeUserId(req.query.userId);
    const chats = (await listCollection('chats')).filter((item) => item.userId === userId || (!item.userId && userId === 'guest'));
    res.json({ chats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load chats', details: error.message });
  }
});

app.post('/api/chats', async (req, res) => {
  try {
    const payload = req.body || {};
    const userId = normalizeUserId(payload.userId || req.query.userId);
    const chat = {
      id: payload.id || crypto.randomUUID(),
      userId,
      title: payload.title || 'New Chat',
      model: payload.model || DEFAULT_MODEL,
      messages: Array.isArray(payload.messages) ? payload.messages : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const saved = await upsertCollectionItem('chats', chat);
    res.status(201).json({ chat: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save chat', details: error.message });
  }
});

app.delete('/api/chats/:id', async (req, res) => {
  try {
    const chatId = req.params.id;
    const userId = normalizeUserId(req.query.userId || req.body?.userId || 'guest');
    const chats = await listCollection('chats');
    const target = chats.find((chat) => chat.id === chatId && (chat.userId === userId || (!chat.userId && userId === 'guest')));

    if (!target) {
      return res.status(404).json({ error: 'Chat not found for this user' });
    }

    await removeCollectionItem('chats', chatId);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete chat', details: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], model = DEFAULT_MODEL, temperature = 0.7 } = req.body || {};
    const userId = normalizeUserId(req.body?.userId || req.query.userId);

    const activeModel = model || DEFAULT_MODEL;
    const activeModelClient = getGenerativeModel(firebaseAI, { model: activeModel });

    const contents = messages.map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(message.content || '') }],
    }));

    const response = await activeModelClient.generateContent({
      systemInstruction: SYSTEM_PROMPT,
      contents,
      generationConfig: {
        temperature,
      },
    });

    const rawText =
      response?.response?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('') || '';

    const reply = rawText.trim();

    const chat = {
      id: crypto.randomUUID(),
      userId,
      title: 'Sekale Response',
      model: activeModel,
      messages: [...messages, { role: 'assistant', content: reply }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await upsertCollectionItem('chats', chat);

    return res.json({
      reply,
      model: activeModel,
      provider: 'firebase-ai',
      chat,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Chat request failed', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Sekale backend running on http://localhost:${PORT}`);
});
