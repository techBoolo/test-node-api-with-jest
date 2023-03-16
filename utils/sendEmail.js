import sgMail from '@sendgrid/mail'
import envConfig from '../config/envConfig.js'
import ErrorResponse from './errorResponse.js'

export default async ({to, from ,subject, ...rest }) => {
  sgMail.setApiKey(envConfig.SENDGRID_API_KEY)
  const message = {
    to,
    from,
    subject,
    html: rest.message
  }
  try {
    await sgMail.send(message) 
  } catch (err) {
    throw new ErrorResponse({
      statusCode: 500,
      message: 'email not sent'
    })
  }
}
