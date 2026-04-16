export type Language = "es" | "en";

export const DEFAULT_LANGUAGE: Language = "es";
export const NONE_OPTION_ID = "none";

export type LocalizedText = Record<Language, string>;

export type LocalizedOption = {
  id: string;
  label: LocalizedText;
};

export type LocalizedOptionSet = {
  header: LocalizedText;
  options: LocalizedOption[];
};

export function getLocalizedText(text: LocalizedText, language: Language) {
  return text[language];
}

export function getLocalizedOptions(
  optionSet: LocalizedOptionSet,
  language: Language,
) {
  return optionSet.options.map((option) => ({
    value: option.id,
    label: option.label[language],
  }));
}

export function resolveLocalizedSelectionLabel(
  value: string,
  optionSet: LocalizedOptionSet,
  language: Language,
) {
  return (
    optionSet.options.find((option) => option.id === value)?.label[language] ??
    value
  );
}

export const sharedCopy = {
  es: {
    appName: "Recetario Inteligente",
    appTagline: "Recetas e imagenes de platos creadas con IA.",
    studio: "Estudio",
    spanish: "ES",
    english: "EN",
  },
  en: {
    appName: "AI Recipe Studio",
    appTagline: "Recipes and dish visuals generated with AI.",
    studio: "Studio",
    spanish: "ES",
    english: "EN",
  },
} as const;

export const selectorCopy = {
  es: {
    time: {},
    food: {
      customPlaceholder: "Otra cocina o estilo",
      addCustom: "Anadir",
      editCustom: "Editar",
    },
    dietary: {
      customPlaceholder: "Otra preferencia",
      addCustom: "Anadir",
      editCustom: "Editar",
    },
    religious: {
      customPlaceholder: "Otra practica",
      addCustom: "Anadir",
      editCustom: "Editar",
    },
  },
  en: {
    time: {},
    food: {
      customPlaceholder: "Another cuisine or style",
      addCustom: "Add",
      editCustom: "Edit",
    },
    dietary: {
      customPlaceholder: "Another preference",
      addCustom: "Add",
      editCustom: "Edit",
    },
    religious: {
      customPlaceholder: "Another practice",
      addCustom: "Add",
      editCustom: "Edit",
    },
  },
} as const;
