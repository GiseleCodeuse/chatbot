
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Tu es l'expert Dermaly. Ton but unique : identifier le type de peau (Normale, Sèche, Grasse, Sensible).
RÈGLES DE VITESSE :
- Sois très concis. Pas de phrases inutiles.
- Pose UNE seule question courte à la fois.
- Après 3 ou 4 questions, donne le diagnostic immédiatement.
- Finis TOUJOURS par : "Ceci n'est pas un avis médical. Consultez un dermatologue."
TON : Direct, professionnel, amical.
LANGUE : Français uniquement.
`;

export class SkinDiagnosisService {
  private chat: Chat;

  constructor() {
    // Création d'une nouvelle instance à chaque fois pour garantir la fraîcheur de la clé
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.chat = ai.chats.create({
      model: 'gemini-3-flash-preview', 
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, // Plus bas = plus rapide et direct
        thinkingConfig: { thinkingBudget: 0 } // Désactivation totale de la réflexion
      },
    });
  }

  async *sendMessageStream(message: string) {
    try {
      const responseStream = await this.chat.sendMessageStream({ message });
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          yield c.text;
        }
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      yield "Erreur de connexion. Veuillez réessayer.";
    }
  }

  async startConversation(callback: (text: string) => void): Promise<void> {
    const stream = this.sendMessageStream("Bonjour ! Je suis l'IA Dermaly. Prêt(e) pour votre diagnostic de peau express ?");
    let fullText = "";
    for await (const chunk of stream) {
      fullText += chunk;
      callback(fullText);
    }
  }
}
