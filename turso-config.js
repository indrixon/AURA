// ─── TURSO – Base de données SQL distribuée ───────────────────────────────────
// ➤ CONFIGURATION :
//   1. Créer un compte sur https://turso.tech (gratuit, 9 Go)
//   2. Dans le dashboard, créer une base de données
//   3. Copier l'URL de connexion (libsql://...) → TURSO_URL
//   4. Générer un token : base de données → "Generate Token" → TURSO_AUTH_TOKEN
//
// ➤ CRÉER LES TABLES (exécute ce SQL dans le shell Turso ou le dashboard) :
//
//   CREATE TABLE IF NOT EXISTS perfumes (
//     id          INTEGER PRIMARY KEY AUTOINCREMENT,
//     name        TEXT    NOT NULL,
//     price       INTEGER NOT NULL,
//     description TEXT,
//     imageUrl    TEXT,
//     status      TEXT    DEFAULT 'approved',
//     createdAt   TEXT    DEFAULT (datetime('now'))
//   );
//
//   CREATE TABLE IF NOT EXISTS submissions (
//     id             INTEGER PRIMARY KEY AUTOINCREMENT,
//     name           TEXT    NOT NULL,
//     price          INTEGER NOT NULL,
//     description    TEXT,
//     imageUrl       TEXT,
//     submitter_name TEXT,
//     status         TEXT    DEFAULT 'pending',
//     createdAt      TEXT    DEFAULT (datetime('now'))
//   );
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "https://esm.sh/@libsql/client/web";

export const turso = createClient({
  url:       "libsql://aura-parsival.aws-ap-northeast-1.turso.io", // ← Ton URL
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY5Mzg5NzQsImlkIjoiMDE5ZGI5OGQtNDYwMS03MDQ1LTg4NzAtY2ZkYTQ0NTg3MjI0IiwicmlkIjoiZDljYjVjZTEtZWFlOC00OTZkLTk4NjUtNmU1OTBjNzIzYWI2In0.e5zFrMxJHWO-tydSOvRWmP-AJi1L2_FCZxIqCHr8Dq97z4cVuLKct0T4v_5mkpb59KY1HNBhYXHoNMk0-e2vAA",   // ← Token généré dans le dashboard Turso
});
