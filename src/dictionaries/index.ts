import "server-only";

interface PageDictionary {
	introduction_title: string;
	introduction_paragraph1: string;
	introduction_paragraph2: string;
	health_impacts_title: string;
	health_impacts_paragraph: string;
	health_impacts_list: string[];
	trends_title: string;
	trends_paragraph: string;
	trends_contributions: Array<{
		title: string;
		text: string;
	}>;
	climate_conditions_title: string;
	climate_conditions_paragraph: string;
	climate_conditions_list: string[];
	technology_title: string;
	technology_paragraph: string;
	technology_contributions: Array<{
		title: string;
		text: string;
	}>;
	justification_title: string;
	justification_paragraph: string;
	justification_list: string[];
	practical_sense_title: string;
	practical_sense_paragraph: string;
	practical_sense_contributions: Array<{
		title: string;
		text: string;
	}>;
}

interface Dictionary {
	page: PageDictionary;
}

type Locale = keyof typeof dictionaries;

const dictionaries = {
	en: (): Promise<Dictionary> =>
		import("./en.json").then((module) => module.default),
	ptBR: (): Promise<Dictionary> =>
		import("./pt-br.json").then((module) => module.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
	const dictionaryLoader = dictionaries[locale as Locale] || dictionaries.ptBR;
	return dictionaryLoader();
};

export type { Dictionary, Locale };
