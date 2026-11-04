// Single entry point for the website copy. Every user-facing string lives in a JSON file under /content, so
// text, headings, button labels, FAQs, service details and chatbot replies are edited there — no component
// changes needed. Each JSON file is keyed by the source file that uses it (e.g. content/services.json ->
// "services" for lib/services.ts), then by the section or constant, then by a readable key.
import about from "@/content/about.json";
import chatbot from "@/content/chatbot.json";
import common from "@/content/common.json";
import contact from "@/content/contact.json";
import footer from "@/content/footer.json";
import homepage from "@/content/homepage.json";
import navbar from "@/content/navbar.json";
import products from "@/content/products.json";
import recruitment from "@/content/recruitment.json";
import reviews from "@/content/reviews.json";
import services from "@/content/services.json";
import solutions from "@/content/solutions.json";

export const content = { about, chatbot, common, contact, footer, homepage, navbar, products, recruitment, reviews, services, solutions };
