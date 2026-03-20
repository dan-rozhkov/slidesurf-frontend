import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import { Matrix } from "@iddan/react-spreadsheet";
import { ChartData, SearchResult, SearchResponse } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz");

export async function dataURLToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return blob;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function transformDataForChart(data: Matrix): ChartData[] {
  if (!Array.isArray(data) || data.length === 0 || !Array.isArray(data[0])) {
    return [];
  }

  const headers = data[0].map((cell) => String(cell?.value || ""));
  const rows = data.slice(1);

  return rows.map((row) => ({
    name: String(row[0]?.value || ""),
    values: row.slice(1).map((cell) => Number(cell?.value || 0)),
    headers,
  }));
}

function cleanPassage(passage: string): string {
  return passage.replace(/<hlword>(.*?)<\/hlword>/g, "$1");
}

function parseYandexSearchXML(xmlString: string): SearchResponse {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  const query = xmlDoc.querySelector("query")?.textContent || "";

  const found = parseInt(
    xmlDoc.querySelector('found[priority="all"]')?.textContent || "0",
    10
  );

  const results: SearchResult[] = [];
  const groups = xmlDoc.querySelectorAll("group");

  groups.forEach((group) => {
    const domain = group.querySelector("categ")?.getAttribute("name") || "";
    const doc = group.querySelector("doc");

    if (doc) {
      const url = doc.querySelector("url")?.textContent || "";
      const title = doc.querySelector("title")?.textContent || "";
      const passages = Array.from(
        doc.querySelectorAll("passages > passage")
      ).map((passage) => cleanPassage(passage.textContent || ""));

      results.push({ domain, url, title, passages });
    }
  });

  return { query, found, results };
}

export function processYandexResponse(rawData: string): SearchResponse {
  const xmlString = atob(rawData);

  try {
    return parseYandexSearchXML(xmlString);
  } catch (error) {
    console.error("Ошибка при парсинге XML:", error);
  }

  return { query: "", found: 0, results: [] };
}
