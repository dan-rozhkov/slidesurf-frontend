import { domToPng } from "modern-screenshot";

const TIPTAP_DRAG_HANDLE_CLASS = "tiptap-drag-handle";

// Cache for getComputedStyle results to avoid expensive reflows
const styleCache = new WeakMap<HTMLElement, CSSStyleDeclaration>();

function getCachedStyle(element: HTMLElement): CSSStyleDeclaration {
  let style = styleCache.get(element);
  if (!style) {
    style = getComputedStyle(element);
    styleCache.set(element, style);
  }
  return style;
}

// Container types that should NOT be rendered as images
// Instead, their content should be traversed for text extraction
const EDITABLE_CONTAINER_TYPES = [
  "card",
  "columns",
  "column",
  "smart-layout",
  "smart-layout-item",
];

// Container types that should have their background rendered as an image
// (to preserve gradients and complex backgrounds)
const CONTAINER_TYPES_WITH_IMAGE_BACKGROUND = ["card"];

async function captureElementAsImage(element: HTMLElement) {
  try {
    const dataUrl = await domToPng(element, {
      scale: 2,
      quality: 1,
      type: "image/png",
      backgroundColor: null,
      filter: (node) => {
        if (!(node instanceof HTMLElement)) return true;
        return !node.className?.toString().includes(TIPTAP_DRAG_HANDLE_CLASS);
      },
    });

    return dataUrl || null;
  } catch (error) {
    console.warn("Failed to capture element as image", error);
    return null;
  }
}

// Capture container background as image (filtering out text content)
async function captureContainerAsImage(element: HTMLElement) {
  try {
    const dataUrl = await domToPng(element, {
      scale: 2,
      quality: 1,
      type: "image/png",
      backgroundColor: null,
      filter: (node) => {
        // Include text nodes (they are part of the DOM tree)
        if (!(node instanceof HTMLElement)) return true;

        // Skip drag handles
        if (node.className?.toString().includes(TIPTAP_DRAG_HANDLE_CLASS)) {
          return false;
        }

        // Keep the container element itself
        if (node === element) return true;

        // Skip text-bearing elements to hide text
        const tagName = node.tagName?.toLowerCase();
        if (
          tagName === "p" ||
          tagName === "h1" ||
          tagName === "h2" ||
          tagName === "h3" ||
          tagName === "h4" ||
          tagName === "h5" ||
          tagName === "h6" ||
          tagName === "span" ||
          tagName === "li" ||
          tagName === "ul" ||
          tagName === "ol" ||
          tagName === "a"
        ) {
          return false;
        }

        return true;
      },
    });

    return dataUrl || null;
  } catch (error) {
    console.warn("Failed to capture container as image", error);
    return null;
  }
}

function extractUrlFromCssValue(value?: string | null): string | null {
  if (!value || value === "none") {
    return null;
  }

  const match = value.match(/url\(["']?([^"')]+)["']?\)/);
  return match ? (match[1] ?? null) : null;
}

export type MappedNode = {
  tag: string;
  x: number; // px, from the left edge of the parent
  y: number; // px, from the top edge of the parent
  width: number;
  height: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  fontWeight?: string;
  lineHeight?: number;
  textAlign?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  src?: string; // for images
  dataType?: string; // for custom nodes
  maskImageUrl?: string;
  objectFit?: "cover"; // for images with object-fit: cover
  isGroup?: boolean; // for grouping elements
  children?: MappedNode[]; // child elements for groups
  isContainer?: boolean; // for container elements (card, column, etc.)
  backgroundImageSrc?: string; // for containers with image backgrounds (gradients)
};

export type SlideData = {
  nodes: MappedNode[];
  backgroundImage?: string;
  backgroundColor?: string;
  width: number;
  height: number;
};

export async function mapNodes(parent: HTMLElement): Promise<MappedNode[]> {
  const parentRect = parent.getBoundingClientRect();
  const customNodeElements = new Set<HTMLElement>();

  parent.querySelectorAll<HTMLElement>("[data-type]").forEach((element) => {
    const dataType = element.getAttribute("data-type");

    // Skip editable container types - they should be traversed for text extraction
    if (dataType && EDITABLE_CONTAINER_TYPES.includes(dataType)) {
      return;
    }

    const ancestorWithDataType = element.parentElement?.closest("[data-type]");

    if (!ancestorWithDataType) {
      customNodeElements.add(element);
      return;
    }

    // Check if the ancestor is an editable container - if so, this element should be processed
    const ancestorDataType = ancestorWithDataType.getAttribute("data-type");
    if (
      ancestorDataType &&
      EDITABLE_CONTAINER_TYPES.includes(ancestorDataType)
    ) {
      customNodeElements.add(element);
      return;
    }

    if (ancestorWithDataType === element) {
      customNodeElements.add(element);
    }
  });

  // Also find decorative elements (contentEditable=false) inside editable containers
  parent
    .querySelectorAll<HTMLElement>("[contenteditable='false']")
    .forEach((element) => {
      // Skip if already in custom nodes
      if (customNodeElements.has(element)) {
        return;
      }

      // Check if this element is inside an editable container
      const parentContainer = element.closest(
        EDITABLE_CONTAINER_TYPES.map((type) => `[data-type="${type}"]`).join(
          ","
        )
      );

      if (parentContainer) {
        // This is a decorative element inside an editable container
        // Check if it has meaningful visual content (not just a wrapper)
        const rect = element.getBoundingClientRect();
        if (rect.width > 10 && rect.height > 10) {
          customNodeElements.add(element);
        }
      }
    });

  // Find all elements with text and images, excluding containers
  function findLeafTextElements(element: HTMLElement): HTMLElement[] {
    const leafElements: HTMLElement[] = [];

    // Skip elements that are contentEditable=false (decorative elements)
    // They will be handled separately as custom nodes
    if (element.getAttribute("contenteditable") === "false") {
      if (customNodeElements.has(element)) {
        leafElements.push(element);
      }
      return leafElements;
    }

    // Check if this is an editable container - traverse its children
    const dataType = element.getAttribute("data-type");
    const isEditableContainer =
      dataType && EDITABLE_CONTAINER_TYPES.includes(dataType);

    // If it's a custom node (not an editable container), treat it as atomic
    if (customNodeElements.has(element) && !isEditableContainer) {
      leafElements.push(element);
      return leafElements;
    }

    // Process images directly
    if (element.tagName.toLowerCase() === "img") {
      leafElements.push(element);
      return leafElements;
    }

    const style = getCachedStyle(element);
    const rect = element.getBoundingClientRect();

    // Skip invisible elements
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0" ||
      rect.width <= 0 ||
      rect.height <= 0
    ) {
      return leafElements;
    }

    // Always recursively search for images in all child elements
    for (const child of Array.from(element.children)) {
      if (child instanceof HTMLElement) {
        const childResults = findLeafTextElements(child);
        leafElements.push(...childResults);
      }
    }

    // Also check for text in current element
    const text = element.textContent?.trim();
    if (text && text.length > 0) {
      // Check if this element has its own text (not inherited from children)
      let hasOwnText = false;
      for (const node of Array.from(element.childNodes)) {
        if (node.nodeType === Node.TEXT_NODE) {
          const nodeText = node.textContent?.trim();
          if (nodeText && nodeText.length > 0) {
            hasOwnText = true;
            break;
          }
        }
      }

      if (hasOwnText) {
        leafElements.push(element);
      }
    }

    return leafElements;
  }

  // Collect container elements (cards, columns) with background/border
  function findContainerElements(element: HTMLElement): HTMLElement[] {
    const containers: HTMLElement[] = [];

    const dataType = element.getAttribute("data-type");
    if (dataType && EDITABLE_CONTAINER_TYPES.includes(dataType)) {
      const style = getCachedStyle(element);
      const rect = element.getBoundingClientRect();

      // Check if container has visible background or border
      const hasBackground =
        style.backgroundColor &&
        style.backgroundColor !== "rgba(0, 0, 0, 0)" &&
        style.backgroundColor !== "transparent";

      const hasBorder =
        style.borderWidth &&
        parseInt(style.borderWidth, 10) > 0 &&
        style.borderColor &&
        style.borderColor !== "rgba(0, 0, 0, 0)" &&
        style.borderColor !== "transparent";

      // Also check for gradient background
      const hasGradient =
        style.backgroundImage &&
        style.backgroundImage !== "none" &&
        (style.backgroundImage.includes("gradient") ||
          style.backgroundImage.includes("url"));

      if (
        (hasBackground || hasBorder || hasGradient) &&
        rect.width > 0 &&
        rect.height > 0
      ) {
        containers.push(element);
      }
    }

    // Recursively search children
    for (const child of Array.from(element.children)) {
      if (child instanceof HTMLElement) {
        containers.push(...findContainerElements(child));
      }
    }

    return containers;
  }

  // Find all container elements first
  const containerElements = findContainerElements(parent);

  // Find all leaf elements
  const leafElements = findLeafTextElements(parent);

  // Map container elements to nodes (they will be rendered as shapes with background)
  const containerNodes = await Promise.all(
    containerElements.map(async (element) => {
      const rect = element.getBoundingClientRect();
      const style = getCachedStyle(element);
      const dataType = element.getAttribute("data-type") || "container";

      const parsedBorderWidth = parseFloat(style.borderWidth);
      const parsedBorderRadius = parseFloat(style.borderRadius);

      // For cards, capture as image to preserve gradients
      let backgroundImageSrc: string | undefined;
      if (CONTAINER_TYPES_WITH_IMAGE_BACKGROUND.includes(dataType)) {
        const captured = await captureContainerAsImage(element);
        // Only use if we got a valid data URL
        if (captured && captured.startsWith("data:image/")) {
          backgroundImageSrc = captured;
        }
      }

      return {
        tag: "container",
        dataType,
        x: rect.left - parentRect.left,
        y: rect.top - parentRect.top,
        width: rect.width,
        height: rect.height,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        borderWidth: Number.isFinite(parsedBorderWidth)
          ? parsedBorderWidth
          : undefined,
        borderRadius: Number.isFinite(parsedBorderRadius)
          ? parsedBorderRadius
          : undefined,
        isContainer: true,
        backgroundImageSrc,
      } satisfies MappedNode;
    })
  );

  const mappedNodes = await Promise.all(
    leafElements.map(async (element) => {
      const rect = element.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;

      const style = getCachedStyle(element);
      const tagName = element.tagName.toLowerCase();
      const className = element.className || "";

      // Skip service elements
      if (
        tagName === "script" ||
        tagName === "style" ||
        tagName === "noscript" ||
        className.includes("ProseMirror") ||
        className.includes("tiptap")
      ) {
        return null;
      }

      const baseNode: Pick<MappedNode, "x" | "y" | "width" | "height"> = {
        x: rect.left - parentRect.left,
        y: rect.top - parentRect.top,
        width: rect.width,
        height: rect.height,
      };

      if (customNodeElements.has(element)) {
        const dataUrl = await captureElementAsImage(element);

        if (!dataUrl) {
          return null;
        }

        return {
          tag: "custom",
          dataType: element.getAttribute("data-type") || tagName,
          src: dataUrl,
          ...baseNode,
        } satisfies MappedNode;
      }

      if (tagName === "img") {
        const maskImage =
          style.maskImage || style.getPropertyValue("mask-image");
        const webkitMaskImage = style.getPropertyValue("-webkit-mask-image");
        const maskImageUrl =
          extractUrlFromCssValue(maskImage) ||
          extractUrlFromCssValue(webkitMaskImage);

        let resolvedMaskUrl: string | undefined;

        if (maskImageUrl) {
          try {
            resolvedMaskUrl = new URL(
              maskImageUrl,
              window.location.origin
            ).toString();
          } catch (error) {
            console.warn("Failed to resolve mask image URL", error);
            resolvedMaskUrl = maskImageUrl;
          }
        }

        const objectFit = style.objectFit;

        return {
          tag: tagName,
          src: (element as HTMLImageElement).src,
          maskImageUrl: resolvedMaskUrl,
          objectFit: objectFit === "cover" ? "cover" : undefined,
          ...baseNode,
        } satisfies MappedNode;
      }

      const text = element.textContent?.trim();
      if (text && text.length > 0) {
        const parsedFontSize = parseInt(style.fontSize, 10);
        const parsedLineHeight = parseInt(style.lineHeight, 10);
        const parsedBorderWidth = parseInt(style.borderWidth, 10);
        const parsedBorderRadius = parseInt(style.borderRadius, 10);

        return {
          tag: tagName,
          text,
          fontSize: Number.isFinite(parsedFontSize)
            ? parsedFontSize
            : undefined,
          fontFamily: style.fontFamily,
          color: style.color,
          fontWeight: style.fontWeight,
          lineHeight: Number.isFinite(parsedLineHeight)
            ? parsedLineHeight
            : undefined,
          textAlign: style.textAlign as "left" | "center" | "right" | "justify",
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          borderWidth: Number.isFinite(parsedBorderWidth)
            ? parsedBorderWidth
            : undefined,
          borderRadius: Number.isFinite(parsedBorderRadius)
            ? parsedBorderRadius
            : undefined,
          ...baseNode,
        } satisfies MappedNode;
      }

      return null;
    })
  );

  // Container nodes first (background), then content nodes on top
  return [...containerNodes, ...(mappedNodes.filter(Boolean) as MappedNode[])];
}

export async function extractSlideData(
  slideElement: HTMLElement
): Promise<SlideData> {
  const slideStyle = getCachedStyle(slideElement);
  const slideRect = slideElement.getBoundingClientRect();

  // Extract background image
  let backgroundImage;
  if (slideStyle.backgroundImage && slideStyle.backgroundImage !== "none") {
    const bgImage = slideStyle.backgroundImage.match(
      /url\(["']?([^"')]+)["']?\)/
    );
    if (bgImage?.[1]) {
      backgroundImage = bgImage[1];
    }
  }

  // Map all elements of the slide (leave URL as is)
  const nodes = await mapNodes(slideElement);

  // Extract background color when no transparent background
  const backgroundColor =
    slideStyle.backgroundColor &&
    slideStyle.backgroundColor !== "rgba(0, 0, 0, 0)" &&
    slideStyle.backgroundColor !== "transparent"
      ? slideStyle.backgroundColor
      : undefined;

  return {
    nodes,
    backgroundImage,
    backgroundColor,
    width: slideRect.width,
    height: slideRect.height,
  };
}

export function extractSlidesData(slides: HTMLElement[]): Promise<SlideData[]> {
  return Promise.all(slides.map((slide) => extractSlideData(slide)));
}
