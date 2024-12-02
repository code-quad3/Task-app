const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter= nodemailer.createTransport({
    service: 'gmail',
    auth:{
      user:`${ process.env.EMAIL_USER}`,
      pass: process.env.EMAIL_PASS
    },
  });

const sendRemainderEmail = async(userEmail,task)=>{
    try{
        await transporter.sendMail({
            from:`${process.env.EMAIL_USER}`,
            to: userEmail,
            subject: `${task.title} is Overdue!`,
            text: `Hello, \n\n This is a remainder that your tasks ${task.title} is overdue and has been
            added to your overdue lists.,
            \n\n Description: ${task.description || 'No description provided'}
            \n\nPlease review the tasks details and complete it as soon as possible
            \n\n Thank you!
            `,
          });
         console.log("mail is sended"); 
          
    }
    catch(err){
    console.log("error ocuured while sending email");
    }
}


module.exports= {sendRemainderEmail};