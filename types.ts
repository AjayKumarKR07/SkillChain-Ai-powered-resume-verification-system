
export interface Skill {
  name: string;
  category: string;
  confidenceScore: number; // 0-100
  evidence: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
  validationStatus: 'Verified' | 'Pending' | 'Invalid';
  details?: string;
  credentialId?: string;
  blockchainHash?: string;
}

export interface CandidateProfile {
  name: string;
  did: string; // Decentralized Identifier
  skills: Skill[];
  certificates: Certificate[];
  isVerified: boolean;
  walletAddress: string;
  timestamp: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export enum AppView {
  LANDING = 'LANDING',
  CANDIDATE = 'CANDIDATE',
  EMPLOYER = 'EMPLOYER',
  LOGIN = 'LOGIN'
}

export interface VerificationResult {
  name?: string; // Extracted name
  did?: string; // Extracted or suggested DID
  skills: Skill[];
  certificates: Certificate[];
  summary: string;
  overallTrustScore: number;
  githubUrl?: string;
  linkedinUrl?: string;
}