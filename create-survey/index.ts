import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ObjectId } from "mongodb"
import { createSurvey } from "../db"
import { surveyCreateSchema } from "../schemas/survey-create.schema"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const survey = {
        meetingId: new ObjectId(req.body?.meetingId),
        id: new ObjectId(),
        question: req.body?.question ?? "",
        creatorName: req.body?.creatorName ?? "",
        choices: req.body?.choices ?? [],
        answer: [] // always empty on creation
    }

    const validateResult = surveyCreateSchema.validate(survey)
    if (validateResult.error) {
        context.res = {
            status: 422,
            body: validateResult.error.details.map(x => x.message),
        }
        return
    }

    let meetingId = survey.meetingId;
    delete survey.meetingId; // meetingId should not be written to db

    const result = await createSurvey(meetingId, survey)
    if (!!!Object.keys(result ?? {}).length) {
        context.res = {
            status: 422,
            body: "Could not create survey",
        }
        return
    }

    context.res = {
        status: 200,
        body: result
    }
}

export default httpTrigger