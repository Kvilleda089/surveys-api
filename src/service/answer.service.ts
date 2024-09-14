import { Database } from "../Data/database";
import { AnswerEntity } from '../Data/models/answer.entity';
import { SurveyEntity } from '../Data/models/survey.entity';
import { AnswerDetailEntity } from '../Data/models/answer-detail.entity';
import { UserEntity } from '../Data/models/user.entity';
import { AnswerData } from './interface/AnswerData.interface'
import { QuestionEntity } from "../Data/models/question.entity";
import { QuestionsOptionsEntity } from "../Data/models/questions_options.entity";



export class AnswerService {
    private answerRepository = Database.getInstance().getRepository(AnswerEntity);
    private surveyRepository = Database.getInstance().getRepository(SurveyEntity);
    private answerDetailRepository = Database.getInstance().getRepository(AnswerDetailEntity);
    private userRepository = Database.getInstance().getRepository(UserEntity);
    private questionRepository = Database.getInstance().getRepository(QuestionEntity);
    private questionOptionRepository = Database.getInstance().getRepository(QuestionsOptionsEntity);


    public async saveAnswers(surveyId: number, userId: number, data: AnswerData[]): Promise<AnswerEntity | null> {
        const newAnswers = new AnswerEntity();

        const survey = await this.surveyRepository.findOne({
            where: { id: surveyId }
        });
        const user = await this.userRepository.findOne({
            where: { id: userId }
        });

        if (!survey || !user) return null;

        newAnswers.survey = survey;
        newAnswers.modifiedUser = user;
        newAnswers.response_date = new Date();

        const saveAnswers = await this.answerRepository.save(newAnswers);

        await Promise.all(data.map(async (response) => {

            const question = await this.questionRepository.findOne({ where: { id: response.question } });
            if (!question) {
                throw new Error(`Question with ID ${response.question} not found`);
            }


            let questionOption = null;
            if (response.questionOption) {
                questionOption = await this.questionOptionRepository.findOne({ where: { id: response.questionOption, question: { id: question.id } } });
                if (!questionOption) {
                    throw new Error(`Option with ID ${response.questionOption} not found for question ${question.id}`);
                }
            }

            const newAnswersDetails = new AnswerDetailEntity();
            newAnswersDetails.answer = saveAnswers;
            newAnswersDetails.question = question;
            newAnswersDetails.questionOption = questionOption || null;
            newAnswersDetails.textAnswer = response.textAnswer || null;
            await this.answerDetailRepository.save(newAnswersDetails);
        }));
        return saveAnswers;
    };

    public async getAnswer(answerId: number, surveyId: number): Promise<AnswerEntity | null> {
        const survey = await this.surveyRepository.findOne({ where: { id: surveyId } })

        if (!survey) return null;
        const answer = await this.answerRepository.findOne({
            where: { id: answerId },
            relations: ['survey', 'modifiedUser', 'details', 'details.question', 'details.questionOption']
        });
        if (!answer) return null;

        return answer;
    }

    public async updateAnswer(answerId: number, body: any): Promise<AnswerEntity | null> {
        const { details } = body;

        const answer = await this.answerRepository.findOne({
            where: { id: answerId },
            relations: ['details', 'details.question', 'details.questionOption']
        });

        if (!answer) return null;

        const existingDetailsMap = new Map<number, AnswerDetailEntity>();
        answer.details.forEach(detail => {
            if (detail.question && detail.question.id) {
                existingDetailsMap.set(detail.question.id, detail);
            }
        });

        for (const detail of details) {


            const existingDetail = existingDetailsMap.get(detail.question);

            if (existingDetail) {
                if (detail.questionOption) {
                    const questionOption = await this.questionOptionRepository.findOne({
                        where: { id: detail.questionOption }
                    });
                    existingDetail.questionOption = questionOption || null;
                } else {
                    existingDetail.questionOption = null;
                }

                existingDetail.textAnswer = detail.textAnswer || null;
                await this.answerDetailRepository.save(existingDetail);
                existingDetailsMap.delete(detail.question);
            } else {
                const newDetail = new AnswerDetailEntity();
                newDetail.answer = answer;
                newDetail.question = { id: detail.question } as QuestionEntity;
                newDetail.questionOption = detail.questionOption ? { id: detail.questionOption } as QuestionsOptionsEntity : null;
                newDetail.textAnswer = detail.textAnswer || null;
                await this.answerDetailRepository.save(newDetail);
            }
        }

        for (const remainingDetail of existingDetailsMap.values()) {
            await this.answerDetailRepository.remove(remainingDetail);
        }

        return answer;
    };

    public async deleteAnswer(answerId: number): Promise<AnswerEntity | null> {
        const answer = await this.answerRepository.findOne({
            where: { id: answerId },
            relations: ['details']
        });

        if (!answer) return null;

        if (answer.details && answer.details.length > 0) {
            await this.answerDetailRepository.remove(answer.details);
        }
        await this.answerRepository.remove(answer);
        return answer;
    }
}