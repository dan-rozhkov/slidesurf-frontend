import { Slide, SlideLayout, SlideVerticalAlign } from "@/types";
import { nanoid } from "@/lib/utils";

export function parseSlideBlock(block: string): Partial<Slide> | null {
  const lines = block.trim().split("\n");
  const slide: Partial<Slide> = {};
  let contentBuffer = "";
  let isInContentBlock = false;

  for (const line of lines) {
    if (line.trim() === "") continue;

    if (line.startsWith("content:")) {
      isInContentBlock = true;
      contentBuffer = line.replace("content:", "").trim();
      continue;
    }

    if (isInContentBlock) {
      // If we hit another key-value pair, we're done with content
      if (line.includes("index:") || line.includes("isLoadingLayoutImage:")) {
        isInContentBlock = false;
        slide.content = contentBuffer;
      } else {
        contentBuffer += "\n" + line;
        continue;
      }
    }

    const [key, value] = line.split(/:\s(.+)/);
    if (key && value) {
      switch (key.trim()) {
        case "layout":
          const layoutValue = value.trim().replace(/"/g, "");
          if (Object.values(SlideLayout).includes(layoutValue as SlideLayout)) {
            slide.layout = layoutValue as SlideLayout;
          }
          break;
        case "verticalAlign":
          slide.verticalAlign = value
            .trim()
            .replace(/"/g, "") as SlideVerticalAlign;
          break;
        case "isLoadingLayoutImage":
          slide.isLoadingLayoutImage =
            value.trim().replace(/"/g, "") === "true";
          break;
        case "index":
          slide.index = parseInt(value.trim(), 10);
          break;
      }
    }
  }

  // Handle the last content block if we're still in one
  if (isInContentBlock) {
    slide.content = contentBuffer;
  }

  return slide.index !== undefined ? slide : null;
}

export function parseSlidesFromStream(content: string): Slide[] {
  const slides: Slide[] = [];
  const blocks = content.split("-----");

  blocks.forEach((block) => {
    const slidePartial = parseSlideBlock(block);
    if (slidePartial && slidePartial.index !== undefined) {
      slides[slidePartial.index] = {
        id: nanoid(),
        index: slidePartial.index,
        content: slidePartial.content || "",
        layout: slidePartial.layout || SlideLayout.WITHOUT,
        verticalAlign: slidePartial.verticalAlign || SlideVerticalAlign.CENTER,
        isLoadingLayoutImage: slidePartial.isLoadingLayoutImage || false,
      };
    }
  });

  return slides;
}
