const axios = require("axios")
const { TestMeetingID } = require("../config")

test("Join the test meeting with a member called [John Doe]", async () => {

    let json = JSON.stringify({ meetingId: TestMeetingID, member: { name: "John Doe" }})

    await axios.post("https://sep-nojo-test.azurewebsites.net/api/meetings/join", json, 
        { headers: {'Content-Type': 'application/json'} })
        
    meeting = await axios.get(`https://sep-nojo-test.azurewebsites.net/api/meetings/${TestMeetingID}`)
    meeting = meeting.data

    expect(meeting.members).toEqual(expect.arrayContaining([expect.objectContaining({ name: "John Doe" })]))
})