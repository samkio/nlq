import { NaturalSQLite } from "../src";
import { Configuration } from "openai";

// https://sqliteonline.com/
// Output of `SELECT * FROM SQLITE_SCHEMA;`; (exported as JSON);
const SQLITE_ONLINE_SCHEMA = `[{"type":"table","name":"demo","tbl_name":"demo","rootpage":2,"sql":"CREATE TABLE demo (ID integer primary key, Name varchar(20), Hint text )"}]`;

test("SQLite", async () => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const naturalSQLite = new NaturalSQLite({
    schema: SQLITE_ONLINE_SCHEMA,
    configuration,
  });
  const response = await naturalSQLite.toQueryLanguage(
    "Get all names where the hint is longer than 30 characters ordered by last character in the name ignoring case"
  );
  console.log(response);
  expect(response).toBeDefined();
});
