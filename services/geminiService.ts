
import { GoogleGenAI, Type } from "@google/genai";
import { VerificationResult } from "../types";

// Initialize the API client
// Note: In a real production build, this key should be handled via a secure backend proxy.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeResume = async (resumeText: string, imageBase64?: string, imageMimeType?: string): Promise<VerificationResult> => {
  try {
    const model = "gemini-2.5-flash";
    
    const parts: any[] = [];

    if (imageBase64 && imageMimeType) {
      parts.push({
        inlineData: {
          mimeType: imageMimeType,
          data: imageBase64,
        },
      });
    }

    const textPrompt = `
      You are an expert AI Resume Verifier for the SkillChain protocol.
      Analyze the following resume/portfolio which is provided as text, image, or PDF document. 
      
      1. **Identity Extraction**:
         - Extract the full Name of the candidate from the header.
         - If a DID (Decentralized Identifier) or Wallet Address is mentioned, extract it.
         - **Extract GitHub URL**: Look for github.com links.
         - **Extract LinkedIn URL**: Look for linkedin.com/in/ links.

      2. **Skill Extraction**:
         Identify key technical and professional skills.
         For each skill:
         - Assign a confidence score (0-100) based on how well-supported the skill is by context (years of experience, specific projects, github links mentioned, depth of explanation).
         - Extract a brief evidence snippet (e.g., "Used in Project X", "5 years experience").
         - Categorize it (e.g., Frontend, Backend, DevOps, Soft Skills).
      
      3. **Certificate Extraction**:
         Identify specific Certifications, Licenses, Degrees, or Awards.
         LOOK FOR SECTIONS LABELED: "Certifications", "Education", "Courses", "Achievements" or text inside Certificate images.
         For each certificate found:
         - Extract the Name, Issuer, and Date (use "N/A" if not found).
         - Extract a brief, 1-sentence "details" description of what the certification covers or represents.
         - Determine 'validationStatus':
            - Set to 'Verified' IF the issuer is a known reputable entity (e.g., AWS, Google, Microsoft, Universities, Coursera, Udacity) AND there is a visible ID/Link.
            - Set to 'Invalid' IF the certificate appears self-signed (e.g., Signature name matches Recipient name like "Ajay" signing for "Ajay"), or if it looks like a generic template with no credible issuer.
            - Set to 'Pending' for all other cases where verification is not immediately obvious.
      
      4. **Summary**:
         Provide an overall trust score (0-100) and a 1-sentence summary.
      
      ${resumeText ? `Resume Text:\n"${resumeText}"` : ""}
    `;

    parts.push({ text: textPrompt });

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            did: { type: Type.STRING },
            githubUrl: { type: Type.STRING },
            linkedinUrl: { type: Type.STRING },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  confidenceScore: { type: Type.NUMBER },
                  evidence: { type: Type.STRING }
                }
              }
            },
            certificates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  date: { type: Type.STRING },
                  validationStatus: { type: Type.STRING, enum: ['Verified', 'Pending', 'Invalid'] },
                  details: { type: Type.STRING }
                }
              }
            },
            summary: { type: Type.STRING },
            overallTrustScore: { type: Type.NUMBER }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as VerificationResult;
    }
    
    throw new Error("No data returned from AI");

  } catch (error) {
    console.error("Error analyzing resume:", error);
    // Return fallback data if API fails or key is missing (for demo robustness)
    return {
      name: "Guest Candidate",
      did: "did:cardano:guest...",
      githubUrl: "https://github.com/guest-dev",
      linkedinUrl: "https://linkedin.com/in/guest-dev",
      skills: [
        { name: "React", category: "Frontend", confidenceScore: 85, evidence: "Fallback: Detected from context" },
        { name: "TypeScript", category: "Frontend", confidenceScore: 80, evidence: "Fallback: Standard web stack" },
        { name: "Cardano", category: "Blockchain", confidenceScore: 70, evidence: "Fallback: Project mention" }
      ],
      certificates: [
        { 
          name: "Cardano Developer Professional", 
          issuer: "Emurgo", 
          date: "2024", 
          validationStatus: "Verified",
          details: "Comprehensive training on Cardano architecture, native tokens, and Plutus smart contract development.",
          credentialId: "CRED-EMURGO-2024-X99",
          blockchainHash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
        },
        { 
          name: "AWS Certified Solutions Architect", 
          issuer: "Amazon Web Services", 
          date: "2023", 
          validationStatus: "Verified",
          details: "Validation of expertise in designing distributed systems and deploying scalable applications on AWS.",
          credentialId: "AWS-ARCH-2023-882",
          blockchainHash: "0x3a21b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d4421"
        },
        { 
          name: "Certified Kubernetes Administrator", 
          issuer: "CNCF", 
          date: "2022", 
          validationStatus: "Pending",
          details: "Validates skills for designing and managing Kubernetes clusters."
        }
      ],
      summary: "Simulation Mode: Unable to connect to AI (Check API Key). Showing demo data.",
      overallTrustScore: 88
    };
  }
};