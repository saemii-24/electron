import fs from "fs";
import path from "path";
import http from "http";
import { google } from "googleapis";
import open from "open";

const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export async function authorizeCalendar() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const { client_id, client_secret } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    "http://localhost:5173/oauth2callback"
  );

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
    oAuth2Client.setCredentials(token);
    return "이미 Google Calendar가 연결되어 있습니다";
  }

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  const server = http.createServer(async (req, res) => {
    if (req.url.startsWith("/oauth2callback")) {
      const url = new URL(req.url, "http://localhost:5173");
      const code = url.searchParams.get("code");

      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

      //한글 깨짐 방지
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
      });

      res.end("Google Calendar 연결이 완료되었습니다! 창을 닫으셔도 됩니다.");

      server.close();
    }
  });

  server.listen(5173, () => {
    open(authUrl);
  });

  return "브라우저에서 Google 로그인을 완료해주세요";
}
