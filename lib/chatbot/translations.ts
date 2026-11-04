// Interface and enquiry-flow text for the website chat assistant, in each supported language. Answers to company
// questions live in lib/chatbot/knowledge.ts. Translations should be reviewed by a native speaker.
import type { Lang, Localized } from "@/lib/chatbot/knowledge";
import copy from "@/content/chatbot.json";

export const languageNames: Record<Lang, { native: string; english: string }> = {
  en: { native: copy.translations.languageNames.en_native, english: copy.translations.languageNames.en_english },
  ta: { native: copy.translations.languageNames.ta_native, english: copy.translations.languageNames.ta_english },
  hi: { native: copy.translations.languageNames.hi_native, english: copy.translations.languageNames.hi_english },
  zh: { native: copy.translations.languageNames.zh_native, english: copy.translations.languageNames.zh_english },
};

/** BCP 47 tags for speech recognition, speech synthesis and date formatting. */
export const speechLang: Record<Lang, string> = { en: copy.translations.speechLang.en, ta: copy.translations.speechLang.ta, hi: copy.translations.speechLang.hi, zh: copy.translations.speechLang.zh };

const ui = {
  title: { en: copy.translations.ui.en01_cloute_assistant, ta: copy.translations.ui.ta02_cloute, hi: copy.translations.ui.hi03_cloute, zh: copy.translations.ui.zh04_cloute },
  subtitle: { en: copy.translations.ui.en05_virtual_assistant, ta: copy.translations.ui.ta06_x, hi: copy.translations.ui.hi07_x, zh: copy.translations.ui.zh08_x },
  open: { en: copy.translations.ui.en09_chat_with_cloute_assistant, ta: copy.translations.ui.ta10_cloute, hi: copy.translations.ui.hi11_cloute, zh: copy.translations.ui.zh12_cloute },
  welcome: {
    en: copy.translations.ui.en13_hi_i_m_the,
    ta: copy.translations.ui.ta14_cloute_technologies,
    hi: copy.translations.ui.hi15_cloute_technologies,
    zh: copy.translations.ui.zh16_cloute_technologies,
  },
  placeholder: { en: copy.translations.ui.en17_type_your_message, ta: copy.translations.ui.ta18_x, hi: copy.translations.ui.hi19_x, zh: copy.translations.ui.zh20_x },
  send: { en: copy.translations.ui.en21_send, ta: copy.translations.ui.ta22_x, hi: copy.translations.ui.hi23_x, zh: copy.translations.ui.zh24_x },
  you: { en: copy.translations.ui.en25_you, ta: copy.translations.ui.ta26_x, hi: copy.translations.ui.hi27_x, zh: copy.translations.ui.zh28_x },
  clear: { en: copy.translations.ui.en29_clear_chat, ta: copy.translations.ui.ta30_x, hi: copy.translations.ui.hi31_x, zh: copy.translations.ui.zh32_x },
  minimize: { en: copy.translations.ui.en33_minimize, ta: copy.translations.ui.ta34_x, hi: copy.translations.ui.hi35_x, zh: copy.translations.ui.zh36_x },
  expand: { en: copy.translations.ui.en37_open_chat, ta: copy.translations.ui.ta38_x, hi: copy.translations.ui.hi39_x, zh: copy.translations.ui.zh40_x },
  close: { en: copy.translations.ui.en41_close, ta: copy.translations.ui.ta42_x, hi: copy.translations.ui.hi43_x, zh: copy.translations.ui.zh44_x },
  language: { en: copy.translations.ui.en45_language, ta: copy.translations.ui.ta46_x, hi: copy.translations.ui.hi47_x, zh: copy.translations.ui.zh48_x },
  typing: { en: copy.translations.ui.en49_assistant_is_typing, ta: copy.translations.ui.ta50_x, hi: copy.translations.ui.hi51_x, zh: copy.translations.ui.zh52_x },
  micStart: { en: copy.translations.ui.en53_speak_your_message, ta: copy.translations.ui.ta54_x, hi: copy.translations.ui.hi55_x, zh: copy.translations.ui.zh56_x },
  micStop: { en: copy.translations.ui.en57_stop_listening, ta: copy.translations.ui.ta58_x, hi: copy.translations.ui.hi59_x, zh: copy.translations.ui.zh60_x },
  listening: { en: copy.translations.ui.en61_listening, ta: copy.translations.ui.ta62_x, hi: copy.translations.ui.hi63_x, zh: copy.translations.ui.zh64_x },
  speaking: { en: copy.translations.ui.en65_speaking, ta: copy.translations.ui.ta66_x, hi: copy.translations.ui.hi67_x, zh: copy.translations.ui.zh68_x },
  heard: {
    en: copy.translations.ui.en69_check_the_text_then,
    ta: copy.translations.ui.ta70_x,
    hi: copy.translations.ui.hi71_x,
    zh: copy.translations.ui.zh72_x,
  },
  mute: { en: copy.translations.ui.en73_turn_off_spoken_replies, ta: copy.translations.ui.ta74_x, hi: copy.translations.ui.hi75_x, zh: copy.translations.ui.zh76_x },
  unmute: { en: copy.translations.ui.en77_read_replies_aloud, ta: copy.translations.ui.ta78_x, hi: copy.translations.ui.hi79_x, zh: copy.translations.ui.zh80_x },
  play: { en: copy.translations.ui.en81_play, ta: copy.translations.ui.ta82_x, hi: copy.translations.ui.hi83_x, zh: copy.translations.ui.zh84_x },
  stop: { en: copy.translations.ui.en85_stop, ta: copy.translations.ui.ta86_x, hi: copy.translations.ui.hi87_x, zh: copy.translations.ui.zh88_x },
  voiceUnsupported: {
    en: copy.translations.ui.en89_voice_input_isn_t,
    ta: copy.translations.ui.ta90_chrome_edge_safari,
    hi: copy.translations.ui.hi91_chrome_edge_safari,
    zh: copy.translations.ui.zh92_chrome_edge_safari,
  },
  micDenied: {
    en: copy.translations.ui.en93_microphone_access_was_blocked,
    ta: copy.translations.ui.ta94_x,
    hi: copy.translations.ui.hi95_x,
    zh: copy.translations.ui.zh96_x,
  },
  noMic: {
    en: copy.translations.ui.en97_no_microphone_was_found,
    ta: copy.translations.ui.ta98_x,
    hi: copy.translations.ui.hi99_x,
    zh: copy.translations.ui.zh100_x,
  },
  noSpeech: {
    en: copy.translations.ui.en101_i_didn_t_catch,
    ta: copy.translations.ui.ta102_x,
    hi: copy.translations.ui.hi103_x,
    zh: copy.translations.ui.zh104_x,
  },
  voiceError: {
    en: copy.translations.ui.en105_voice_input_stopped_unexpectedly,
    ta: copy.translations.ui.ta106_x,
    hi: copy.translations.ui.hi107_x,
    zh: copy.translations.ui.zh108_x,
  },
  ttsUnsupported: {
    en: copy.translations.ui.en109_reading_aloud_isn_t,
    ta: copy.translations.ui.ta110_x,
    hi: copy.translations.ui.hi111_x,
    zh: copy.translations.ui.zh112_x,
  },
  noVoice: {
    en: copy.translations.ui.en113_this_browser_has_no,
    ta: copy.translations.ui.ta114_microsoft_edge_settings_speech,
    hi: copy.translations.ui.hi115_microsoft_edge_settings_speech,
    zh: copy.translations.ui.zh116_microsoft_edge_settings_speech,
  },
  suggestions: { en: copy.translations.ui.en117_suggested_questions, ta: copy.translations.ui.ta118_x, hi: copy.translations.ui.hi119_x, zh: copy.translations.ui.zh120_x },
} satisfies Record<string, Localized>;

const enquiry = {
  name: { en: copy.translations.enquiry.en01_what_is_your_name, ta: copy.translations.enquiry.ta02_x, hi: copy.translations.enquiry.hi03_x, zh: copy.translations.enquiry.zh04_x },
  company: {
    en: copy.translations.enquiry.en05_which_company_are_you,
    ta: copy.translations.enquiry.ta06_x,
    hi: copy.translations.enquiry.hi07_x,
    zh: copy.translations.enquiry.zh08_x,
  },
  service: {
    en: copy.translations.enquiry.en09_which_service_are_you,
    ta: copy.translations.enquiry.ta10_x,
    hi: copy.translations.enquiry.hi11_x,
    zh: copy.translations.enquiry.zh12_x,
  },
  help: {
    en: copy.translations.enquiry.en13_what_kind_of_help,
    ta: copy.translations.enquiry.ta14_x,
    hi: copy.translations.enquiry.hi15_x,
    zh: copy.translations.enquiry.zh16_x,
  },
  email: { en: copy.translations.enquiry.en17_what_is_your_email, ta: copy.translations.enquiry.ta18_x, hi: copy.translations.enquiry.hi19_x, zh: copy.translations.enquiry.zh20_x },
  phone: { en: copy.translations.enquiry.en21_what_is_your_whatsapp, ta: copy.translations.enquiry.ta22_whatsapp, hi: copy.translations.enquiry.hi23_whatsapp, zh: copy.translations.enquiry.zh24_whatsapp },
  skip: { en: copy.translations.enquiry.en25_skip, ta: copy.translations.enquiry.ta26_x, hi: copy.translations.enquiry.hi27_x, zh: copy.translations.enquiry.zh28_x },
  cancel: { en: copy.translations.enquiry.en29_cancel_enquiry, ta: copy.translations.enquiry.ta30_x, hi: copy.translations.enquiry.hi31_x, zh: copy.translations.enquiry.zh32_x },
  cancelled: {
    en: copy.translations.enquiry.en33_no_problem_the_enquiry,
    ta: copy.translations.enquiry.ta34_x,
    hi: copy.translations.enquiry.hi35_x,
    zh: copy.translations.enquiry.zh36_x,
  },
  errName: {
    en: copy.translations.enquiry.en37_please_enter_your_name,
    ta: copy.translations.enquiry.ta38_2,
    hi: copy.translations.enquiry.hi39_2,
    zh: copy.translations.enquiry.zh40_2,
  },
  errCompany: {
    en: copy.translations.enquiry.en41_please_keep_the_company,
    ta: copy.translations.enquiry.ta42_100,
    hi: copy.translations.enquiry.hi43_100,
    zh: copy.translations.enquiry.zh44_100,
  },
  errService: {
    en: copy.translations.enquiry.en45_please_choose_one_of,
    ta: copy.translations.enquiry.ta46_x,
    hi: copy.translations.enquiry.hi47_x,
    zh: copy.translations.enquiry.zh48_x,
  },
  errHelp: {
    en: copy.translations.enquiry.en49_please_describe_what_you,
    ta: copy.translations.enquiry.ta50_10,
    hi: copy.translations.enquiry.hi51_10,
    zh: copy.translations.enquiry.zh52_10,
  },
  errEmail: {
    en: copy.translations.enquiry.en53_that_email_address_doesn,
    ta: copy.translations.enquiry.ta54_x,
    hi: copy.translations.enquiry.hi55_x,
    zh: copy.translations.enquiry.zh56_x,
  },
  errPhone: {
    en: copy.translations.enquiry.en57_please_enter_a_valid,
    ta: copy.translations.enquiry.ta58_91_98765_43210,
    hi: copy.translations.enquiry.hi59_91_98765_43210,
    zh: copy.translations.enquiry.zh60_91_98765_43210,
  },
  summaryTitle: {
    en: copy.translations.enquiry.en61_please_check_your_enquiry,
    ta: copy.translations.enquiry.ta62_x,
    hi: copy.translations.enquiry.hi63_x,
    zh: copy.translations.enquiry.zh64_x,
  },
  labelName: { en: copy.translations.enquiry.en65_name, ta: copy.translations.enquiry.ta66_x, hi: copy.translations.enquiry.hi67_x, zh: copy.translations.enquiry.zh68_x },
  labelCompany: { en: copy.translations.enquiry.en69_company, ta: copy.translations.enquiry.ta70_x, hi: copy.translations.enquiry.hi71_x, zh: copy.translations.enquiry.zh72_x },
  labelService: { en: copy.translations.enquiry.en73_service, ta: copy.translations.enquiry.ta74_x, hi: copy.translations.enquiry.hi75_x, zh: copy.translations.enquiry.zh76_x },
  labelHelp: { en: copy.translations.enquiry.en77_help_needed, ta: copy.translations.enquiry.ta78_x, hi: copy.translations.enquiry.hi79_x, zh: copy.translations.enquiry.zh80_x },
  labelEmail: { en: copy.translations.enquiry.en81_email, ta: copy.translations.enquiry.ta82_x, hi: copy.translations.enquiry.hi83_x, zh: copy.translations.enquiry.zh84_x },
  labelPhone: { en: copy.translations.enquiry.en85_whatsapp, ta: copy.translations.enquiry.ta86_whatsapp, hi: copy.translations.enquiry.hi87_whatsapp, zh: copy.translations.enquiry.zh88_whatsapp },
  notProvided: { en: copy.translations.enquiry.en89_not_provided, ta: copy.translations.enquiry.ta90_x, hi: copy.translations.enquiry.hi91_x, zh: copy.translations.enquiry.zh92_x },
  edit: { en: copy.translations.enquiry.en93_edit, ta: copy.translations.enquiry.ta94_x, hi: copy.translations.enquiry.hi95_x, zh: copy.translations.enquiry.zh96_x },
  confirm: { en: copy.translations.enquiry.en97_confirm_enquiry, ta: copy.translations.enquiry.ta98_x, hi: copy.translations.enquiry.hi99_x, zh: copy.translations.enquiry.zh100_x },
  summaryNote: {
    en: copy.translations.enquiry.en101_confirming_saves_this_enquiry,
    ta: copy.translations.enquiry.ta102_whatsapp,
    hi: copy.translations.enquiry.hi103_whatsapp,
    zh: copy.translations.enquiry.zh104_whatsapp,
  },
  success: {
    en: copy.translations.enquiry.en105_thank_you_name_your,
    ta: copy.translations.enquiry.ta106_name_whatsapp,
    hi: copy.translations.enquiry.hi107_name_whatsapp,
    zh: copy.translations.enquiry.zh108_name_whatsapp,
  },
  saveFailed: {
    en: copy.translations.enquiry.en109_this_browser_blocked_local,
    ta: copy.translations.enquiry.ta110_whatsapp,
    hi: copy.translations.enquiry.hi111_whatsapp,
    zh: copy.translations.enquiry.zh112_whatsapp,
  },
  whatsapp: { en: copy.translations.enquiry.en113_continue_on_whatsapp, ta: copy.translations.enquiry.ta114_whatsapp, hi: copy.translations.enquiry.hi115_whatsapp, zh: copy.translations.enquiry.zh116_whatsapp },
  emailButton: { en: copy.translations.enquiry.en117_send_by_email, ta: copy.translations.enquiry.ta118_x, hi: copy.translations.enquiry.hi119_x, zh: copy.translations.enquiry.zh120_x },
  emailSending: { en: copy.translations.enquiry.en121_email_sending, ta: copy.translations.enquiry.ta122_x, hi: copy.translations.enquiry.hi123_x, zh: copy.translations.enquiry.zh124_x },
  emailSent: { en: copy.translations.enquiry.en125_email_sent, ta: copy.translations.enquiry.ta126_x, hi: copy.translations.enquiry.hi127_x, zh: copy.translations.enquiry.zh128_x },
  emailFailed: { en: copy.translations.enquiry.en129_email_failed, ta: copy.translations.enquiry.ta130_x, hi: copy.translations.enquiry.hi131_x, zh: copy.translations.enquiry.zh132_x },
} satisfies Record<string, Localized>;

export type UiKey = keyof typeof ui;
export type EnquiryKey = keyof typeof enquiry;

export function t(key: UiKey, lang: Lang) {
  return ui[key][lang];
}

export function te(key: EnquiryKey, lang: Lang, values: Record<string, string> = {}) {
  return enquiry[key][lang].replace(/\{(\w+)\}/g, (_, name: string) => values[name] ?? "");
}
