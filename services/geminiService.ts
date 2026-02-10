
import { GoogleGenAI, Chat } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Tu es un chatbot spécialisé dans le diagnostic cosmétique de type de peau. 
Ton rôle est de déterminer le type de peau de l'utilisateur parmi : peau normale, peau sèche, peau grasse, peau sensible.

Règles de comportement :
1. Tu poses des questions simples, une par une. Ne pose jamais deux questions dans le même message.
2. Pose des questions sur :
   - La sensation après le nettoyage.
   - La brillance de la peau au cours de la journée.
   - Les sensations de tiraillements.
   - Les réactions aux produits cosmétiques (rougeurs, picotements).
3. Analyse les réponses logiquement :
   - Peau sèche : tiraillements fréquents, inconfort après lavage, peu de brillance.
   - Peau grasse : brillance fréquente, excès de sébum.
   - Peau sensible : rougeurs, picotements ou réactions fréquentes aux produits.
   - Peau normale : peau confortable, équilibrée, peu de réactions.
4. Une fois que tu as assez d'informations (généralement après 4 questions), annonce clairement le type de peau détecté.
5. Donne une explication courte (2-3 phrases) professionnelle, bienveillante et simple.
6. IMPORTANT : Ajoute toujours une mention à la fin disant que ceci n'est pas un diagnostic médical et qu'il est conseillé de consulter un dermatologue pour un avis médical.
7. Ton ton est doux, expert et accessible.
8. Langue : Français uniquement.
`;

export class SkinDiagnosisService {
  private chat: Chat;

  constructor() {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await this.chat.sendMessage({ message });
      return response.text || "Désolé, je n'ai pas pu analyser votre réponse. Pouvez-vous reformuler ?";
    } catch (error) {
      console.error("Gemini API Error:", error);
      if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        // This might be an API key issue in some environments
        return "Une erreur est survenue avec ma connexion. Veuillez réessayer plus tard.";
      }
      return "Une erreur technique s'est produite. Je vous prie de m'excuser.";
    }
  }

  async startConversation(): Promise<string> {
    return this.sendMessage("Bonjour ! Je suis ton assistant Dermaly. Je vais t'aider à découvrir ton type de peau en quelques questions. Es-tu prêt(e) à commencer ?");
  }
}
