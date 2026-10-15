/** Sentence split that does not break on abbreviations like "St." or "Mt.". */
export const sentences = (t: string) => t.split(/(?<!\b(?:St|Mt|Ft|Dr|Jr|Sr)\.)(?<=\.)\s+(?=[A-Z])/);
