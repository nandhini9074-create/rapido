import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database
  const users: any[] = [];

  // API Routes
  app.post("/api/auth/register", (req, res) => {
    const { email, password, role, name } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = { id: Date.now().toString(), email, password, role, name };
    users.push(newUser);
    res.json({ user: { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name } });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password, role } = req.body;
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
