import { ObjectId } from "mongodb";
import { collections } from "../../mongodb-client";
import { Meeting } from "../../interfaces";

export async function startTimer(meetingId: ObjectId, unixmillis: number): Promise<Meeting> {

    // get the meeting, can't use findandupdateone because we need add dynamic data
    let res = await collections.meetings.findOne({ _id: meetingId })

    // if there was no meeting return an empty object
    if(!!!Object.keys(res ?? {}).length)
        return {} as any

    // nullcheck for old versions of the app
    // for usability just replace the old timer
    // if(res?.timer.active)
    //     return { error: "Timer is already active" } as any

    // update the dataset in the db
    // document.save() is not safe, i know that using two requests is bad practice
    res = await collections.meetings.findOneAndUpdate({ _id: meetingId }, {
        $set: {
            timer: {
                active: true,
                time: unixmillis
            }
        }
    },
    {
        returnDocument: "after"
    }) as any

    return res?.value
}