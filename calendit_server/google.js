const { google } = require('googleapis')

const { OAuth2 } = google.auth

const oAuth2Client = new OAuth2(
    '985996713619-3idtdvu1qj3drfg7prhkbreb8gv10g0s.apps.googleusercontent.com',
    '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',
    'http://localhost:5173/main'
)
const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
];

oAuth2Client.setCredentials({
    refresh_token: '1//04eCHJzaV-2EeCgYIARAAGAQSNwF-L9IrrjpTR92dvWybiGwoeeDwdlbzhyIdROGROH-AUoXaXdv8qkvfXRb3YmKRoG5pvJ0Io8s',
})

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

const eventStartTime = 0;

const eventEndTime = 0;


const event = {
    summary: `API`,
    description: `API testing`,
    colorId: 1,
    start: {
        timestamp: eventStartTime
    },
    end: {
        timestamp: eventEndTime
    },
}

calendar.freebusy.query(
    {
        resource: {
            timeMin: eventStartTime,
            timeMax: eventEndTime,
            timeZone: 'Europe/Budapest',
            items: [{ id: 'primary' }],
        },
    },
    (err, res) => {

        if (err) return console.error('Free Busy Query Error: ', err)

        const eventArr = res.data.calendars.primary.busy

        if (eventArr.length === 0)
            return calendar.events.insert(
                { calendarId: 'primary', resource: event },
                err => {
                    if (err) return console.error('Error Creating Calender Event:', err)
                    return console.log('Calendar event successfully created.')
                }
            )

        return console.log(`Sorry I'm busy...`)
    }
)