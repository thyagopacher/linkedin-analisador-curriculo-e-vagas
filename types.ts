
export interface JobFound {
  title: string;
  company: string;
  location: string;
  url: string;
}

export interface LinkedInAnalysis {
  profileSummary: string;
  detectedRole?: string;
  detectedCompany?: string;
  matchScore: number;
  bestJobMatch: JobFound;
  otherJobsFound: JobFound[];
  strengths: string[];
  gaps: string[];
  suggestedSkills: string[];
  profileImprovements: {
    section: string;
    currentIssue: string;
    suggestion: string;
    example: string;
  }[];
  overallVerdict: string;
  sources: { uri: string; title: string }[];
}

export interface AnalysisRequest {
  linkedinUrl: string;
}
