import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// ---------- Settings ----------
export function settingsRef(uid) {
  return doc(db, 'users', uid, 'settings', 'ai');
}

export async function loadSettings(uid) {
  const snap = await getDoc(settingsRef(uid));
  return snap.exists() ? snap.data() : null;
}

export function subscribeSettings(uid, cb) {
  return onSnapshot(settingsRef(uid), (snap) => cb(snap.exists() ? snap.data() : null));
}

export async function saveSettings(uid, data) {
  await setDoc(settingsRef(uid), { updatedAt: new Date().toISOString(), ...data }, { merge: true });
}

// ---------- Profile ----------
export function userRef(uid) {
  return doc(db, 'users', uid);
}

export async function loadProfile(uid) {
  const snap = await getDoc(userRef(uid));
  return snap.exists() ? snap.data() : null;
}

// ---------- Projects ----------
export function projectsCol(uid) {
  return collection(db, 'users', uid, 'projects');
}

export async function loadProjects(uid) {
  const q = query(projectsCol(uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function subscribeProjects(uid, cb) {
  return onSnapshot(projectsCol(uid), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
  );
}

export async function addProject(uid, project) {
  return addDoc(projectsCol(uid), { createdAt: new Date().toISOString(), ...project });
}

export async function removeProject(uid, id) {
  await deleteDoc(doc(projectsCol(uid), id));
}

// ---------- Chats / sessions ----------
export function chatsCol(uid) {
  return collection(db, 'users', uid, 'chats');
}

export async function createChat(uid, { title = 'New Chat', model = 'Sekale Smart' } = {}) {
  return addDoc(chatsCol(uid), {
    title,
    model,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function updateChat(uid, chatId, updates) {
  await setDoc(
    doc(chatsCol(uid), chatId),
    { ...updates, updatedAt: new Date().toISOString() },
    { merge: true },
  );
}

export function subscribeChats(uid, cb) {
  return onSnapshot(query(chatsCol(uid), where('archived', '!=', true)), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
  );
}

export function subscribeChat(uid, chatId, cb) {
  return onSnapshot(doc(chatsCol(uid), chatId), (snap) => cb(snap.data()));
}
