// FAQ content for the home and products pages.
import type { Faq } from "./types";
import copy from "@/content/homepage.json";

// Home page FAQs (numbered on the page by FaqSection).
export const homeFaqs: Faq[] = copy.faqs.homeFaqs;

export const productFaqs: Faq[] = copy.faqs.productFaqs;
