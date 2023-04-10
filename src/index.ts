import { Configuration, OpenAIApi } from "openai";

export class NaturalSQLite implements NaturalQL<string> {
  private openAIClient: OpenAIApi;
  private schema: string;

  // TODO SQL schema input and versions
  constructor({
    schema,
    configuration,
  }: {
    schema: string;
    configuration: Configuration;
  }) {
    this.openAIClient = new OpenAIApi(configuration);
    this.schema = schema;
  }

  async toQueryLanguage(naturalQuery: string) {
    // TODO input validation, sanitization
    const response = await this.openAIClient.createCompletion({
      model: "text-davinci-003",
      prompt: `### SQLite tables, with their properties:\n#\n#${this.schema}\n#\n### A query to ${naturalQuery}\nSELECT`,
      temperature: 0,
      max_tokens: 150,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["#", ";"],
    });
    // TODO error handling
    // TODO output validation, sanitization
    return `SELECT${response.data.choices[0].text.replace(/\s+/g, " ")};`;
  }
}

abstract class NaturalQL<OUT> {
  abstract toQueryLanguage(naturalQuery: string): Promise<OUT>;
}
