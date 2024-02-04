import { Client, QueryResult, QueryResultRow } from "pg";
import { singleton } from "tsyringe";
import config from "../../config/config";

@singleton()
export default class DB {
  private readonly _client: Client;

  private readonly _connected: Promise<boolean>;

  constructor() {
    this._client = new Client({
      host: config.db.host,
      port: config.db.port,
      database: config.db.name,
      user: config.db.username,
      password: config.db.password
    });
    this._connected = this._client.connect().then(() => true);
  }

  query<T extends QueryResultRow>(query: string): Promise<QueryResult<T>> {
    return this._connected.then(() => this._client.query<T>(query));
  }
}
