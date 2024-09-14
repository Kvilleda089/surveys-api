import { Database } from "../Data/database";
import { QuestionEntity } from "../Data/models/question.entity";
import { QuestionsOptionsEntity } from '../Data/models/questions_options.entity';
import { SurveyEntity } from "../Data/models/survey.entity";



export class SurveyService {

    private surveyRepository = Database.getInstance().getRepository(SurveyEntity);
    private questionReposity = Database.getInstance().getRepository(QuestionEntity);
    private questionOptionsRepository = Database.getInstance().getRepository(QuestionsOptionsEntity);



    public async createSurvey(data: any): Promise<SurveyEntity> {
        const { title, description, fields, createdUserId } = data;

        const survey = new SurveyEntity();
        survey.title = title;
        survey.description = description;
        survey.createdUserId = createdUserId;
        survey.createAt = new Date();

        await this.surveyRepository.save(survey);

        for (const field of fields) {
            const question = new QuestionEntity();
            question.survey = survey;
            question.questionText = field.name;
            question.questionType = field.type;
            question.isRequired = field.isRequired;
            await this.questionReposity.save(question);
            
            if (field.type === 'multiple_choice') {
                for (const optionText of field.options) {
                    const option = new QuestionsOptionsEntity();
                    option.question = question;
                    option.optionText = optionText;
                    await this.questionOptionsRepository.save(option);
                };
            };
        };

        return survey;
    };

    public async getSurvey(id: number): Promise<SurveyEntity | null> {
        return await this.surveyRepository.findOne({
            where: { id },
            relations: ['questions', 'questions.options']
        });
    };

    public async updateSurvey(id: number, data: any): Promise<SurveyEntity | null> {
        const survey = await this.surveyRepository.findOne({
            where: { id },
            relations: ['questions', 'questions.options']
        })

        console.log(data);
        if (!survey) return null;

        const { title, description, fields } = data;
        survey.title = title;
        survey.description = description;
        survey.updateAt = new Date();

        await this.surveyRepository.save(survey);

        const existingQuestionsMap = new Map<number, QuestionEntity>();
        survey.questions.forEach(question => existingQuestionsMap.set(question.id, question));

        for (const field of fields) {
            if (field.id) {
                const existingQuestion = existingQuestionsMap.get(field.id);
                if (existingQuestion) {
                    existingQuestion.questionText = field.name;
                    existingQuestion.questionType = field.type;
                    existingQuestion.isRequired = field.isRequired;
                    await this.questionReposity.save(existingQuestion);
                    console.log(existingQuestion);

                    if (field.type === 'multiple_choice') {
                        const existingOptionsMap = new Map<number, QuestionsOptionsEntity>();
                        existingQuestion.options.forEach(opt => existingOptionsMap.set(opt.id, opt));


                        for (const optionText of field.options) {
                            const existingOption = Array.from(existingOptionsMap.values()).find(opt => opt.optionText === optionText);

                            if (!existingOption) {

                                const newOption = new QuestionsOptionsEntity();
                                newOption.question = existingQuestion;
                                newOption.optionText = optionText;
                                await this.questionOptionsRepository.save(newOption);
                            } else {
                                existingOptionsMap.delete(existingOption.id);
                            }
                        }


                        for (const remainingOption of existingOptionsMap.values()) {
                            await this.questionOptionsRepository.remove(remainingOption);
                        }
                    }
                }
            } else {

                const newQuestion = new QuestionEntity();
                newQuestion.survey = survey;
                newQuestion.questionText = field.name;
                newQuestion.questionType = field.type;
                newQuestion.isRequired = field.isRequired;
                await this.questionReposity.save(newQuestion);


                if (field.type === 'multiple_choice') {
                    for (const optionText of field.options) {
                        const option = new QuestionsOptionsEntity();
                        option.question = newQuestion;
                        option.optionText = optionText;
                        await this.questionOptionsRepository.save(option);
                    }
                }
            }
        }


        for (const existingQuestion of survey.questions) {
            if (!fields.find((field: any) => field.id === existingQuestion.id)) {

                await this.questionOptionsRepository.remove(existingQuestion.options);
                await this.questionReposity.remove(existingQuestion);
            }
        }
        return survey;
    };

    public async delteSurvey(id: number): Promise<SurveyEntity | null> {
        const survey = await this.surveyRepository.findOne({
            where: { id },
            relations: ['questions', 'questions.options']
        });
        if (!survey) return null;
        for (const question of survey.questions) {
            await this.questionOptionsRepository.remove(question.options);
            await this.questionReposity.remove(question);
        };
        await this.surveyRepository.remove(survey);
        return survey;
    };
};