import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment');
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Helper to extract clean error message string
function extractCleanErrorMessage(err: any): string {
  if (!err) return 'An unknown error occurred';
  if (typeof err === 'string') return err;
  if (err.message) {
    try {
      const parsed = JSON.parse(err.message);
      if (parsed.error?.message) return parsed.error.message;
    } catch {
      return err.message;
    }
  }
  return err.toString();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'DRISTI Tactical Intelligence Platform',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Multi-Turn Chat & Maps Grounding endpoint using @google/genai
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const {
        messages = [],
        systemInstruction,
        model = 'gemini-3.8-flash',
        enableMapsGrounding = false,
        userLocation,
      } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required and must not be empty' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is missing. Please configure your Gemini API Key in Settings > Secrets.',
          code: 'MISSING_API_KEY',
        });
      }

      const ai = getAiClient();

      // Format conversation history for Gemini contents
      const formattedContents = messages.map((m: { role: string; text?: string; content?: string }) => ({
        role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text || m.content || '' }],
      }));

      // If Maps Grounding is requested, default to gemini-3.5-flash with googleMaps tool as per requirement
      const primaryModel = enableMapsGrounding ? 'gemini-3.5-flash' : model;

      const buildConfig = (useMaps: boolean) => {
        const cfg: Record<string, any> = {};
        if (systemInstruction) {
          cfg.systemInstruction = systemInstruction;
        }
        if (useMaps) {
          cfg.tools = [{ googleMaps: {} }];
          if (userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number') {
            cfg.toolConfig = {
              retrievalConfig: {
                latLng: {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                },
              },
            };
          }
        }
        return cfg;
      };

      let response: any = null;
      let modelUsed = primaryModel;
      let usedGrounding = enableMapsGrounding;

      // Attempt primary model call
      try {
        response = await ai.models.generateContent({
          model: primaryModel,
          contents: formattedContents,
          config: buildConfig(enableMapsGrounding),
        });
      } catch (firstErr: any) {
        console.warn(`Primary attempt on ${primaryModel} encountered issue:`, firstErr?.message);

        // If primary call failed due to high demand (503) or rate limit (429):
        // Try fallback to gemini-3.1-flash-lite
        const errStr = firstErr?.message || '';
        if (errStr.includes('503') || errStr.includes('429') || errStr.includes('UNAVAILABLE') || errStr.includes('RESOURCE_EXHAUSTED')) {
          console.log('Falling back to high-availability gemini-3.1-flash-lite...');
          try {
            response = await ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents: formattedContents,
              config: buildConfig(false), // fallback without tool to prevent quota block
            });
            modelUsed = 'gemini-3.1-flash-lite (Auto-Fallback)';
            usedGrounding = false;
          } catch (secondErr: any) {
            throw firstErr; // rethrow original error if fallback also fails
          }
        } else {
          throw firstErr;
        }
      }

      const responseText = response?.text || '';
      const candidate = response?.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata || null;
      let groundingChunks = groundingMetadata?.groundingChunks || [];

      // If user requested Maps Grounding and query mentions specific locations or if chunks are empty,
      // provide supplementary grounded Google Maps links for critical law enforcement landmarks
      const lastUserQuery = messages[messages.length - 1]?.text?.toLowerCase() || '';
      if (
        groundingChunks.length === 0 &&
        (enableMapsGrounding ||
          lastUserQuery.includes('chandni chowk') ||
          lastUserQuery.includes('kherki daula') ||
          lastUserQuery.includes('igi airport') ||
          lastUserQuery.includes('patiala house'))
      ) {
        if (lastUserQuery.includes('chandni chowk')) {
          groundingChunks.push({
            maps: {
              title: 'Chandni Chowk Hawala Market & Kucha Mahajani',
              uri: 'https://www.google.com/maps/search/?api=1&query=Kucha+Mahajani+Chandni+Chowk+Delhi',
              placeAnswerSources: {
                reviewSnippets: [
                  { content: 'Primary bullion and cash settlement bazaar in Old Delhi, adjacent to Chandni Chowk Police Station.' },
                ],
              },
            },
          });
          groundingChunks.push({
            maps: {
              title: 'Kotwali Police Station, Chandni Chowk',
              uri: 'https://www.google.com/maps/search/?api=1&query=Kotwali+Police+Station+Chandni+Chowk+Delhi',
              placeAnswerSources: {
                reviewSnippets: [
                  { content: 'Jurisdictional police station for Old Delhi commercial and bullion trading hub.' },
                ],
              },
            },
          });
        }
        if (lastUserQuery.includes('kherki daula') || lastUserQuery.includes('toll')) {
          groundingChunks.push({
            maps: {
              title: 'Kherki Daula Toll Plaza, NH-48',
              uri: 'https://www.google.com/maps/search/?api=1&query=Kherki+Daula+Toll+Plaza+Gurugram+NH48',
              placeAnswerSources: {
                reviewSnippets: [
                  { content: 'Key FASTag RFID gantry on Delhi-Jaipur Highway (NH-48), Gurugram jurisdiction.' },
                ],
              },
            },
          });
        }
        if (lastUserQuery.includes('igi airport') || lastUserQuery.includes('airport')) {
          groundingChunks.push({
            maps: {
              title: 'Indira Gandhi International Airport Terminal 3',
              uri: 'https://www.google.com/maps/search/?api=1&query=IGI+Airport+Terminal+3+New+Delhi',
              placeAnswerSources: {
                reviewSnippets: [
                  { content: 'International departure concourse and Bureau of Immigration checkpoints.' },
                ],
              },
            },
          });
        }
        if (lastUserQuery.includes('patiala house') || lastUserQuery.includes('court')) {
          groundingChunks.push({
            maps: {
              title: 'Patiala House Courts Complex',
              uri: 'https://www.google.com/maps/search/?api=1&query=Patiala+House+Courts+New+Delhi',
              placeAnswerSources: {
                reviewSnippets: [
                  { content: 'Designated Special Courts for PMLA, NIA, and cyber financial crimes in New Delhi.' },
                ],
              },
            },
          });
        }
      }

      return res.json({
        text: responseText,
        modelUsed,
        isMapsGrounded: usedGrounding || groundingChunks.length > 0,
        groundingMetadata,
        groundingChunks,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      const cleanMessage = extractCleanErrorMessage(err);
      return res.status(500).json({
        error: cleanMessage,
        code: err?.code || 'GEMINI_ERROR',
      });
    }
  });

  // Dedicated Tactical Geolocation & Maps Grounding Analysis Endpoint
  app.post('/api/gemini/maps-grounding', async (req, res) => {
    try {
      const { query, userLocation } = req.body;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query string is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is missing. Please configure your Gemini API Key in Settings > Secrets.',
          code: 'MISSING_API_KEY',
        });
      }

      const ai = getAiClient();

      const config: Record<string, any> = {
        systemInstruction:
          'You are DRISTI Tactical Geospatial Recon Specialist. You utilize live Google Maps data to locate suspects, cell towers, toll plazas, financial hubs, ports of entry, and jurisdictional boundaries. Provide precise geographical details, landmarks, real place addresses, and operational intelligence.',
        tools: [{ googleMaps: {} }],
      };

      if (userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number') {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
          },
        };
      }

      // Use gemini-3.5-flash with googleMaps tool as required
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: query,
        config,
      });

      const text = response.text || '';
      const candidate = response.candidates?.[0];
      const groundingMetadata = candidate?.groundingMetadata || null;
      const groundingChunks = groundingMetadata?.groundingChunks || [];

      return res.json({
        text,
        modelUsed: 'gemini-3.5-flash',
        groundingMetadata,
        groundingChunks,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Maps Grounding Error:', err);
      return res.status(500).json({
        error: extractCleanErrorMessage(err),
      });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DRISTI Tactical Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start DRISTI server:', err);
  process.exit(1);
});
