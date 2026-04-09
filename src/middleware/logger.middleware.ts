// src/middleware/logger.middleware.ts
import { Elysia } from "elysia";

export const logger = new Elysia({ name: "logger" })
  .onRequest(({ request }) => {
    // রিকোয়েস্ট আসার সময় নোট করে রাখা
    (request as any).startTime = performance.now();
  })
  .onAfterResponse(({ request, set, path }) => {
    const start = (request as any).startTime;
    const end = performance.now();
    const duration = (end - start).toFixed(2); // মিলিসেকেন্ডে সময়
    
    const method = request.method;
    const status = Number(set.status || 200);
    
    // স্ট্যাটাস কোড অনুযায়ী কালার ইমোজি (অপশনাল)
    const statusEmoji = status >= 400 ? "❌" : "✅";
    
    console.log(
      `${statusEmoji} [${method}] ${path} - ${status} | ${duration}ms`
    );
  });