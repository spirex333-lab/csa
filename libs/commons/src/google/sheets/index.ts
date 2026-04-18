'use server';
import { google } from 'googleapis';

export type GoogleSheetsSaveOptions = {
  range?: string;
  auth?: {
    clientEmail: string;
    privateKey: string;
    scopes?: string[];
  };
};

export const saveToSheet = async <D = string[]>(
  data: D,
  opts: GoogleSheetsSaveOptions
) => {
  const { range, auth } = opts ?? {};
  const auth_ = new google.auth.GoogleAuth({
    credentials: {
      client_email: auth?.clientEmail ?? process.env.GOOGLE_CLIENT_EMAIL,
      private_key:
        auth?.privateKey?.replace(/\\n/g, '\n') ??
        process.env.GOOGLE_CLIENT_PRIV_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets',
      ...(auth?.scopes ?? []),
    ],
  });

  const sheet = google.sheets({
    version: 'v4',
    auth: auth_,
  });

  const response = await (sheet.spreadsheets.values as any).append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: range ?? `A1:Z1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [data],
    },
  });
  return response;
};
