import { mapFontsToSource } from "@/config/fonts";
import { FontFaceResponse } from "@/interface/fonts";

export async function addFontFace(name: string): Promise<FontFaceResponse> {
  const source = mapFontsToSource[name];

  if (document.fonts.check(`12px "${name}"`)) {
    return {
      error: null,
      name,
    };
  }

  if (source) {
    try {
      const fontFace = new FontFace(name, `url(${source})`);
      document.fonts.add(fontFace);
      await fontFace.load();
      return {
        error: null,
        name,
      };
    } catch (e) {
      return {
        error: "Unable to load font. Default font will be used to preview",
        name: "Montserrat",
      };
    }
  }

  // Try loading from Google Fonts CSS for fonts not in the local map
  try {
    const family = encodeURIComponent(name.replace(/ /g, "+"));
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;700&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    await document.fonts.load(`12px "${name}"`);
    return {
      error: null,
      name,
    };
  } catch (e) {
    return {
      error: "Cannot locate font. Default font will be used to preview",
      name: "Montserrat",
    };
  }
}
