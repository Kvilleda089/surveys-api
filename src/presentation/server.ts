import express, {Application} from "express";
import { envs } from "../config/env";
import surveyRouter from "../routes/survey.routes";
import { Database } from "../Data/database";
import userRouter from "../routes/user.routes";
import answerRoutes from "../routes/answer.routes";
import { AuthenticateToken } from "../middlewares/authenticate-token.middlewares";
import cors from "cors";

export class Server {
    private app: Application;
    private port: number;
    private database: Database;

    constructor(){
        this.app = express();
        this.port = envs.PORT;
        this.database = Database.getInstance();
        this.config();
        this.routes();
    }


    private config(): void {
        this.app.use(express.json());
    };

    private routes(): void {
        this.app.use(cors())
        this.app.use('/api/forms/surveys', AuthenticateToken, surveyRouter);
        this.app.use('/api/users',  userRouter);
        this.app.use('/api/forms/answers', AuthenticateToken, answerRoutes);
        
    };

    public async connectionDatabase(): Promise<void>{
        try {
            await this.database.initialize();
            console.log(`Connection database success`)
        } catch (error) {
            console.log(`Error connection database ${error}`);
            throw new Error('Exiting application due to database connection failure');
        }
    }

    public async start(): Promise<void>{
        await this.connectionDatabase();
        this.app.listen(this.port, () =>{
            console.log(`Server listening on http://localhost:${this.port}`)
        });
    }
}