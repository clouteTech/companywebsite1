// Company knowledge for the website chat assistant (components/chatbot/). Every answer restates content already
// published on this website: the home page, About, the service pages, Products, Recruitment and Contact.
// Nothing here may add prices, projects, certifications or capabilities the site doesn't state; when the site has
// no answer, the assistant falls back to asking the visitor to contact the team.
//
// Each topic carries keywords in all four languages and a predefined answer per language. The Tamil, Hindi and
// Chinese texts are translations of the English answers and should be reviewed by a native speaker.
import { company } from "@/lib/site";
import copy from "@/content/chatbot.json";

export const languages = ["en", "ta", "hi", "zh"] as const;
export type Lang = (typeof languages)[number];
export type Localized = Record<Lang, string>;

export type TopicId =
  | "greeting"
  | "services"
  | "about"
  | "technologies"
  | "software"
  | "networking"
  | "support"
  | "managed"
  | "cyber"
  | "cloud"
  | "marketing"
  | "hardware"
  | "recruitment"
  | "contact"
  | "hours"
  | "location"
  | "projects"
  | "pricing"
  | "process"
  | "audience"
  | "leadership"
  | "enquiry"
  | "thanks";

export interface Topic {
  id: TopicId;
  /** Words and phrases, in any of the four languages, that point to this topic. */
  keywords: string[];
  /** Below 1 for broad topics (greetings, "services") so a more specific match wins. */
  weight?: number;
  /** Label for the quick-reply button that asks this question. */
  question?: Localized;
  answer: Localized;
  link?: { href: string; label: Localized };
  /** Quick replies offered after this answer. */
  followUps?: TopicId[];
}

const learnMore: Localized = { en: copy.knowledge.learnMore.en, ta: copy.knowledge.learnMore.ta, hi: copy.knowledge.learnMore.hi, zh: copy.knowledge.learnMore.zh };

/** Contact facts substituted into answers ({phone}, {sales}, {support}, {address}). */
export const facts = {
  phone: company.phone,
  sales: company.salesEmail,
  support: company.supportEmail,
  address: company.address,
};

export const topics: Topic[] = [
  {
    id: "greeting",
    weight: 0.5,
    keywords: ["hi", "hello", "hey", "hai", "good morning", "good afternoon", "good evening", "vanakkam", "namaste", "வணக்கம்", "नमस्ते", "नमस्कार", "你好", "您好", "嗨"],
    answer: {
      en: copy.knowledge.topics.i0_answer_en,
      ta: copy.knowledge.topics.i0_answer_ta,
      hi: copy.knowledge.topics.i0_answer_hi,
      zh: copy.knowledge.topics.i0_answer_zh,
    },
    followUps: ["services", "about", "contact", "enquiry"],
  },
  {
    id: "services",
    weight: 0.6,
    keywords: ["service", "offer", "provide", copy.knowledge.topics.i1_keywords_i3, "solutions", "சேவை", "சேவைகள்", "सेवा", "सेवाएँ", "सेवाओं", "服务", "业务", "提供什么"],
    question: {
      en: copy.knowledge.topics.i1_question_en,
      ta: copy.knowledge.topics.i1_question_ta,
      hi: copy.knowledge.topics.i1_question_hi,
      zh: copy.knowledge.topics.i1_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i1_answer_en,
      ta: copy.knowledge.topics.i1_answer_ta,
      hi: copy.knowledge.topics.i1_answer_hi,
      zh: copy.knowledge.topics.i1_answer_zh,
    },
    followUps: ["software", "networking", "support", "managed", "cyber", "cloud", "marketing", "hardware", "recruitment"],
  },
  {
    id: "about",
    weight: 0.8,
    keywords: ["about", "company", "about your company", "about you", "who are you", "cloute", "profile", "நிறுவனம்", "பற்றி", "कंपनी", "के बारे में", "公司", "介绍", "关于"],
    question: {
      en: copy.knowledge.topics.i2_question_en,
      ta: copy.knowledge.topics.i2_question_ta,
      hi: copy.knowledge.topics.i2_question_hi,
      zh: copy.knowledge.topics.i2_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i2_answer_en,
      ta: copy.knowledge.topics.i2_answer_ta,
      hi: copy.knowledge.topics.i2_answer_hi,
      zh: copy.knowledge.topics.i2_answer_zh,
    },
    link: { href: "/about-us", label: learnMore },
    followUps: ["services", "leadership", "audience", "contact"],
  },
  {
    id: "technologies",
    keywords: ["technology", "technologies", "tech stack", "platform", "tools", "microsoft", "windows", "kubernetes", "தொழில்நுட்ப", "तकनीक", "तकनीकों", "टेक्नोलॉजी", "技术", "平台"],
    question: {
      en: copy.knowledge.topics.i3_question_en,
      ta: copy.knowledge.topics.i3_question_ta,
      hi: copy.knowledge.topics.i3_question_hi,
      zh: copy.knowledge.topics.i3_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i3_answer_en,
      ta: copy.knowledge.topics.i3_answer_ta,
      hi: copy.knowledge.topics.i3_answer_hi,
      zh: copy.knowledge.topics.i3_answer_zh,
    },
    followUps: ["cloud", "hardware", "software", "contact"],
  },
  {
    id: "software",
    keywords: ["software", "website", "web site", "web app", "application", "app", "mobile app", "develop", "development", "crm", "erp", "dashboard", "automation", "api", "மென்பொருள்", "இணையதள", "வெப்சைட்", "அப்ளிகேஷன்", "செயலி", "सॉफ़्टवेयर", "सॉफ्टवेयर", "वेबसाइट", "ऐप", "एप्लिकेशन", "软件", "网站", "应用", "开发"],
    question: {
      en: copy.knowledge.topics.i4_question_en,
      ta: copy.knowledge.topics.i4_question_ta,
      hi: copy.knowledge.topics.i4_question_hi,
      zh: copy.knowledge.topics.i4_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i4_answer_en,
      ta: copy.knowledge.topics.i4_answer_ta,
      hi: copy.knowledge.topics.i4_answer_hi,
      zh: copy.knowledge.topics.i4_answer_zh,
    },
    link: { href: "/software-development-services", label: learnMore },
    followUps: ["pricing", "process", "enquiry"],
  },
  {
    id: "networking",
    keywords: ["network", "networking", "wifi", "wi-fi", "lan", "wan", "router", "switch", "cabling", "infrastructure", "நெட்வொர்க்", "நெட்வொர்க்கிங்", "வைஃபை", "नेटवर्क", "नेटवर्किंग", "वाईफाई", "网络", "布线", "路由器"],
    question: {
      en: copy.knowledge.topics.i5_question_en,
      ta: copy.knowledge.topics.i5_question_ta,
      hi: copy.knowledge.topics.i5_question_hi,
      zh: copy.knowledge.topics.i5_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i5_answer_en,
      ta: copy.knowledge.topics.i5_answer_ta,
      hi: copy.knowledge.topics.i5_answer_hi,
      zh: copy.knowledge.topics.i5_answer_zh,
    },
    link: { href: "/networking-and-infrastructure", label: learnMore },
    followUps: ["cyber", "managed", "enquiry"],
  },
  {
    id: "support",
    keywords: ["support", "helpdesk", "help desk", "it support", "troubleshoot", "troubleshooting", "problem", "issue", "not working", "repair", "fix", "help", "ஆதரவு", "உதவி", "பிரச்சினை", "சிக்கல்", "सपोर्ट", "हेल्पडेस्क", "समस्या", "मदद", "支持", "故障", "维修", "帮助"],
    question: {
      en: copy.knowledge.topics.i6_question_en,
      ta: copy.knowledge.topics.i6_question_ta,
      hi: copy.knowledge.topics.i6_question_hi,
      zh: copy.knowledge.topics.i6_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i6_answer_en,
      ta: copy.knowledge.topics.i6_answer_ta,
      hi: copy.knowledge.topics.i6_answer_hi,
      zh: copy.knowledge.topics.i6_answer_zh,
    },
    link: { href: "/it-support-and-helpdesk", label: learnMore },
    followUps: ["managed", "hours", "enquiry"],
  },
  {
    id: "managed",
    keywords: ["managed", "managed it", "monitoring", "maintenance", "amc", "backup", "disaster recovery", "நிர்வகிக்கப்பட்ட", "பராமரிப்பு", "கண்காணிப்பு", "मैनेज्ड", "रखरखाव", "निगरानी", "托管", "运维", "监控", "备份"],
    question: {
      en: copy.knowledge.topics.i7_question_en,
      ta: copy.knowledge.topics.i7_question_ta,
      hi: copy.knowledge.topics.i7_question_hi,
      zh: copy.knowledge.topics.i7_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i7_answer_en,
      ta: copy.knowledge.topics.i7_answer_ta,
      hi: copy.knowledge.topics.i7_answer_hi,
      zh: copy.knowledge.topics.i7_answer_zh,
    },
    link: { href: "/managed-it-services", label: learnMore },
    followUps: ["support", "cyber", "enquiry"],
  },
  {
    id: "cyber",
    keywords: ["cyber", "cybersecurity", "cyber security", "security", "secure", "firewall", "ransomware", "phishing", "malware", "virus", "hacking", "hacker", "vapt", "சைபர்", "பாதுகாப்பு", "साइबर", "सुरक्षा", "网络安全", "安全", "防火墙", "黑客", "病毒"],
    question: {
      en: copy.knowledge.topics.i8_question_en,
      ta: copy.knowledge.topics.i8_question_ta,
      hi: copy.knowledge.topics.i8_question_hi,
      zh: copy.knowledge.topics.i8_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i8_answer_en,
      ta: copy.knowledge.topics.i8_answer_ta,
      hi: copy.knowledge.topics.i8_answer_hi,
      zh: copy.knowledge.topics.i8_answer_zh,
    },
    link: { href: "/cybersecurity-services", label: learnMore },
    followUps: ["managed", "networking", "enquiry"],
  },
  {
    id: "cloud",
    keywords: ["cloud", "cloud service", "aws", "azure", "google cloud", "migration", "saas", "iaas", "paas", "hosting", "கிளவுட்", "क्लाउड", "क्लाउड सेवा", "云", "云服务", "云计算", "上云"],
    question: {
      en: copy.knowledge.topics.i9_question_en,
      ta: copy.knowledge.topics.i9_question_ta,
      hi: copy.knowledge.topics.i9_question_hi,
      zh: copy.knowledge.topics.i9_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i9_answer_en,
      ta: copy.knowledge.topics.i9_answer_ta,
      hi: copy.knowledge.topics.i9_answer_hi,
      zh: copy.knowledge.topics.i9_answer_zh,
    },
    link: { href: "/cloud-services", label: learnMore },
    followUps: ["technologies", "managed", "enquiry"],
  },
  {
    id: "marketing",
    weight: 1.5,
    keywords: ["digital marketing", "online marketing", "marketing", "seo", "seo for", "search engine optimization", "search engine optimisation", "google ranking", "rank my website", "website ranking", "website traffic", "social media", "social media marketing", "google ads", "ads", "advertising", "advertisement", "ppc", "promote", "promotion", "branding", "lead generation", "leads", "email marketing", "content marketing", "google business profile", "google maps", "online presence", "டிஜிட்டல் மார்க்கெட்டிங்", "டிஜிட்டல் மார்கெட்டிங்", "மார்க்கெட்டிங்", "சந்தைப்படுத்த", "விளம்பர", "சமூக ஊடக", "डिजिटल मार्केटिंग", "मार्केटिंग", "विज्ञापन", "सोशल मीडिया", "प्रचार", "एसईओ", "数字营销", "网络营销", "营销", "推广", "广告", "社交媒体", "搜索引擎优化"],
    question: {
      en: copy.knowledge.topics.i10_question_en,
      ta: copy.knowledge.topics.i10_question_ta,
      hi: copy.knowledge.topics.i10_question_hi,
      zh: copy.knowledge.topics.i10_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i10_answer_en,
      ta: copy.knowledge.topics.i10_answer_ta,
      hi: copy.knowledge.topics.i10_answer_hi,
      zh: copy.knowledge.topics.i10_answer_zh,
    },
    link: { href: "/digital-marketing-services", label: learnMore },
    followUps: ["software", "pricing", "enquiry"],
  },
  {
    id: "hardware",
    keywords: ["hardware", "laptop", "desktop", "server", "storage", "printer", "workstation", "computer", "buy", "purchase", "brand", "hp", "dell", "lenovo", "apple", "cisco", "poly", "epson", "canon", "licence", "license", "licensing", "வன்பொருள்", "லேப்டாப்", "கணினி", "சர்வர்", "हार्डवेयर", "लैपटॉप", "कंप्यूटर", "सर्वर", "硬件", "笔记本", "电脑", "服务器", "打印机"],
    question: {
      en: copy.knowledge.topics.i11_question_en,
      ta: copy.knowledge.topics.i11_question_ta,
      hi: copy.knowledge.topics.i11_question_hi,
      zh: copy.knowledge.topics.i11_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i11_answer_en,
      ta: copy.knowledge.topics.i11_answer_ta,
      hi: copy.knowledge.topics.i11_answer_hi,
      zh: copy.knowledge.topics.i11_answer_zh,
    },
    link: { href: "/products", label: learnMore },
    followUps: ["pricing", "enquiry", "contact"],
  },
  {
    id: "recruitment",
    keywords: ["recruit", "recruitment", "hiring", "hire", "staffing", "staff", "developer", "engineer", "job", "career", "vacancy", "ஆட்சேர்ப்பு", "பணியமர்த்த", "வேலை", "भर्ती", "नौकरी", "स्टाफ़िंग", "招聘", "职位"],
    question: {
      en: copy.knowledge.topics.i12_question_en,
      ta: copy.knowledge.topics.i12_question_ta,
      hi: copy.knowledge.topics.i12_question_hi,
      zh: copy.knowledge.topics.i12_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i12_answer_en,
      ta: copy.knowledge.topics.i12_answer_ta,
      hi: copy.knowledge.topics.i12_answer_hi,
      zh: copy.knowledge.topics.i12_answer_zh,
    },
    link: { href: "/recruitment", label: learnMore },
    followUps: ["services", "contact"],
  },
  {
    id: "contact",
    keywords: ["contact", "phone", "call", "email", "mail", "number", "reach", "get in touch", "whatsapp", "தொடர்பு", "போன்", "அழைப்பு", "மின்னஞ்சல்", "संपर्क", "फ़ोन", "फोन", "ईमेल", "联系", "电话", "邮箱", "邮件"],
    question: {
      en: copy.knowledge.topics.i13_question_en,
      ta: copy.knowledge.topics.i13_question_ta,
      hi: copy.knowledge.topics.i13_question_hi,
      zh: copy.knowledge.topics.i13_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i13_answer_en,
      ta: copy.knowledge.topics.i13_answer_ta,
      hi: copy.knowledge.topics.i13_answer_hi,
      zh: copy.knowledge.topics.i13_answer_zh,
    },
    link: { href: "/contact", label: { en: copy.knowledge.topics.i13_link_label_en, ta: copy.knowledge.topics.i13_link_label_ta, hi: copy.knowledge.topics.i13_link_label_hi, zh: copy.knowledge.topics.i13_link_label_zh } },
    followUps: ["enquiry", "hours", "location"],
  },
  {
    id: "hours",
    keywords: ["hours", "office hours", "business hours", "timing", "timings", "open", "opening", "working hours", "office time", "நேரம்", "வேலை நேரம்", "समय", "खुला", "营业时间", "几点", "时间"],
    question: {
      en: copy.knowledge.topics.i14_question_en,
      ta: copy.knowledge.topics.i14_question_ta,
      hi: copy.knowledge.topics.i14_question_hi,
      zh: copy.knowledge.topics.i14_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i14_answer_en,
      ta: copy.knowledge.topics.i14_answer_ta,
      hi: copy.knowledge.topics.i14_answer_hi,
      zh: copy.knowledge.topics.i14_answer_zh,
    },
    followUps: ["contact", "location"],
  },
  {
    id: "location",
    keywords: ["address", "location", "where", "office", "located", "map", "directions", "visit", "முகவரி", "எங்கே", "அலுவலகம்", "पता", "कहाँ", "ऑफ़िस", "地址", "在哪", "位置", "办公室"],
    question: {
      en: copy.knowledge.topics.i15_question_en,
      ta: copy.knowledge.topics.i15_question_ta,
      hi: copy.knowledge.topics.i15_question_hi,
      zh: copy.knowledge.topics.i15_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i15_answer_en,
      ta: copy.knowledge.topics.i15_answer_ta,
      hi: copy.knowledge.topics.i15_answer_hi,
      zh: copy.knowledge.topics.i15_answer_zh,
    },
    link: {
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`,
      label: { en: copy.knowledge.topics.i15_link_label_en, ta: copy.knowledge.topics.i15_link_label_ta, hi: copy.knowledge.topics.i15_link_label_hi, zh: copy.knowledge.topics.i15_link_label_zh },
    },
    followUps: ["hours", "contact"],
  },
  {
    id: "projects",
    keywords: ["project", "portfolio", "case study", "client", "previous work", "work done", "example", "திட்ட", "வாடிக்கையாளர்", "प्रोजेक्ट", "पोर्टफोलियो", "क्लाइंट", "项目", "案例", "客户"],
    question: {
      en: copy.knowledge.topics.i16_question_en,
      ta: copy.knowledge.topics.i16_question_ta,
      hi: copy.knowledge.topics.i16_question_hi,
      zh: copy.knowledge.topics.i16_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i16_answer_en,
      ta: copy.knowledge.topics.i16_answer_ta,
      hi: copy.knowledge.topics.i16_answer_hi,
      zh: copy.knowledge.topics.i16_answer_zh,
    },
    followUps: ["contact", "enquiry"],
  },
  {
    id: "pricing",
    keywords: ["price", "pricing", "cost", "charge", "rate", "quote", "quotation", "budget", "how much", "விலை", "கட்டண", "செலவ", "எவ்வளவு", "कीमत", "लागत", "दाम", "कोटेशन", "价格", "费用", "报价", "多少钱"],
    question: {
      en: copy.knowledge.topics.i17_question_en,
      ta: copy.knowledge.topics.i17_question_ta,
      hi: copy.knowledge.topics.i17_question_hi,
      zh: copy.knowledge.topics.i17_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i17_answer_en,
      ta: copy.knowledge.topics.i17_answer_ta,
      hi: copy.knowledge.topics.i17_answer_hi,
      zh: copy.knowledge.topics.i17_answer_zh,
    },
    followUps: ["enquiry", "contact"],
  },
  {
    id: "process",
    keywords: ["process", copy.knowledge.topics.i18_keywords_i1, "how you work", "steps", "approach", "methodology", "செயல்முறை", "எப்படி பணியாற்று", "प्रक्रिया", "कैसे काम", "流程", "步骤", "合作方式"],
    question: {
      en: copy.knowledge.topics.i18_question_en,
      ta: copy.knowledge.topics.i18_question_ta,
      hi: copy.knowledge.topics.i18_question_hi,
      zh: copy.knowledge.topics.i18_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i18_answer_en,
      ta: copy.knowledge.topics.i18_answer_ta,
      hi: copy.knowledge.topics.i18_answer_hi,
      zh: copy.knowledge.topics.i18_answer_zh,
    },
    followUps: ["pricing", "enquiry"],
  },
  {
    id: "audience",
    keywords: ["startup", "sme", "small business", "enterprise", "industry", "industries", copy.knowledge.topics.i19_keywords_i6, copy.knowledge.topics.i19_keywords_i7, "ஸ்டார்ட்அப்", "தொழில்துறை", "யாருடன்", "स्टार्टअप", "उद्योग", "किनके साथ", "किसके साथ", "初创", "中小企业", "行业", "哪些客户"],
    question: {
      en: copy.knowledge.topics.i19_question_en,
      ta: copy.knowledge.topics.i19_question_ta,
      hi: copy.knowledge.topics.i19_question_hi,
      zh: copy.knowledge.topics.i19_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i19_answer_en,
      ta: copy.knowledge.topics.i19_answer_ta,
      hi: copy.knowledge.topics.i19_answer_hi,
      zh: copy.knowledge.topics.i19_answer_zh,
    },
    followUps: ["services", "enquiry"],
  },
  {
    id: "leadership",
    keywords: ["ceo", "founder", "director", "leadership", "lead", "who leads", "management team", "owner", "cio", "who runs", "தலைவர்", "நிறுவனர்", "இயக்குநர்", "வழிநடத்து", "संस्थापक", "निदेशक", "नेतृत्व", "सीईओ", "创始人", "首席执行官", "领导"],
    question: {
      en: copy.knowledge.topics.i20_question_en,
      ta: copy.knowledge.topics.i20_question_ta,
      hi: copy.knowledge.topics.i20_question_hi,
      zh: copy.knowledge.topics.i20_question_zh,
    },
    answer: {
      en: copy.knowledge.topics.i20_answer_en,
      ta: copy.knowledge.topics.i20_answer_ta,
      hi: copy.knowledge.topics.i20_answer_hi,
      zh: copy.knowledge.topics.i20_answer_zh,
    },
    link: { href: "/about-us", label: learnMore },
    followUps: ["about", "contact"],
  },
  {
    id: "enquiry",
    keywords: ["enquiry", "inquiry", "enquire", "inquire", "book", "appointment", "consultation", "call back", "callback", "contact me", "get started", "interested", "விசாரணை", "ஆலோசனை", "पूछताछ", "परामर्श", "咨询", "预约"],
    question: {
      en: copy.knowledge.topics.i21_question_en,
      ta: copy.knowledge.topics.i21_question_ta,
      hi: copy.knowledge.topics.i21_question_hi,
      zh: copy.knowledge.topics.i21_question_zh,
    },
    // The enquiry topic starts the enquiry flow; this text introduces it.
    answer: {
      en: copy.knowledge.topics.i21_answer_en,
      ta: copy.knowledge.topics.i21_answer_ta,
      hi: copy.knowledge.topics.i21_answer_hi,
      zh: copy.knowledge.topics.i21_answer_zh,
    },
  },
  {
    id: "thanks",
    weight: 0.5,
    keywords: ["thank", "thanks", "thx", "great", "ok thanks", "நன்றி", "धन्यवाद", "शुक्रिया", "谢谢", "感谢"],
    answer: {
      en: copy.knowledge.topics.i22_answer_en,
      ta: copy.knowledge.topics.i22_answer_ta,
      hi: copy.knowledge.topics.i22_answer_hi,
      zh: copy.knowledge.topics.i22_answer_zh,
    },
    followUps: ["services", "contact", "enquiry"],
  },
];

/** Shown when nothing in the knowledge base matches. */
export const fallbackAnswer: Localized = copy.knowledge.fallbackAnswer;

/** Quick replies on the welcome message. */
export const starterTopics: TopicId[] = ["services", "about", "technologies", "software", "cyber", "contact", "support", "enquiry"];
