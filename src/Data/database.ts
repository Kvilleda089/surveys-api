import { DataSource, Repository, EntityTarget, ObjectLiteral} from 'typeorm';
import { envs } from "../config/env";
import { UserEntity } from './models/user.entity';
import { SurveyEntity } from './models/survey.entity';
import { QuestionEntity } from './models/question.entity';
import { QuestionsOptionsEntity } from './models/questions_options.entity';
import { AnswerEntity } from './models/answer.entity';
import { AnswerDetailEntity } from './models/answer-detail.entity';


export class Database {
  private static instance: Database;
  private datasource: DataSource;

  private constructor() {
    this.datasource = new DataSource({
      type: 'mssql',
      host: envs.DB_HOST,
      port: Number(envs.DB_PORT),
      username: envs.DB_USERNAME,
      password: envs.DB_PASSWORD,
      database: envs.DB_NAME,
      entities: [UserEntity, SurveyEntity, QuestionEntity, QuestionsOptionsEntity, AnswerEntity, AnswerDetailEntity],
      synchronize: false,
      extra:{
      options: {
        encrypt: false, 
        trustServerCertificate: false,
      }},
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    };
    return Database.instance;
  };

  public async initialize(): Promise<void> {
    try {
      await this.datasource.initialize();
      console.log(`Connection database success...`)
    } catch (error) {
      console.error(`Error connection database ${error}`)
      throw error;
    }
  };

  public getDataSource(): DataSource {
    return this.datasource;
  };

  public getRepository<Entity extends ObjectLiteral>(entity: EntityTarget<Entity>): Repository<Entity> {
    return this.datasource.getRepository(entity);
  }
}