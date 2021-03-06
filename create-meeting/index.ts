import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ObjectId } from "mongodb"
import { addMeeting } from "../db"
import { createMeetingSchema } from "../schemas"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const newMeeting = {
        creatorName: req.body.creatorName?.trim(),
        meetingName: req.body.meetingName?.trim(),
        createdAt: new Date(),
        done: false, // future: be able to archive held meetings, e.g. with image send feature useful
        members: [],
        currentTool: "",
        timer: {
            active: false,
            time: -1
        },
        debug: true
    }

    const result = createMeetingSchema.validate(newMeeting)
    if (result.error) {
        context.res = {
            status: 422,
            body: result.error.details.map(x => x.message),
        }
        return
    }

    const creator = {
        id: new ObjectId(),
        name: req.body.creatorName?.trim() ?? "",
        hat: ""
    }

    const meeting = await addMeeting(newMeeting as any, creator)

    // add created memberId separately, requested feature by Janik for QoL
    meeting.memberId = creator.id

    context.res = {
        status: 200,
        body: meeting,
    }
}

export default httpTrigger
