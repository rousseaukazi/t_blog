export const jobRoles = [
  "Retail Salespersons",
  "Fast Food and Counter Workers",
  "Cashiers",
  "General and Operations Managers",
  "Registered Nurses",
  "Stockers and Order Fillers",
  "Laborers and Freight, Stock, and Material Movers, Hand",
  "Customer Service Representatives",
  "Office Clerks, General",
  "Waiters and Waitresses",
  "Janitors and Cleaners",
  "Heavy and Tractor-Trailer Truck Drivers",
  "Elementary School Teachers",
  "Software Developers",
  "Miscellaneous Assemblers and Fabricators",
  "Accountants and Auditors",
  "Nursing Assistants",
  "Cooks, Restaurant",
  "Security Guards",
  "First-Line Supervisors of Sales Workers",
  "Administrative Services Managers",
  "Construction Laborers",
  "Light Truck Drivers",
  "Landscaping and Groundskeeping Workers",
  "Automotive Service Technicians and Mechanics",
  "Maids and Housekeeping Cleaners",
  "Medical Assistants",
  "Business Operations Specialists",
  "Electricians",
  "Bartenders",
  "Industrial Truck and Tractor Operators",
  "Carpenters",
  "Cooks, Fast Food",
  "Middle School Teachers",
  "Packers and Packagers, Hand",
  "Childcare Workers",
  "Pharmacy Technicians",
  "First-Line Supervisors of Food Preparation and Serving Workers",
  "Postal Service Mail Carriers",
  "Bus Drivers, School",
  "Maintenance and Repair Workers, General",
  "Teaching Assistants",
  "Home Health and Personal Care Aides",
  "Dental Assistants",
  "Cleaners of Vehicles and Equipment",
  "Civil Engineers",
  "First-Line Supervisors of Construction Trades",
  "Pharmacists",
  "Nurse Practitioners",
  "Recreation Workers"
];

export interface AITool {
  name: string;
  category: string;
  description: string;
  bestFor: string[];
}

export const aiTools: AITool[] = [
  // Text Generation & Chat
  {
    name: "Perplexity (Sonar Models)",
    category: "Text Generation & Chat",
    description: "A web-connected AI chat platform that excels at real-time research and information retrieval. Uses sonar and sonar-pro models with advanced search capabilities, domain filtering, and recency controls.",
    bestFor: ["research", "current events", "fact-checking", "source citations"]
  },
  {
    name: "OpenAI Chat Models (GPT-3.5 through O4-Mini-High)",
    category: "Text Generation & Chat",
    description: "The industry-standard text generation suite spanning from efficient GPT-3.5-turbo to the cutting-edge O4 series. Includes reasoning models like O1 and O3 for complex problem-solving.",
    bestFor: ["creative writing", "code generation", "analytical reasoning", "long conversations"]
  },
  {
    name: "Anthropic Claude Models (Claude 3 through Claude 4)",
    category: "Text Generation & Chat",
    description: "Advanced conversational AI with strong reasoning capabilities, including Claude 4 Opus and Sonnet variants.",
    bestFor: ["nuanced conversations", "ethical reasoning", "complex multi-step problems", "long contexts"]
  },
  {
    name: "Google Gemini Models (1.0 through 2.5)",
    category: "Text Generation & Chat",
    description: "Google's multimodal AI family with text, image, and audio capabilities across Pro, Flash, and Ultra variants.",
    bestFor: ["multimodal understanding", "rapid inference", "Google ecosystem integration"]
  },
  
  // Speech & Audio Processing
  {
    name: "ElevenLabs Speech-to-Text (Scribe Models)",
    category: "Speech & Audio Processing",
    description: "High-accuracy transcription service with speaker diarization and multiple language support. Includes experimental models for cutting-edge features.",
    bestFor: ["audio transcription", "speaker identification", "precise timestamps"]
  },
  {
    name: "OpenAI Realtime Voice (GPT-4O Realtime)",
    category: "Speech & Audio Processing",
    description: "Real-time conversational AI with voice input/output, noise reduction, and customizable voices. Supports tool integration and turn detection.",
    bestFor: ["voice interactions", "conversational agents", "minimal latency"]
  },
  {
    name: "Google Realtime Voice (Gemini 2.0 Flash Live)",
    category: "Speech & Audio Processing",
    description: "Google's real-time speech processing with live conversation capabilities.",
    bestFor: ["low-latency voice interactions", "Google AI integration"]
  },
  {
    name: "ElevenLabs Realtime Talk",
    category: "Speech & Audio Processing",
    description: "Comprehensive voice agent platform combining TTS models (Flash, Turbo, Multilingual) with various LLMs. Supports multiple languages and custom voice configurations.",
    bestFor: ["voice agents", "personality customization", "knowledge base integration"]
  },
  
  // Audio Generation & Manipulation
  {
    name: "Wondercraft Audio Creation",
    category: "Audio Generation & Manipulation",
    description: "Podcast generation platform that creates full episodes from simple prompts or URLs.",
    bestFor: ["podcast production", "audio content creation"]
  },
  {
    name: "Google TTS (Gemini 2.5 Preview)",
    category: "Audio Generation & Manipulation",
    description: "Advanced text-to-speech with single and multi-speaker capabilities, featuring 30+ prebuilt voices with names like Zephyr, Puck, and Fenrir.",
    bestFor: ["natural speech synthesis", "character variety", "multiple speakers"]
  },
  {
    name: "Suno Music Generation (V3.5 through V4.5)",
    category: "Audio Generation & Manipulation",
    description: "Comprehensive music creation platform supporting song generation, audio extension, and cover creation. Includes style enhancement and custom/non-custom modes.",
    bestFor: ["original music creation", "track extension", "style consistency"]
  },
  {
    name: "ElevenLabs Audio Suite",
    category: "Audio Generation & Manipulation",
    description: "Multi-tool audio platform including voice dubbing, voice changing, sound effect generation, audio isolation, and custom voice creation from descriptions.",
    bestFor: ["audio manipulation", "voice content", "sound effects"]
  },
  
  // Video Generation
  {
    name: "Runway (Gen3A/Gen4 Turbo)",
    category: "Video Generation",
    description: "Professional video generation with text-to-video and image-to-video capabilities. Supports multiple aspect ratios and quality settings.",
    bestFor: ["cinematic content", "professional videos", "precise control"]
  },
  {
    name: "Kling Video Suite (V1 through V2-Master)",
    category: "Video Generation",
    description: "Comprehensive video platform offering text-to-video, image-to-video, video extension, and special effects. Includes camera controls and professional modes.",
    bestFor: ["video narratives", "footage extension", "special effects"]
  },
  {
    name: "Google Veo (Veo2/Veo3)",
    category: "Video Generation",
    description: "Google's video generation models with audio synthesis capabilities in Veo3. Supports multiple durations and aspect ratios with person generation controls.",
    bestFor: ["realistic video", "integrated audio", "immersive experiences"]
  },
  {
    name: "Luma Labs Dream Machine (Ray Models)",
    category: "Video Generation",
    description: "Unified API for text-to-video, image-to-video, and video extension with multiple quality options up to 4K.",
    bestFor: ["smooth video", "high quality", "motion consistency"]
  },
  {
    name: "Hailuo/MiniMax Video (T2V/I2V Director Models)",
    category: "Video Generation",
    description: "Advanced video generation with camera movement controls and prompt optimization. Supports subject reference for consistent character generation.",
    bestFor: ["camera work", "directorial control", "character consistency"]
  },
  
  // Specialized Video Tools
  {
    name: "Captions AI Video",
    category: "Specialized Video Tools",
    description: "Script-to-video platform that automatically creates engaging content from text scripts.",
    bestFor: ["script transformation", "video presentations"]
  },
  {
    name: "Creatify Marketing Videos",
    category: "Specialized Video Tools",
    description: "Style-specific video generation with options like 4K realistic, 3D, cinematic, and pixel art. Focused on marketing and promotional content.",
    bestFor: ["branded content", "marketing videos", "visual styles"]
  },
  {
    name: "Synthesia Avatar Videos",
    category: "Specialized Video Tools",
    description: "Professional avatar-based video creation with virtual presenters, backgrounds, and multilingual support.",
    bestFor: ["corporate training", "presentations", "digital humans"]
  },
  {
    name: "HeyGen Avatar & Translation",
    category: "Specialized Video Tools",
    description: "Dual-purpose platform for avatar video creation and video translation. Supports multilingual dubbing and custom avatar configuration.",
    bestFor: ["language barriers", "personalized videos", "translation"]
  },
  
  // Image Generation
  {
    name: "OpenAI Image Generation (GPT-Image-1)",
    category: "Image Generation",
    description: "Advanced image creation and editing with input image support, masking, and quality controls. Includes streaming generation for progressive loading.",
    bestFor: ["photorealistic images", "precise editing", "natural language prompts"]
  },
  {
    name: "Runway Frames (Gen4 Image)",
    category: "Image Generation",
    description: "High-quality image generation with reference image support and multiple aspect ratios.",
    bestFor: ["professional images", "artistic control", "style consistency"]
  },
  {
    name: "Google Imagen (3.0/4.0)",
    category: "Image Generation",
    description: "Google's image generation suite with multiple output options and aspect ratio controls.",
    bestFor: ["detailed imagery", "diverse content", "prompt adherence"]
  },
  {
    name: "Supermeme",
    category: "Image Generation",
    description: "Specialized meme generation platform that creates humorous content from text prompts.",
    bestFor: ["meme creation", "viral content", "humor"]
  },
  {
    name: "Midjourney (Versions 1-7 + Niji Anime Models)",
    category: "Image Generation",
    description: "Industry-leading artistic image generation with grid and upscaling options. Includes specialized anime models (Niji).",
    bestFor: ["artistic imagery", "stylized content", "aesthetic quality"]
  },
  {
    name: "Kling Virtual Try-On (Kolors Models)",
    category: "Image Generation",
    description: "Specialized fashion technology for trying on clothing virtually using human and garment images.",
    bestFor: ["fashion visualization", "e-commerce", "virtual clothing"]
  }
]; 