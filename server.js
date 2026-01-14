import express from "express";
import session from "express-session";
import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: "calendar-secret",
    resave: false,
    saveUninitialized: true,
  })
);

const oauth2Client = new google.auth.OAuth2(
  "SEU_CLIENT_ID",
  "SEU_CLIENT_SECRET",
  "http://localhost:3000/auth/google/callback"
);

// Login
app.get("/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });
  res.redirect(url);
});

// Callback
app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  req.session.tokens = tokens;
  res.redirect("/");
});

// Middleware auth
function requireAuth(req, res, next) {
  if (!req.session.tokens) return res.status(401).send("Not logged in");
  oauth2Client.setCredentials(req.session.tokens);
  next();
}

// Listar eventos
app.get("/api/events", requireAuth, async (req, res) => {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const r = await calendar.events.list({
    calendarId: "primary",
    maxResults: 10,
    orderBy: "startTime",
    singleEvents: true,
    timeMin: new Date().toISOString(),
  });
  res.json(r.data.items);
});

// Criar evento
app.post("/api/events", requireAuth, async (req, res) => {
  try {
    const { title, start, end } = req.body;

    const timeZone = "America/Sao_Paulo";

    const startDate = new Date(start);
    const endDate = new Date(end);

    const event = {
      summary: title || "Sem título",
      start: {
        dateTime: startDate.toISOString(),
        timeZone,
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone,
      },
    };

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    console.log("Evento criado:", response.data.id);
    res.json(response.data);
  } catch (err) {
    console.error("Erro ao criar evento:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});


app.listen(3000, () =>
  console.log("Rodando em http://localhost:3000")
);
