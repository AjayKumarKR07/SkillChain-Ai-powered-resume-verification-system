
import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  CheckCircle, 
  Search, 
  FileText, 
  User, 
  ArrowRight, 
  Menu, 
  X, 
  Lock, 
  Share2, 
  Award, 
  Scroll, 
  Clock, 
  AlertCircle, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  RefreshCw, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Wallet, 
  Briefcase, 
  Key, 
  LogOut, 
  Calendar, 
  Building, 
  QrCode, 
  ScanLine, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Copy, 
  Filter, 
  ArrowUpDown, 
  FileKey, 
  EyeOff, 
  Check,
  Tag,
  Plus,
  Hash,
  FileCheck,
  Github,
  Linkedin
} from 'lucide-react';
import { AppView, VerificationResult, CandidateProfile, Skill, Certificate } from './types';
import { analyzeResume } from './services/geminiService';
import { SkillChart } from './components/SkillChart';

// --- Shared Database (Mutable for Demo Persistence) ---
const MOCK_CANDIDATES: CandidateProfile[] = [
  {
    name: "Anil Kumar K R",
    did: "did:cardano:1z7...9x",
    isVerified: true,
    walletAddress: "addr1...titan",
    timestamp: new Date().toISOString(),
    githubUrl: "https://github.com/anil-titan",
    linkedinUrl: "https://linkedin.com/in/anil-titan",
    skills: [
      { name: "React", category: "Frontend", confidenceScore: 95, evidence: "5 years experience, extensive portfolio" },
      { name: "Cardano (Plutus)", category: "Blockchain", confidenceScore: 88, evidence: "Hackathon project IBW 2025" },
      { name: "Node.js", category: "Backend", confidenceScore: 82, evidence: "Used in previous fintech role" },
      { name: "Python", category: "AI/ML", confidenceScore: 78, evidence: "Basic integration of HuggingFace models" }
    ],
    certificates: [
      { 
        name: "Cardano Developer Professional", 
        issuer: "Emurgo", 
        date: "2024", 
        validationStatus: "Verified",
        details: "Covers advanced concepts of Cardano blockchain, including UTXO model, native assets, and Plutus smart contracts.",
        credentialId: "CRED-EMURGO-2024-X99",
        blockchainHash: "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
      },
      { 
        name: "AWS Certified Solutions Architect", 
        issuer: "Amazon Web Services", 
        date: "2023", 
        validationStatus: "Verified",
        details: "Validates technical expertise in designing and deploying scalable, highly available, and fault-tolerant systems on AWS.",
        credentialId: "AWS-ARCH-2023-882",
        blockchainHash: "0x3a21b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d4421"
      }
    ]
  },
  {
    name: "Sarah Jenkins",
    did: "did:cardano:8y2...4m",
    isVerified: true,
    walletAddress: "addr1...innovate",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    githubUrl: "https://github.com/sarahj-code",
    skills: [
      { name: "Rust", category: "Systems", confidenceScore: 94, evidence: "Core contributor to open-source DeFi protocols" },
      { name: "Haskell", category: "Blockchain", confidenceScore: 91, evidence: "Formal verification of smart contracts" },
      { name: "System Architecture", category: "Design", confidenceScore: 89, evidence: "Designed scalable microservices for banking app" }
    ],
    certificates: [
      { 
        name: "Plutus Pioneer Program", 
        issuer: "IOG", 
        date: "2023", 
        validationStatus: "Verified",
        details: "Intensive training program focused on writing and testing smart contracts using Plutus.",
        credentialId: "CRED-PLUTUS-2023-A12",
        blockchainHash: "0x9c21b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d1192"
      },
      { 
        name: "PhD Computer Science", 
        issuer: "MIT", 
        date: "2020", 
        validationStatus: "Verified",
        details: "Specialized in distributed systems and cryptographic primitives.",
        credentialId: "MIT-PHD-2020-001",
        blockchainHash: "0x1d21b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d5511"
      }
    ]
  },
  {
    name: "David Chen",
    did: "did:cardano:3x9...2p",
    isVerified: true,
    walletAddress: "addr1...data",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    linkedinUrl: "https://linkedin.com/in/dchen-ai",
    skills: [
      { name: "TensorFlow", category: "AI/ML", confidenceScore: 96, evidence: "Published 3 papers on Neural Networks" },
      { name: "Python", category: "Data Science", confidenceScore: 98, evidence: "lead data scientist at AI startup" },
      { name: "Cloud Computing", category: "DevOps", confidenceScore: 85, evidence: "AWS Certified Solutions Architect" }
    ],
    certificates: [
      { 
        name: "Google Data Analytics Certificate", 
        issuer: "Coursera", 
        date: "2022", 
        validationStatus: "Pending",
        details: "Professional certificate covering data cleaning, analysis, and visualization using R and SQL."
      }
    ]
  }
];

const SAMPLE_RESUME = `Anil Kumar K R
Full Stack Blockchain Developer
github.com/anil-titan | linkedin.com/in/anil-titan

Summary:
Passionate developer with 5 years of experience in building scalable web applications and 2 years in blockchain solutions. Team Leader of "Terminal Titans" for Cardano Hackathon.

Skills:
- Frontend: React.js, Tailwind CSS, TypeScript (Expert)
- Blockchain: Cardano, Plutus, Atala PRISM DID (Intermediate)
- Backend: Node.js, Express, PostgreSQL
- AI: Python, HuggingFace Transformers, OpenAI API

Experience:
Senior Developer at TechCorp (2020-Present)
- Led a team of 5 to migrate legacy apps to to React.
- Integrated payment gateways processing $1M monthly.

Certifications & Awards:
- Cardano Developer Professional (Emurgo, 2024)
- AWS Certified Solutions Architect (Amazon Web Services, 2023)
- Certified Kubernetes Administrator (CNCF, 2022)

Hackathon Projects:
- SkillChain: An AI-powered resume verifier using Cardano and Midnight ZK proofs.
`;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'candidate' | 'employer' | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [nextView, setNextView] = useState<AppView | null>(null);

  // Candidate State
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [candidateSearchTerm, setCandidateSearchTerm] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VerificationResult | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedTxHash, setMintedTxHash] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [verifyingCertIndex, setVerifyingCertIndex] = useState<number | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isChartExpanded, setIsChartExpanded] = useState(false);
  
  // Extra Candidate Inputs
  const [githubInput, setGithubInput] = useState("");
  const [linkedinInput, setLinkedinInput] = useState("");

  // ZK State
  const [isGeneratingZK, setIsGeneratingZK] = useState(false);
  const [zkProof, setZkProof] = useState<string | null>(null);
  
  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Employer State
  const [searchDid, setSearchDid] = useState("");
  const [foundProfiles, setFoundProfiles] = useState<CandidateProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [suggestions, setSuggestions] = useState<CandidateProfile[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [selectedSkillFilters, setSelectedSkillFilters] = useState<string[]>([]);
  const [isSkillFilterOpen, setIsSkillFilterOpen] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const skillFilterRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close suggestions and filters
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (skillFilterRef.current && !skillFilterRef.current.contains(event.target as Node)) {
        setIsSkillFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Login Logic: Simulates loading user data if they exist in DB
  const handleLogin = (role: 'candidate' | 'employer', identifier?: string) => {
    setIsLoggedIn(true);
    setUserRole(role);
    setCurrentUserId(identifier || null);

    if (role === 'candidate' && identifier) {
      // Check if candidate exists in MOCK_CANDIDATES
      const existingProfile = MOCK_CANDIDATES.find(c => 
        c.did.toLowerCase().includes(identifier.toLowerCase()) || 
        c.name.toLowerCase().includes(identifier.toLowerCase())
      );
      
      if (existingProfile) {
        setAnalysisResult({
          name: existingProfile.name,
          did: existingProfile.did,
          skills: existingProfile.skills,
          certificates: existingProfile.certificates,
          summary: "Profile retrieved from ledger.",
          overallTrustScore: 92,
          githubUrl: existingProfile.githubUrl,
          linkedinUrl: existingProfile.linkedinUrl
        });
        setMintedTxHash(existingProfile.isVerified ? "existing_tx_" + existingProfile.did : null);
      } else {
        // New user
        setAnalysisResult(null);
        setMintedTxHash(null);
        setResumeText(SAMPLE_RESUME); // Reset to sample or empty
      }
    }

    if (nextView) {
      setCurrentView(nextView);
      setNextView(null);
    } else {
      setCurrentView(role === 'candidate' ? AppView.CANDIDATE : AppView.EMPLOYER);
    }
  };

  const handleNavigate = (view: AppView) => {
    if (view === AppView.LANDING) {
      setCurrentView(view);
      return;
    }

    if (!isLoggedIn && (view === AppView.CANDIDATE || view === AppView.EMPLOYER)) {
      setNextView(view);
      setCurrentView(AppView.LOGIN);
    } else {
      setCurrentView(view);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUserId(null);
    setAnalysisResult(null);
    setFoundProfiles([]);
    setResumeText(SAMPLE_RESUME);
    setCurrentView(AppView.LOGIN);
    setZkProof(null);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Client-side validation for file type (Images + PDF)
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        setFileError("Invalid file type. Please upload an image (JPG, PNG) or PDF.");
        event.target.value = ''; // Reset the input
        return;
      }

      setSelectedFile(file);
      const base64 = await fileToBase64(file);
      setPreviewUrl(base64);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileError(null);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() && !selectedFile) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setMintedTxHash(null);
    setZkProof(null); // Reset ZK proofs
    setExpandedCategories({}); // Reset expansion state
    setVerifyingCertIndex(null);
    setIsChartExpanded(false); // Reset chart state
    
    let imageBase64: string | undefined = undefined;
    let imageMimeType: string | undefined = undefined;

    if (selectedFile) {
        try {
            const base64String = await fileToBase64(selectedFile);
            // Remove data URL prefix (e.g., "data:image/jpeg;base64," or "data:application/pdf;base64,")
            const matches = base64String.match(/^data:(.+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                imageMimeType = matches[1];
                imageBase64 = matches[2];
            }
        } catch (e) {
            console.error("Error processing file", e);
        }
    }
    
    const result = await analyzeResume(resumeText, imageBase64, imageMimeType);
    
    // Merge manual inputs if AI didn't find them, or overwrite if user provided them
    if (githubInput.trim()) result.githubUrl = githubInput;
    if (linkedinInput.trim()) result.linkedinUrl = linkedinInput;

    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleCandidateRetrieval = () => {
    if (!candidateSearchTerm.trim()) return;
    
    const term = candidateSearchTerm.toLowerCase();
    const found = MOCK_CANDIDATES.find(c => 
      c.did.toLowerCase().includes(term) || 
      c.walletAddress.toLowerCase().includes(term)
    );

    if (found) {
        const mappedResult: VerificationResult = {
            name: found.name,
            did: found.did,
            skills: found.skills,
            certificates: found.certificates,
            summary: `Profile retrieved from ledger. Verified identity: ${found.did}`,
            overallTrustScore: 92, // Mock score for existing profiles
            githubUrl: found.githubUrl,
            linkedinUrl: found.linkedinUrl
        };
        setAnalysisResult(mappedResult);
        setMintedTxHash(found.isVerified ? found.did.replace('did:cardano:', '') + '889025946c1e5' : null);
        setZkProof(null);
    } else {
        alert("Profile not found in ledger. Please upload your resume to generate a new identity.");
    }
  };

  const handleGenerateZK = () => {
    if (!analysisResult) return;
    setIsGeneratingZK(true);
    
    setTimeout(() => {
        const verifiedSkills = analysisResult.skills.filter(s => s.confidenceScore > 70).map(s => s.name);
        const uniqueCategories = Array.from(new Set(analysisResult.skills.map(s => s.category))).filter(Boolean);
        const certDates = analysisResult.certificates.map(c => c.date);
        const maxCertDate = certDates.length > 0 ? certDates.sort().reverse()[0] : "N/A";

        // Simulate Merkle Root generation from skills and certificates data
        // In a real ZK circuit, this is the root of the credential tree committed on-chain
        const simulatedMerkleRoot = "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');

        const mockProof = JSON.stringify({
            proofType: "Midnight-ZK-SNARK",
            curve: "bls12-381",
            protocol: "plonk",
            proof: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
            publicSignals: [
                `merkle_root:${simulatedMerkleRoot}`,
                `hash(did:${analysisResult.did || 'did:cardano:simulated_user'})`,
                `hash(categories_mask:${uniqueCategories.length})`
            ],
            verifiedAttributes: {
                skills_count: verifiedSkills.length,
                skills_hash: "0x" + Math.floor(Math.random() * 10000000).toString(16),
                min_confidence: 70,
                skill_categories_present: uniqueCategories,
                max_certificate_date: maxCertDate
            },
            timestamp: new Date().toISOString()
        }, null, 2);
        
        setZkProof(mockProof);
        setIsGeneratingZK(false);
    }, 2500);
  };

  const handleMint = () => {
    setIsMinting(true);
    setTimeout(() => {
      // PERSISTENCE LOGIC: Save this candidate to MOCK_CANDIDATES
      if (analysisResult) {
          const newTxHash = "889025946c1e550c60803447596850239070d635f284e3650f968e6f001c2776";
          const newDID = analysisResult.did || `did:cardano:${newTxHash.substring(0,16)}`;
          
          // Check if already exists
          const exists = MOCK_CANDIDATES.findIndex(c => c.did === newDID);
          
          const newProfile: CandidateProfile = {
              name: analysisResult.name || "New Candidate",
              did: newDID,
              isVerified: true,
              walletAddress: "addr1...minted" + Math.floor(Math.random() * 1000),
              timestamp: new Date().toISOString(),
              skills: analysisResult.skills,
              certificates: analysisResult.certificates,
              githubUrl: analysisResult.githubUrl,
              linkedinUrl: analysisResult.linkedinUrl
          };

          if (exists >= 0) {
              MOCK_CANDIDATES[exists] = newProfile;
          } else {
              MOCK_CANDIDATES.push(newProfile);
          }
          
          setMintedTxHash(newTxHash);
          setAnalysisResult({ ...analysisResult, did: newDID }); // Update local state with new DID
      }
      setIsMinting(false);
    }, 2500);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleVerifyCertificate = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!analysisResult) return;
    setVerifyingCertIndex(index);
    
    setTimeout(() => {
        const cert = analysisResult.certificates[index];
        const name = cert.name.toLowerCase();
        const issuer = cert.issuer.toLowerCase();
        
        console.log(`Resolving DID for issuer: ${cert.issuer}`);
        console.log(`Verifying cryptographic signature on chain...`);
        
        // RELAXED: Only mark as fake if explicitly containing 'fake' or 'self' in issuer
        const isFake = issuer.includes('self') || name.includes('fake_check');
        const isSuccess = isFake ? false : Math.random() > 0.2; 

        const newStatus = isSuccess ? 'Verified' : 'Invalid';
        const updatedCerts = [...analysisResult.certificates];
        updatedCerts[index] = { 
            ...updatedCerts[index], 
            validationStatus: newStatus,
            credentialId: isSuccess ? `CRED-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined,
            blockchainHash: isSuccess ? `0x${Math.random().toString(16).substr(2, 64)}` : undefined
        };
        
        setAnalysisResult({
            ...analysisResult,
            certificates: updatedCerts
        });
        setVerifyingCertIndex(null);
    }, 2500);
  };

  const handleScanQR = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      handleSearch(MOCK_CANDIDATES[0]);
    }, 2500);
  };

  const handleSearch = (selectedCandidate?: CandidateProfile) => {
    const searchTerm = selectedCandidate ? selectedCandidate.did : searchDid.toLowerCase().trim();
    const isShowAll = !searchTerm && !selectedCandidate;

    setIsSearching(true);
    setFoundProfiles([]);
    setSearchError(false);
    setShowSuggestions(false);
    setSelectedSkillFilters([]);
    
    if (selectedCandidate) {
      setSearchDid(selectedCandidate.name);
    }
    
    setTimeout(() => {
      let matches: CandidateProfile[] = [];
      
      if (selectedCandidate) {
        matches = [selectedCandidate];
      } else if (isShowAll) {
        matches = MOCK_CANDIDATES;
      } else {
        matches = MOCK_CANDIDATES.filter(c => 
          c.did.toLowerCase().includes(searchTerm) || 
          c.name.toLowerCase().includes(searchTerm)
        );
      }

      if (matches.length > 0) {
        setFoundProfiles(matches);
      } else {
        setFoundProfiles([]);
        setSearchError(true);
      }
      setIsSearching(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchDid(val);
    setSearchError(false);
    
    if (val.trim()) {
      const term = val.toLowerCase();
      const matches = MOCK_CANDIDATES.filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.did.toLowerCase().includes(term)
      );
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleClearSearch = () => {
    setSearchDid("");
    setFoundProfiles([]);
    setSearchError(false);
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedSkillFilters([]);
  };

  const renderDashboardStats = () => {
    const totalVerified = MOCK_CANDIDATES.filter(c => c.isVerified).length;
    const allSkills = MOCK_CANDIDATES.flatMap(c => c.skills);
    const avgScore = allSkills.length > 0 ? Math.round(allSkills.reduce((acc, s) => acc + s.confidenceScore, 0) / allSkills.length) : 0;
    
    return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 relative overflow-hidden group hover:border-neon-green/30 transition-all">
        <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
          <Users className="h-24 w-24 text-neon-green transform translate-x-4 -translate-y-4" />
        </div>
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-blue-500/10 rounded-lg">
             <Users className="h-6 w-6 text-blue-400" />
          </div>
          <span className="text-gray-400 text-sm font-medium">Database Candidates</span>
        </div>
        <div className="text-3xl font-bold text-white">{MOCK_CANDIDATES.length} <span className="text-lg text-gray-500 font-normal">/ {totalVerified} Verified</span></div>
        <div className="text-xs text-green-400 mt-2 flex items-center">
          <TrendingUp className="h-3 w-3 mr-1" /> Live Database
        </div>
      </div>
      
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 relative overflow-hidden group hover:border-neon-green/30 transition-all">
        <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
           <ShieldCheck className="h-24 w-24 text-cardano-light transform translate-x-4 -translate-y-4" />
        </div>
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-neon-green/10 rounded-lg">
             <ShieldCheck className="h-6 w-6 text-neon-green" />
          </div>
          <span className="text-gray-400 text-sm font-medium">Global Trust Score</span>
        </div>
        <div className="text-3xl font-bold text-white">{avgScore}%</div>
        <div className="text-xs text-gray-500 mt-2">Avg. AI Verification Confidence</div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 relative overflow-hidden group hover:border-neon-green/30 transition-all">
         <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity">
           <BarChart3 className="h-24 w-24 text-purple-400 transform translate-x-4 -translate-y-4" />
        </div>
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-purple-500/10 rounded-lg">
             <BarChart3 className="h-6 w-6 text-purple-400" />
          </div>
          <span className="text-gray-400 text-sm font-medium">Top Demand Skill</span>
        </div>
        <div className="text-3xl font-bold text-white">Plutus</div>
        <div className="text-xs text-purple-400 mt-2">Blockchain Development</div>
      </div>
    </div>
  )};

  const renderIdentityCard = ({ profile, txHash }: { profile: VerificationResult, txHash: string }) => {
     const mockDid = profile.did || `did:cardano:${txHash.substring(0, 16)}`;
     
     // Construct rich data for the QR code so scanners show actual info
     const qrData = `SKILLCHAIN IDENTITY\nName: ${profile.name}\nTrust Score: ${profile.overallTrustScore}%\nStatus: Verified on Cardano\nDID: ${mockDid}\nProof: https://cardanoscan.io/transaction/${txHash}`;
     
     const encodedQrData = encodeURIComponent(qrData);
     
     const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedQrData}&bgcolor=1e293b&color=00d186&margin=10`;

     const handleCopy = () => {
        navigator.clipboard.writeText(mockDid);
        alert(`DID Copied: ${mockDid}`);
     };

     const handleShare = () => {
        const shareData = {
            title: 'Verified SkillChain Identity',
            text: `Verify my skills on Cardano: ${mockDid}`,
            url: `https://cardanoscan.io/transaction/${txHash}` 
        };
        if (navigator.share) {
            navigator.share(shareData).catch((err) => console.log('Error sharing', err));
        } else {
             navigator.clipboard.writeText(shareData.url);
             alert('Transaction URL copied to clipboard!');
        }
     };

     return (
        <div className="mt-8 bg-gradient-to-br from-dark-card to-dark-bg border border-neon-green/30 rounded-2xl p-8 relative overflow-hidden shadow-2xl animate-fade-in">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

           <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                 <div className="p-3 bg-white rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <img src={qrUrl} alt="Identity QR" className="w-40 h-40 object-contain" />
                 </div>
                 <p className="text-xs text-neon-green font-mono">SCAN TO VERIFY</p>
              </div>

              <div className="md:col-span-2 space-y-6">
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                       <ShieldCheck className="h-6 w-6 text-neon-green" />
                       <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">SkillChain Verified Identity</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-1">{profile.name || "Verified Candidate"}</h2>
                    <p className="font-mono text-sm text-gray-500">{mockDid}</p>
                 </div>

                 <div className="flex gap-2">
                    {profile.githubUrl && (
                        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-dark-bg border border-dark-border rounded hover:border-white text-gray-300 hover:text-white transition-all">
                            <Github className="h-4 w-4" />
                        </a>
                    )}
                    {profile.linkedinUrl && (
                        <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-dark-bg border border-dark-border rounded hover:border-blue-400 text-gray-300 hover:text-blue-400 transition-all">
                            <Linkedin className="h-4 w-4" />
                        </a>
                    )}
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-dark-bg/50 p-4 rounded-lg border border-dark-border">
                       <p className="text-xs text-gray-400 mb-1">Overall Trust Score</p>
                       <p className="text-2xl font-bold text-neon-green">{profile.overallTrustScore}%</p>
                    </div>
                     <div className="bg-dark-bg/50 p-4 rounded-lg border border-dark-border">
                       <p className="text-xs text-gray-400 mb-1">Top Skills Verified</p>
                       <p className="text-lg font-bold text-white truncate">
                          {profile.skills.slice(0, 2).map(s => s.name).join(', ')}
                          {profile.skills.length > 2 && '...'}
                       </p>
                    </div>
                 </div>

                 <div className="flex gap-3">
                    <button 
                       onClick={handleShare}
                       className="flex-1 py-2.5 bg-cardano text-white rounded-lg font-medium hover:bg-cardano-light transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                       <Share2 className="h-4 w-4" /> Share Identity
                    </button>
                    <button 
                       onClick={handleCopy}
                       className="flex-1 py-2.5 bg-dark-bg border border-dark-border text-gray-300 rounded-lg font-medium hover:text-white hover:border-gray-500 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                       <Copy className="h-4 w-4" /> Copy DID
                    </button>
                 </div>
              </div>
           </div>
        </div>
     );
  };

  const renderCertificateModal = ({ cert, onClose }: { cert: Certificate; onClose: () => void }) => {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="bg-gradient-to-r from-cardano-dark to-dark-card p-6 border-b border-dark-border">
            <div className="h-12 w-12 bg-dark-bg rounded-lg flex items-center justify-center mb-4 border border-dark-border/50">
              <Award className="h-6 w-6 text-neon-green" />
            </div>
            <h3 className="text-2xl font-bold text-white leading-tight">{cert.name}</h3>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block flex items-center gap-1">
                  <Building className="h-3 w-3" /> Issuer
                </label>
                <p className="text-gray-200 font-medium">{cert.issuer}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Date Issued
                </label>
                <p className="text-gray-200 font-medium">{cert.date}</p>
              </div>
            </div>

            {cert.details && (
                <div className="bg-dark-bg p-4 rounded-xl border border-dark-border">
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Details
                  </label>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {cert.details}
                  </p>
                </div>
            )}

            <div className="bg-dark-bg p-4 rounded-xl border border-dark-border">
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Validation Status</label>
              
              <div className="flex items-center gap-3 mb-2">
                {cert.validationStatus === 'Verified' ? (
                  <span className="flex items-center text-sm font-bold text-neon-green bg-neon-green/10 px-3 py-1.5 rounded-full border border-neon-green/20">
                    <CheckCircle className="w-4 h-4 mr-2" /> REAL - Authenticity Verified
                  </span>
                ) : cert.validationStatus === 'Invalid' ? (
                  <span className="flex items-center text-sm font-bold text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                    <X className="w-4 h-4 mr-2" /> FAKE - Verification Failed
                  </span>
                ) : (
                  <span className="flex items-center text-sm font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                    <AlertCircle className="w-4 h-4 mr-2" /> Verification Pending
                  </span>
                )}
              </div>

              {cert.validationStatus === 'Verified' && (
                <div className="mt-4 pt-4 border-t border-dark-border space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Credential ID</span>
                    <span className="text-gray-300 font-mono">{cert.credentialId || 'N/A'}</span>
                  </div>
                   <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Blockchain Hash</span>
                    <span className="text-neon-green font-mono cursor-pointer hover:underline truncate max-w-[200px]">
                      {cert.blockchainHash || 'N/A'}
                    </span>
                  </div>
                  <div className="mt-4">
                    <a 
                      href={cert.blockchainHash ? `https://cardanoscan.io/transaction/${cert.blockchainHash}` : '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-dark-bg border border-dark-border hover:border-cardano-light hover:text-white text-gray-300 py-2.5 rounded-lg text-xs font-bold transition-all group"
                    >
                      <Share2 className="h-3 w-3 group-hover:text-neon-green transition-colors" /> View on CardanoScan
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCandidateView = () => {
    const skillsByCategory = analysisResult ? analysisResult.skills.reduce((acc, skill) => {
      const cat = skill.category || 'Uncategorized';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>) : {};

    return (
      <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto">
        {selectedCertificate && renderCertificateModal({cert: selectedCertificate, onClose: () => setSelectedCertificate(null)})}
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <User className="text-neon-green" /> Candidate Portal
          </h2>
          <p className="text-gray-400 mt-2">
            {currentUserId ? `Welcome back, ${analysisResult?.name || currentUserId}` : "Upload your resume to generate your Skill Identity."}
          </p>
          <div className="mt-4 flex flex-col md:flex-row gap-2 max-w-xl">
              <input 
                  type="text" 
                  placeholder="Already Verified? Retrieve Profile by DID / Wallet"
                  value={candidateSearchTerm}
                  onChange={(e) => setCandidateSearchTerm(e.target.value)}
                  className="flex-1 bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-white text-sm focus:ring-2 focus:ring-cardano-light outline-none"
              />
              <button 
                  onClick={handleCandidateRetrieval}
                  className="bg-cardano/80 hover:bg-cardano text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                  Retrieve
              </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-dark-card p-6 rounded-xl border border-dark-border space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Resume / Image</label>
              <div className={`relative border-2 border-dashed ${fileError ? 'border-red-500 bg-red-500/10' : 'border-dark-border hover:border-neon-green bg-dark-bg/50'} rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors`}>
                {!previewUrl ? (
                   <>
                      <div className="bg-dark-card p-3 rounded-full mb-3">
                        <Upload className={`h-6 w-6 ${fileError ? 'text-red-400' : 'text-gray-400'}`} />
                      </div>
                      <p className={`text-sm ${fileError ? 'text-red-300' : 'text-gray-400'} mb-1`}>Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF</p>
                      <input 
                        type="file" 
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                   </>
                ) : (
                   <div className="relative w-full">
                      {selectedFile?.type === 'application/pdf' ? (
                          <div className="h-48 w-full flex flex-col items-center justify-center bg-dark-bg rounded-md border border-dark-border">
                              <FileText className="h-16 w-16 text-red-400 mb-2" />
                              <span className="text-sm text-gray-300 font-medium px-4 text-center truncate w-full">{selectedFile.name}</span>
                              <span className="text-xs text-gray-500 mt-1">PDF Document</span>
                          </div>
                      ) : (
                          <img src={previewUrl} alt="Preview" className="h-48 w-full object-contain rounded-md" />
                      )}
                      <button 
                        onClick={clearFile}
                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors z-10"
                      >
                         <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white flex items-center z-10">
                         {selectedFile?.type === 'application/pdf' ? <FileText className="h-3 w-3 mr-1" /> : <ImageIcon className="h-3 w-3 mr-1" />} 
                         <span className="truncate max-w-[200px]">{selectedFile?.name}</span>
                      </div>
                   </div>
                )}
              </div>
              {fileError && (
                <p className="text-xs text-red-500 mt-2 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> {fileError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Or Paste Text</label>
              <textarea 
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full h-64 bg-dark-bg border border-dark-border rounded-lg p-4 text-gray-200 focus:ring-2 focus:ring-neon-green focus:border-transparent font-mono text-sm"
                placeholder="Paste your resume content here..."
              />
            </div>
            
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">GitHub URL (Optional)</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={githubInput}
                            onChange={(e) => setGithubInput(e.target.value)}
                            placeholder="github.com/username"
                            className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 pl-9 pr-3 text-white text-xs focus:ring-1 focus:ring-neon-green outline-none"
                        />
                        <Github className="absolute left-3 top-2.5 h-3 w-3 text-gray-500" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 ml-1">LinkedIn URL (Optional)</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={linkedinInput}
                            onChange={(e) => setLinkedinInput(e.target.value)}
                            placeholder="linkedin.com/in/username"
                            className="w-full bg-dark-bg border border-dark-border rounded-lg py-2 pl-9 pr-3 text-white text-xs focus:ring-1 focus:ring-neon-green outline-none"
                        />
                        <Linkedin className="absolute left-3 top-2.5 h-3 w-3 text-gray-500" />
                    </div>
                 </div>
             </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`flex-1 py-3 rounded-lg font-bold text-dark-bg transition-all flex justify-center items-center ${isAnalyzing ? 'bg-gray-500 cursor-not-allowed' : 'bg-neon-green hover:bg-neon-hover'}`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark-bg mr-2"></div>
                    AI Analyzing...
                  </>
                ) : (
                  <>
                    <Cpu className="mr-2 h-5 w-5" /> Analyze Skills
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {analysisResult ? (
              <>
                <div className="bg-dark-card p-6 rounded-xl border border-dark-border relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/10 rounded-full filter blur-2xl -mr-10 -mt-10"></div>
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Overall Trust Score</h3>
                      <p className="text-sm text-gray-400 mt-1">{analysisResult.summary}</p>
                      
                      {(analysisResult.githubUrl || analysisResult.linkedinUrl) && (
                        <div className="flex gap-2 mt-3">
                            {analysisResult.githubUrl && (
                                <a href={analysisResult.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-dark-bg border border-dark-border px-2 py-1 rounded transition-colors">
                                    <Github className="h-3 w-3" /> GitHub
                                </a>
                            )}
                            {analysisResult.linkedinUrl && (
                                <a href={analysisResult.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400 bg-dark-bg border border-dark-border px-2 py-1 rounded transition-colors">
                                    <Linkedin className="h-3 w-3" /> LinkedIn
                                </a>
                            )}
                        </div>
                      )}
                    </div>
                    <div className="text-4xl font-bold text-neon-green">
                      {analysisResult.overallTrustScore}%
                    </div>
                  </div>
                </div>

                <div className="bg-dark-card p-6 rounded-xl border border-dark-border">
                  <h3 className="text-lg font-semibold text-white mb-4">Top Detected Skills</h3>
                  <SkillChart skills={analysisResult.skills} limit={isChartExpanded ? 0 : 7} />
                  
                  {analysisResult.skills.length > 7 && (
                    <button 
                      onClick={() => setIsChartExpanded(!isChartExpanded)}
                      className="mt-4 w-full py-2 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-white bg-dark-bg/50 hover:bg-dark-bg border border-transparent hover:border-dark-border rounded-lg transition-all"
                    >
                      {isChartExpanded ? (
                        <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></>
                      ) : (
                        <>View All {analysisResult.skills.length} Skills <ChevronDown className="ml-2 h-4 w-4" /></>
                      )}
                    </button>
                  )}
                </div>

                <div className="bg-dark-card p-6 rounded-xl border border-dark-border">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-cardano-light" /> 
                        Skills Breakdown
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(skillsByCategory).map(([category, skills]) => (
                            <div key={category} className="border border-dark-border rounded-lg overflow-hidden">
                                <button 
                                    onClick={() => toggleCategory(category)}
                                    className="w-full flex items-center justify-between p-4 bg-dark-bg hover:bg-dark-border/50 transition-colors"
                                >
                                    <span className="font-medium text-white flex items-center gap-2">
                                        {category} 
                                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{skills.length}</span>
                                    </span>
                                    {expandedCategories[category] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                                </button>
                                
                                {expandedCategories[category] && (
                                    <div className="p-4 bg-dark-bg/50 border-t border-dark-border space-y-3">
                                        {skills.map((skill, idx) => (
                                            <div key={idx} className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-200">{skill.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{skill.evidence}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${skill.confidenceScore > 80 ? 'bg-neon-green' : skill.confidenceScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                            style={{ width: `${skill.confidenceScore}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-mono text-gray-400 w-8 text-right">{skill.confidenceScore}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {analysisResult.certificates && analysisResult.certificates.length > 0 && (
                  <div className="bg-dark-card p-6 rounded-xl border border-dark-border">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Award className="text-yellow-400 h-5 w-5" /> Verified Credentials
                    </h3>
                    <div className="space-y-3">
                      {analysisResult.certificates.map((cert, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedCertificate(cert)}
                          className="bg-dark-bg p-3 rounded-lg flex items-center justify-between border border-dark-border hover:border-cardano-light cursor-pointer transition-colors group"
                        >
                            <div>
                              <p className="text-sm font-semibold text-white group-hover:text-cardano-light transition-colors">{cert.name}</p>
                              <p className="text-xs text-gray-400">{cert.issuer} • {cert.date}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {cert.validationStatus === 'Verified' && (
                                  <div className="flex items-center gap-2">
                                    <span className="flex items-center text-xs font-bold text-neon-green bg-neon-green/10 px-2 py-1 rounded-full border border-neon-green/20">
                                      <CheckCircle className="w-3 h-3 mr-1" /> REAL (Verified)
                                    </span>
                                    {cert.blockchainHash && (
                                       <a 
                                         href={`https://cardanoscan.io/transaction/${cert.blockchainHash}`}
                                         target="_blank"
                                         rel="noopener noreferrer" 
                                         onClick={(e) => e.stopPropagation()}
                                         className="text-gray-500 hover:text-cardano-light transition-colors"
                                         title="View Proof on Chain"
                                       >
                                          <ExternalLink className="h-3 w-3" />
                                       </a>
                                    )}
                                  </div>
                                )}
                                {cert.validationStatus === 'Invalid' && (
                                    <span className="flex items-center text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                                      <X className="w-3 h-3 mr-1" /> FAKE (Invalid)
                                    </span>
                                )}
                                {cert.validationStatus === 'Pending' && (
                                    <span className="flex items-center text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20">
                                      <AlertCircle className="w-3 h-3 mr-1" /> Pending
                                    </span>
                                )}

                                <button 
                                  onClick={(e) => handleVerifyCertificate(idx, e)}
                                  disabled={verifyingCertIndex === idx}
                                  className={`flex items-center text-xs px-3 py-1.5 rounded transition-all z-10 relative border border-dark-border ${
                                      cert.validationStatus === 'Pending' 
                                      ? 'bg-dark-border hover:bg-gray-700 text-neon-green hover:text-white' 
                                      : 'text-gray-500 hover:text-white hover:bg-dark-border'
                                  }`}
                                  title={cert.validationStatus === 'Pending' ? "Verify on Chain" : "Re-verify"}
                                >
                                   {verifyingCertIndex === idx ? (
                                       <RefreshCw className="w-3 h-3 animate-spin mr-1" /> 
                                   ) : (
                                       cert.validationStatus === 'Pending' ? <ExternalLink className="w-3 h-3 mr-1" /> : <RefreshCw className="w-3 h-3 mr-1" />
                                   )}
                                   {verifyingCertIndex === idx ? 'Checking...' : (cert.validationStatus === 'Pending' ? 'Verify' : 'Re-verify')}
                                </button>
                            </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {!mintedTxHash && (
                    <div className="bg-dark-card p-6 rounded-xl border border-dark-border">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                           <FileKey className="text-purple-400 h-5 w-5" /> Privacy & Zero-Knowledge Proofs
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                           Generate a ZK proof to verify your skills without revealing your personal resume data. 
                           Powered by Midnight Network integration.
                        </p>
                        
                        {!zkProof ? (
                             <button 
                                onClick={handleGenerateZK}
                                disabled={isGeneratingZK}
                                className={`w-full py-3 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-medium transition-all flex justify-center items-center ${isGeneratingZK ? 'opacity-75 cursor-not-allowed' : ''}`}
                             >
                                {isGeneratingZK ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-400 border-t-transparent mr-2"></div>
                                        Generating ZK-SNARK...
                                    </>
                                ) : (
                                    <>
                                        <EyeOff className="h-4 w-4 mr-2" /> Generate Midnight ZK Proofs
                                    </>
                                )}
                             </button>
                        ) : (
                            <div className="space-y-4 animate-fade-in">
                                <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg flex items-center justify-between shadow-lg shadow-green-900/20">
                                    <span className="text-sm font-bold flex items-center"><Check className="h-5 w-5 mr-2" /> Zero-Knowledge Proof Generated Successfully</span>
                                </div>
                                
                                {(() => {
                                  try {
                                    const proofData = JSON.parse(zkProof);
                                    return (
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Verified Attributes Section */}
                                            <div className="bg-dark-bg p-4 rounded-lg border border-dark-border">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                                    <FileCheck className="h-3 w-3 mr-1" /> Verified Attributes
                                                </h4>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="bg-dark-card p-2 rounded border border-dark-border/50">
                                                        <span className="text-[10px] text-gray-500 block">Skills Count</span>
                                                        <span className="text-sm font-mono text-white">{proofData.verifiedAttributes.skills_count}</span>
                                                    </div>
                                                    <div className="bg-dark-card p-2 rounded border border-dark-border/50">
                                                        <span className="text-[10px] text-gray-500 block">Min Confidence</span>
                                                        <span className="text-sm font-mono text-neon-green">{proofData.verifiedAttributes.min_confidence}%</span>
                                                    </div>
                                                    <div className="bg-dark-card p-2 rounded border border-dark-border/50 col-span-2">
                                                        <span className="text-[10px] text-gray-500 block">Categories Present</span>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {proofData.verifiedAttributes.skill_categories_present.map((cat: string, i: number) => (
                                                                <span key={i} className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">{cat}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Public Signals Section */}
                                            <div className="bg-dark-bg p-4 rounded-lg border border-dark-border">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                                    <Hash className="h-3 w-3 mr-1" /> Public Signals
                                                </h4>
                                                <ul className="space-y-2">
                                                    {proofData.publicSignals.map((signal: string, i: number) => (
                                                        <li key={i} className="bg-dark-card p-2 rounded border border-dark-border/50 flex flex-col">
                                                            <span className="text-[10px] text-gray-500 mb-0.5">{signal.split(':')[0]}</span>
                                                            <span className="text-xs font-mono text-gray-300 truncate">{signal.split(':')[1]}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Cryptographic Proof Footer */}
                                        <div className="bg-dark-bg/50 p-3 rounded-lg border border-dark-border flex flex-col gap-1">
                                             <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-purple-400 font-mono">PROOF_DATA_COMMITMENT</span>
                                                <span className="text-[10px] text-gray-500 font-mono">{proofData.timestamp}</span>
                                             </div>
                                             <div className="font-mono text-[10px] text-gray-500 break-all bg-black/20 p-2 rounded">
                                                {proofData.proof}
                                             </div>
                                        </div>
                                      </div>
                                    );
                                  } catch (e) {
                                    return <pre className="text-xs text-red-400">Error parsing proof data</pre>
                                  }
                                })()}
                            </div>
                        )}
                    </div>
                )}

                {!mintedTxHash ? (
                  <button 
                    onClick={handleMint}
                    disabled={isMinting}
                    className={`w-full py-4 rounded-xl font-bold text-white border border-cardano-light bg-cardano hover:bg-cardano-light transition-all flex justify-center items-center shadow-lg ${isMinting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isMinting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Minting Skill NFT...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-5 w-5" /> Mint {zkProof ? 'with ZK Proof' : 'to Cardano'}
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="w-full py-4 rounded-xl bg-neon-green/10 border border-neon-green flex flex-col items-center justify-center text-neon-green animate-pulse">
                      <div className="flex items-center font-bold text-lg mb-1">
                        <CheckCircle className="mr-2 h-6 w-6" /> Mint Successful!
                      </div>
                       <p className="text-xs text-gray-400">Profile saved to ledger. Employers can now verify you.</p>
                      <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono opacity-70 text-gray-400">
                             Tx: {mintedTxHash.substring(0, 16)}...
                          </span>
                          <a 
                              href={`https://cardanoscan.io/transaction/${mintedTxHash}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center text-xs font-bold hover:text-white underline decoration-dotted underline-offset-2 transition-colors gap-1"
                          >
                              View on CardanoScan <ExternalLink className="h-3 w-3" />
                          </a>
                      </div>
                    </div>
                    {renderIdentityCard({ profile: analysisResult, txHash: mintedTxHash })}
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4 border border-dashed border-dark-border rounded-xl p-12 bg-dark-card/50">
                <div className="p-4 bg-dark-bg rounded-full">
                   <Scroll className="h-12 w-12 text-gray-600" />
                </div>
                <p>Upload a resume or paste text to see the AI verification in action.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderEmployerView = () => {
    const uniqueTags = Array.from(new Set(foundProfiles.flatMap(p => [
        ...p.skills.map(s => s.name),
        ...p.skills.map(s => s.category)
    ]))).sort();

    const toggleSkillFilter = (tag: string) => {
        setSelectedSkillFilters(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const sortedAndFilteredProfiles = foundProfiles
        .filter(p => {
            if (filterStatus === 'verified' && !p.isVerified) return false;
            if (filterStatus === 'unverified' && p.isVerified) return false;
            
            if (selectedSkillFilters.length > 0) {
                const profileTags = new Set([
                    ...p.skills.map(s => s.name),
                    ...p.skills.map(s => s.category)
                ]);
                const hasAllTags = selectedSkillFilters.every(tag => profileTags.has(tag));
                if (!hasAllTags) return false;
            }

            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'date') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            return 0;
        });

    return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Briefcase className="text-cardano-light" /> Employer Dashboard
        </h2>
        <p className="text-gray-400 mt-2">Verify candidate claims instantly using their DID or Skill NFT.</p>
      </div>

      {renderDashboardStats()}

      <div className="bg-dark-card p-8 rounded-xl border border-dark-border shadow-2xl mb-8">
        <div className="max-w-3xl mx-auto">
          <label className="block text-sm font-medium text-gray-300 mb-2">Search Candidate</label>
          <div className="flex gap-2 relative" ref={searchContainerRef}>
            <div className="relative flex-1">
              <input 
                type="text" 
                value={searchDid}
                onChange={handleInputChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Enter Candidate DID, Wallet Address, or Name"
                className="w-full bg-dark-bg border border-dark-border rounded-lg py-3 pl-12 pr-24 text-white focus:ring-2 focus:ring-cardano-light focus:border-transparent outline-none"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
              
              <div className="absolute right-2 top-2 flex gap-1">
                {searchDid && (
                    <button 
                      onClick={handleClearSearch}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                      title="Clear Search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                )}
                <button
                  onClick={handleScanQR}
                  className="p-1.5 text-neon-green hover:bg-neon-green/10 rounded-md transition-colors"
                  title="Scan QR Code"
                >
                  <QrCode className="h-5 w-5" />
                </button>
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-dark-card border border-dark-border rounded-lg shadow-xl z-50 overflow-hidden">
                    {suggestions.map((s, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSearch(s)}
                        className="w-full text-left px-4 py-3 hover:bg-dark-border/50 flex items-center justify-between group transition-colors"
                    >
                        <div>
                        <p className="font-bold text-white group-hover:text-cardano-light transition-colors">{s.name}</p>
                        <p className="text-xs text-gray-500 font-mono">{s.did}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-neon-green" />
                    </button>
                    ))}
                </div>
               )}
            </div>
            <button 
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="bg-cardano hover:bg-cardano-light text-white px-8 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSearching ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : 'Search'}
            </button>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              {searchError ? <span className="text-red-400">No candidates found with that DID.</span> : "Press Search to view all candidates or enter a specific DID."}
            </p>
            {isScanning && <span className="text-xs text-neon-green animate-pulse flex items-center"><ScanLine className="h-3 w-3 mr-1"/> Camera Active... Scanning...</span>}
          </div>
        </div>
      </div>

      {foundProfiles.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 p-4 bg-dark-bg/50 rounded-lg border border-dark-border">
            <div className="flex items-center gap-2">
               <span className="text-sm text-gray-400 font-medium">Found {foundProfiles.length} candidates</span>
            </div>
            <div className="flex items-center gap-4">
                {/* Skill Filter Dropdown */}
                 <div className="relative" ref={skillFilterRef}>
                    <button 
                        onClick={() => setIsSkillFilterOpen(!isSkillFilterOpen)}
                        className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border transition-colors ${selectedSkillFilters.length > 0 ? 'bg-cardano/20 border-cardano text-cardano-light' : 'bg-dark-bg border-dark-border text-gray-300 hover:border-gray-500'}`}
                    >
                        <Filter className="h-4 w-4" /> 
                        {selectedSkillFilters.length > 0 ? `${selectedSkillFilters.length} Filters` : 'Filter Skills'}
                        <ChevronDown className="h-3 w-3" />
                    </button>
                    {isSkillFilterOpen && (
                         <div className="absolute right-0 top-full mt-2 w-64 bg-dark-card border border-dark-border rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                            <div className="p-2 grid gap-1">
                                {uniqueTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => toggleSkillFilter(tag)}
                                        className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center justify-between ${selectedSkillFilters.includes(tag) ? 'bg-neon-green/10 text-neon-green' : 'text-gray-300 hover:bg-dark-border/50'}`}
                                    >
                                        {tag}
                                        {selectedSkillFilters.includes(tag) && <Check className="h-3 w-3" />}
                                    </button>
                                ))}
                            </div>
                         </div>
                    )}
                 </div>

                 {/* Sort Dropdown */}
                 <div className="flex items-center bg-dark-bg border border-dark-border rounded-lg p-1">
                    <button 
                        onClick={() => setSortBy('date')}
                        className={`px-3 py-1 text-xs font-medium rounded ${sortBy === 'date' ? 'bg-dark-card text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Date
                    </button>
                    <button 
                        onClick={() => setSortBy('name')}
                         className={`px-3 py-1 text-xs font-medium rounded ${sortBy === 'name' ? 'bg-dark-card text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Name
                    </button>
                 </div>
            </div>
        </div>
      )}

      {selectedSkillFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
            {selectedSkillFilters.map(filter => (
                <span key={filter} className="flex items-center gap-1 bg-cardano/10 text-cardano-light border border-cardano/20 px-2 py-1 rounded text-xs font-medium">
                    {filter}
                    <button onClick={() => toggleSkillFilter(filter)} className="hover:text-white"><X className="h-3 w-3" /></button>
                </span>
            ))}
            <button onClick={() => setSelectedSkillFilters([])} className="text-xs text-gray-500 hover:text-white underline ml-2">Clear all</button>
        </div>
      )}

      <div className="space-y-6 mt-6">
        {sortedAndFilteredProfiles.map((profile, index) => (
             <div key={index} className="bg-dark-card p-6 rounded-xl border border-dark-border hover:border-cardano-light transition-all animate-fade-in">
                 {/* Profile Card Content - Simplified version of Candidate View stats */}
                 <div className="flex flex-col md:flex-row justify-between gap-6">
                     <div>
                         <div className="flex items-center gap-3 mb-1">
                             <h3 className="text-2xl font-bold text-white">{profile.name}</h3>
                             {profile.isVerified ? (
                                <span className="flex items-center text-xs font-bold text-neon-green bg-neon-green/10 px-2 py-1 rounded-full border border-neon-green/20">
                                  <ShieldCheck className="w-3 h-3 mr-1" /> Identity Verified
                                </span>
                             ) : (
                                <span className="flex items-center text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                                   <AlertCircle className="w-3 h-3 mr-1" /> Identity Unverified
                                </span>
                             )}
                         </div>
                         <div className="flex items-center gap-2 text-gray-400 font-mono text-sm mt-1">
                             <span className="bg-dark-bg px-2 py-0.5 rounded border border-dark-border">{profile.did}</span>
                             <a 
                               href={`https://cardanoscan.io/token/${profile.did.replace('did:cardano:', '')}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="text-gray-500 hover:text-cardano-light transition-colors"
                               title="View DID on Chain"
                             >
                               <ExternalLink className="h-3 w-3" />
                             </a>
                             {profile.githubUrl && (
                                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" title="GitHub">
                                    <Github className="h-3 w-3" />
                                </a>
                             )}
                             {profile.linkedinUrl && (
                                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors" title="LinkedIn">
                                    <Linkedin className="h-3 w-3" />
                                </a>
                             )}
                         </div>
                     </div>
                     <div className="flex gap-4">
                         <div className="text-center">
                             <p className="text-xs text-gray-500 uppercase">Trust Score</p>
                             <p className="text-2xl font-bold text-neon-green">92%</p>
                         </div>
                         <div className="text-center">
                             <p className="text-xs text-gray-500 uppercase">Skills</p>
                             <p className="text-2xl font-bold text-white">{profile.skills.length}</p>
                         </div>
                     </div>
                 </div>
                 
                 <div className="mt-6 pt-6 border-t border-dark-border grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                         <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"><Layers className="h-4 w-4"/> Key Skills</h4>
                         <div className="flex flex-wrap gap-2">
                             {profile.skills.slice(0, 5).map((skill, idx) => (
                                 <div key={idx} className="bg-dark-bg border border-dark-border rounded px-2 py-1 text-xs text-gray-300 flex items-center gap-1">
                                     {skill.name}
                                     <span className={`w-2 h-2 rounded-full ${skill.confidenceScore > 80 ? 'bg-neon-green' : 'bg-yellow-500'}`}></span>
                                 </div>
                             ))}
                             {profile.skills.length > 5 && <span className="text-xs text-gray-500 py-1">+{profile.skills.length - 5} more</span>}
                         </div>
                     </div>
                     <div>
                         <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"><Award className="h-4 w-4"/> Certificates</h4>
                         <div className="space-y-2">
                             {profile.certificates.map((cert, idx) => (
                                 <div key={idx} className="flex justify-between items-center text-xs bg-dark-bg/50 p-2 rounded border border-dark-border/50">
                                     <span className="text-gray-300 truncate max-w-[200px]">{cert.name}</span>
                                     {cert.validationStatus === 'Verified' ? (
                                         <div className="flex items-center gap-2">
                                            <span className="text-neon-green flex items-center gap-1"><CheckCircle className="h-3 w-3"/> REAL (Verified)</span>
                                            {cert.blockchainHash && (
                                                <a 
                                                    href={`https://cardanoscan.io/transaction/${cert.blockchainHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-500 hover:text-cardano-light transition-colors"
                                                    title="View Verification on CardanoScan"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}
                                         </div>
                                     ) : (
                                         <span className="text-red-400 flex items-center gap-1"><X className="h-3 w-3"/> FAKE (Invalid)</span>
                                     )}
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>
             </div>
        ))}
        {foundProfiles.length === 0 && !isSearching && searchDid && !searchError && (
             <div className="text-center py-12 border border-dashed border-dark-border rounded-xl">
                 <p className="text-gray-500">No candidates found. Try searching for "Anil" or "did:cardano".</p>
             </div>
        )}
      </div>
    </div>
    );
  };
  
  // ... rest of renderNavbar and main return block ...
  // Re-including the navbar and return block which are unchanged but part of the file

  const renderNavbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => handleNavigate(AppView.LANDING)}
          >
            <div className="bg-cardano p-2 rounded-lg group-hover:bg-cardano-light transition-colors">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
               <h1 className="text-xl font-bold text-white tracking-tight">SkillChain</h1>
               <p className="text-[10px] text-gray-400 font-mono">ON CARDANO</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <button 
                onClick={() => handleNavigate(AppView.LANDING)}
                className={`text-sm font-medium transition-colors ${currentView === AppView.LANDING ? 'text-neon-green' : 'text-gray-400 hover:text-white'}`}
            >
                Home
            </button>
            <button 
                onClick={() => handleNavigate(AppView.CANDIDATE)}
                className={`text-sm font-medium transition-colors ${currentView === AppView.CANDIDATE ? 'text-neon-green' : 'text-gray-400 hover:text-white'}`}
            >
                Candidate Portal
            </button>
            <button 
                onClick={() => handleNavigate(AppView.EMPLOYER)}
                className={`text-sm font-medium transition-colors ${currentView === AppView.EMPLOYER ? 'text-neon-green' : 'text-gray-400 hover:text-white'}`}
            >
                Employer Dashboard
            </button>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
                 <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 hidden md:block">
                        {userRole === 'candidate' ? (analysisResult?.did ? `DID: ${analysisResult.did.substring(0, 12)}...` : 'Candidate') : 'Employer Mode'}
                    </span>
                    <button 
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                 </div>
            ) : (
                <button 
                    onClick={() => setCurrentView(AppView.LOGIN)}
                    className="hidden md:flex bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                    Login
                </button>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark-card border-b border-dark-border">
          <div className="px-4 py-2 space-y-1">
            <button 
              onClick={() => handleNavigate(AppView.LANDING)}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-dark-border/50 rounded-md"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigate(AppView.CANDIDATE)}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-dark-border/50 rounded-md"
            >
              Candidate Portal
            </button>
             <button 
              onClick={() => handleNavigate(AppView.EMPLOYER)}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-dark-border/50 rounded-md"
            >
              Employer Dashboard
            </button>
            {!isLoggedIn && (
                <button 
                    onClick={() => {
                        setCurrentView(AppView.LOGIN);
                        setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-neon-green hover:bg-dark-border/50 rounded-md"
                >
                    Login
                </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );

  const LoginView = () => (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cardano/20 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-green/10 rounded-full blur-[96px] pointer-events-none"></div>
        
        <div className="w-full max-w-md bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-8 relative z-10 animate-fade-in">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-4 bg-dark-bg rounded-xl border border-dark-border mb-4">
                    <Database className="h-8 w-8 text-cardano-light" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400">Sign in to SkillChain Portal</p>
            </div>

            <div className="flex bg-dark-bg p-1 rounded-lg mb-8 border border-dark-border">
                <button 
                    onClick={() => setUserRole('candidate')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${userRole === 'candidate' ? 'bg-dark-card text-white shadow-sm border border-dark-border' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Candidate
                </button>
                <button 
                    onClick={() => setUserRole('employer')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${userRole === 'employer' ? 'bg-dark-card text-white shadow-sm border border-dark-border' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Employer
                </button>
            </div>
            
            <div className="space-y-4">
                 {userRole === 'candidate' ? (
                     <>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2 ml-1">Connect Wallet or Enter DID</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Enter Name or DID (e.g. Anil)"
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-cardano-light focus:border-transparent outline-none"
                                    id="candidate-login-input"
                                />
                                <Wallet className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                const input = (document.getElementById('candidate-login-input') as HTMLInputElement).value;
                                handleLogin('candidate', input || 'Guest Candidate');
                            }}
                            className="w-full py-3 bg-cardano hover:bg-cardano-light text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Wallet className="h-5 w-5" /> Connect Wallet
                        </button>
                        <p className="text-xs text-center text-gray-500 mt-2">Supports Nami, Eternl, Flint</p>
                     </>
                 ) : (
                     <>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2 ml-1">Corporate Credentials</label>
                            <div className="space-y-3">
                                <div className="relative">
                                    <input type="email" placeholder="work@company.com" className="w-full bg-dark-bg border border-dark-border rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-neon-green focus:border-transparent outline-none" />
                                    <Briefcase className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                                </div>
                                <div className="relative">
                                    <input type="password" placeholder="••••••••" className="w-full bg-dark-bg border border-dark-border rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-neon-green focus:border-transparent outline-none" />
                                    <Key className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                                </div>
                            </div>
                        </div>
                        <button 
                             onClick={() => handleLogin('employer', 'TechRecruiter')}
                            className="w-full py-3 bg-neon-green hover:bg-neon-hover text-dark-bg font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            Login to Dashboard <ArrowRight className="h-5 w-5" />
                        </button>
                     </>
                 )}
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg text-white selection:bg-neon-green/30">
      {renderNavbar()}
      
      {currentView === AppView.LANDING && (
        <div className="relative">
          {/* Landing Page Content */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-cardano/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-neon-green/10 rounded-full blur-3xl"></div>
          </div>

          <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-card border border-dark-border mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
              <span className="text-xs font-medium text-gray-300">Live on Cardano Pre-Prod Testnet</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Trustless Resume Verification
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Eliminate fake credentials with <span className="text-neon-green font-semibold">AI-powered analysis</span> and <span className="text-cardano-light font-semibold">Blockchain immutability</span>. Built for the modern decentralized workforce.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => handleNavigate(AppView.CANDIDATE)}
                className="w-full sm:w-auto px-8 py-4 bg-neon-green hover:bg-neon-hover text-dark-bg font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-neon-green/20"
              >
                <Upload className="h-5 w-5" /> Verify My Resume
              </button>
              <button 
                onClick={() => handleNavigate(AppView.EMPLOYER)}
                className="w-full sm:w-auto px-8 py-4 bg-dark-card hover:bg-dark-border text-white font-bold rounded-xl border border-dark-border transition-all flex items-center justify-center gap-2"
              >
                <Search className="h-5 w-5" /> Verify Candidate
              </button>
            </div>
          </div>
          
          {/* Feature Grid */}
          <div className="py-20 bg-dark-card/30 border-t border-dark-border">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-dark-bg border border-dark-border rounded-xl hover:border-cardano-light/50 transition-colors group">
                <div className="w-12 h-12 bg-cardano/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Cpu className="h-6 w-6 text-cardano-light" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">AI Analysis</h3>
                <p className="text-gray-400">Advanced LLMs analyze context, experience, and project links to score skill credibility automatically.</p>
              </div>
              <div className="p-6 bg-dark-bg border border-dark-border rounded-xl hover:border-neon-green/50 transition-colors group">
                <div className="w-12 h-12 bg-neon-green/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Database className="h-6 w-6 text-neon-green" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">On-Chain Proof</h3>
                <p className="text-gray-400">Verified skills are minted as NFTs on Cardano, creating a portable, tamper-proof professional identity.</p>
              </div>
              <div className="p-6 bg-dark-bg border border-dark-border rounded-xl hover:border-purple-400/50 transition-colors group">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <EyeOff className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Zero-Knowledge</h3>
                <p className="text-gray-400">Prove you have the skills without revealing your personal data using Midnight Network ZK proofs.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === AppView.LOGIN && <LoginView />}
      {currentView === AppView.CANDIDATE && renderCandidateView()}
      {currentView === AppView.EMPLOYER && renderEmployerView()}
    </div>
  );
};

export default App;