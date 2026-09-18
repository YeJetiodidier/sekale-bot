import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import admin from 'firebase-admin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'db.json');

const seed = {
  users: [],
  projects: [],
  chats: [],
  settings: [],
};

function getServiceAccountConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey,
    };
  }

  return null;
}

function initFirestore() {
  if (!process.env.FIREBASE_PROJECT_ID && !process.env.GCLOUD_PROJECT && !process.env.FIREBASE_CLIENT_EMAIL) {
    return null;
  }

  if (!admin.apps.length) {
    const serviceAccount = getServiceAccountConfig();
    const appConfig = serviceAccount
      ? {
          credential: admin.credential.cert({
            project_id: serviceAccount.projectId,
            client_email: serviceAccount.clientEmail,
            private_key: serviceAccount.privateKey,
          }),
          projectId: serviceAccount.projectId,
        }
      : undefined;

    if (appConfig) {
      admin.initializeApp(appConfig);
      return admin.firestore();
    }
  }

  try {
    return admin.firestore();
  } catch {
    return null;
  }
}

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(seed, null, 2));
  }
}

export async function readStore() {
  await ensureStore();
  const text = await fs.readFile(dataFile, 'utf8');
  try {
    return JSON.parse(text);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(seed, null, 2));
    return structuredClone(seed);
  }
}

export async function writeStore(nextStore) {
  await ensureStore();
  await fs.writeFile(dataFile, JSON.stringify(nextStore, null, 2));
}

export async function listCollection(collectionName) {
  const db = initFirestore();
  if (db) {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  const store = await readStore();
  return store[collectionName] || [];
}

export async function upsertCollectionItem(collectionName, item) {
  const db = initFirestore();
  if (db) {
    const id = item.id || crypto.randomUUID();
    const payload = {
      ...item,
      id,
      updatedAt: new Date().toISOString(),
    };
    await db.collection(collectionName).doc(id).set(payload, { merge: true });
    const saved = await db.collection(collectionName).doc(id).get();
    return { id: saved.id, ...saved.data() };
  }

  const store = await readStore();
  const list = store[collectionName] || [];
  const existingIndex = list.findIndex((entry) => entry.id === item.id);
  if (existingIndex >= 0) {
    list[existingIndex] = { ...list[existingIndex], ...item };
  } else {
    list.push(item);
  }
  store[collectionName] = list;
  await writeStore(store);
  return item;
}

export async function removeCollectionItem(collectionName, id) {
  const db = initFirestore();
  if (db) {
    await db.collection(collectionName).doc(id).delete();
    return [];
  }

  const store = await readStore();
  const list = (store[collectionName] || []).filter((entry) => entry.id !== id);
  store[collectionName] = list;
  await writeStore(store);
  return list;
}
