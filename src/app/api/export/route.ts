// 9. app/api/export/route.ts
import { NextResponse } from "next/server";
import { exportToCodebase } from "@/lib/export/toCodebase";
import { exportToFigma } from "@/lib/export/toFigma";
import { exportToCss } from "@/lib/export/toCss";
import { ThemeTokens, CustomToken } from "@/lib/tokens/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { format, tokens, customTokens } = body as {
      format: "codebase" | "figma" | "css";
      tokens: ThemeTokens;
      customTokens: CustomToken[];
    };

    if (!tokens || !format) {
      return NextResponse.json({ error: "Missing required payload" }, { status: 400 });
    }

    let result: string;
    let contentType = "application/json";
    let filename = "theme.json";

    switch (format) {
      case "codebase":
        result = exportToCodebase(tokens, customTokens || []);
        break;
      case "figma":
        result = exportToFigma(tokens, customTokens || []);
        break;
      case "css":
        result = exportToCss(tokens, customTokens || []);
        contentType = "text/css";
        filename = "theme.css";
        break;
      default:
        return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    return new NextResponse(result, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
