import nodemailer from 'nodemailer';

export async function sendReservationEmail(
  pdfBuffer: Buffer, 
  csvContent: string, 
  customer: string
) {
  // CONFIGURAÇÃO: O usuário precisará preencher estas informações ou usar variáveis de ambiente
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'minetealmoxarifado@gmail.com',
      pass: process.env.EMAIL_PASSWORD // Recomenda-se usar App Password do Gmail
    }
  });

  const mailOptions = {
    from: 'minetealmoxarifado@gmail.com',
    to: 'minetealmoxarifado@gmail.com',
    subject: `Reserva BipStone - ${customer}`,
    text: `Segue em anexo os relatórios de reserva para o cliente: ${customer}.`,
    attachments: [
      {
        filename: `reserva_${customer.replace(/\s+/g, '_')}.pdf`,
        content: pdfBuffer
      },
      {
        filename: `reserva_${customer.replace(/\s+/g, '_')}.csv`,
        content: csvContent
      }
    ]
  };

  return transporter.sendMail(mailOptions);
}
