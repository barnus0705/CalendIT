const nodemailer = require("nodemailer");
export default async function send(userEmail,text,dateStart,dateEnd){

    const trasnporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'calendittestuser@gmail.com',
            pass: 'xvocbnvhipxgeimg'
        }
    });
    const mailOptions = {
        from: 'calendittestuser@gmail.com',
        to: `${userEmail}`,
        subject: 'Test send',
        html: `
                <h1>CalendIT</h1>
                <br>
                <p>${text}</p>
                <p>${dateStart}+`  -  `+${dateEnd}</p>
                <br>
                <p>Please contact us on <br>calendittestuser@gmail.com<br>For further questions</p>
              `
    };
    await trasnporter.sendMail(mailOptions, (err, info)=>{
        if (err){
            console.log(err);
        }else {
            console.log('email sent: '+ info.response);
        }
    });
}
