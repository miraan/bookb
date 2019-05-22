// @flow

import nodemailer from 'nodemailer';

const key = {
  type: 'service_account',
  project_id: 'bookb-241420',
  private_key_id: 'd5fd9b70b7ba7a58f67fedf13a365607398e8399',
  private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDIph7G8hue5dsX\nYNqHuphkVQ+sVIgLkw93xP7U4Z/+N6JJARkjYlfiWMj4XWr/yw5DV9txQ1hqLWAP\nBmkOUCgb0zNE1sYS1kPl7ZKIUiVZ4Fz/NX6oL3n0HqpqqTlr/rHaspjofig1q/s9\nhh9xFkZ5wD5uK7oZ5ysDD0fGUNjNdi9vW1KbdTl35T9yS6/idHD/oWRIxlUcmnrL\n3sXqGaE2Qrjgcpjwd14lk7i9KeNKPSM+EbFHEPo3x3bXMm+izI/P1ANnuWoJGnVK\nkOR9kbhFQMbXKpESO2TipkYp6gqCxdsmyECmyJOAufZJ+iuS72zyc8eL2tCHST9e\nj0q/8oNzAgMBAAECggEAA/HCuyB5SzII5jhriK2HX2Q4rvzpFmkpWFkRYA1LauDx\nxMOhGIv6CaNl1/67eBR9eZ9u20F6qc5YjBMRL6HYbVZFNL46yJYDtwUTk1siDCvt\nSBW8zADwQcyfMazqnw/eXoaSRkfB8e7T5+K3bYQFlfvMfmKdAZ4Ev3D7yo8+Tn5S\nUJw92lVaOfJCQsv2M601ih6QGlUHD9bobaH+gIqMSfFnCerRqyBHM8RPE8yFaisb\nEmZjfeYNPGTP6SvhqTN95st439UDmoeOP3aOF025I1Cg45Tl0aNCnJDXJu8ruzX9\nPnIh3Ildlscq53v24FfNaP9cdiFQxrci/YyeXnaYoQKBgQD9IroW/fLMlH3BKSPZ\nx4D0Q4EMccGSd+Hr3W1gHGJfCxP1AD4hwmMpHVhIiKdwJCmqliQ1mXQHPgWYmU9C\nNxb76XZ7CSTkVIkVA0xlP8PDJYB5hXV+bHXFYUDkd7nSR9g40T4e0aNJVl66y7Ei\n1DfRnE4rZIZo/Z8c8VspBYf7cQKBgQDK61oR+KzFYr6vKA9UWw01uz6zduKSHoiu\n4cY37bKW6zG/1pAV0yX1kdWIbQWeqS9f+2zgGarl56pcOY6gyVX6xdXyv9YCQJ/L\nHMiXxtD7m4aBEtN2KMUcIP/3CRdhrxgzCdLuGi8iQ2AhdzllrbE7ItwhQWeQqfBF\nIU8sC23TIwKBgQDk5A3Y1HBDxNGhZA3i0p8sQA3krsgWJQjIOkS4b3IT9vRoyXtl\nE1yOxNYbYFXm9QwoD/NV9BgSpGZzAc3FVgMWbpiP0EjnnfkGYyElPG9LehGd0KvZ\nUUF85N/Etu3z0rsVRT8ipvU7TzoBNkZJ9BM1Gl0kp5VSQmMpzKRdh37aQQKBgQDB\nMz/4qGnnLVMcdenSiTaUmAjk2iZytPuydmhBy+Ej7B7b5jAdd4JGw2kpkZOuMqtW\nmY5Z+FZMuzvqvypbUBa6wy4nCBt83YbG3krmp3dGeBeiQQhxEfRKCelrjY5jhVBn\nF81qwidqWffnJRrTAoMiKNiqGRnAFO0dBM/awa75PQKBgAdxjTyju5729y/PXUuO\nMqdz9oPShEAKevi8y9lcFU2LKDsGxo+0fIQ/RO1Nx2IzBtNi36grxpdPUaEodF12\nAJHTfZ/mNGi/ivpfg1Z+FukIgFxWlZC5d94QjNUBhdGnVX6Zy0Zau1BX+Ba7/8Hw\nmSEi1Ooq6LbALnnsKypqG1V1\n-----END PRIVATE KEY-----\n',
  client_email: 'bookb-61@bookb-241420.iam.gserviceaccount.com',
  client_id: '117063625777900484105',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/bookb-61%40bookb-241420.iam.gserviceaccount.com',
};

const from = 'miraan@bookb.co';

export default class EmailClient {
  client: any

  constructor() {
    this.client = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        type: 'OAuth2',
        user: from,
        serviceClient: key.client_id,
        privateKey: key.private_key,
      },
    });
  }

  sendInternalEmail = (subject: string, body: string) => Promise.all([
    'miraan.tabrez@gmail.com',
    'abdikaliq.ige@merton.ox.ac.uk',
    'jibril.gudal@st-hildas.ox.ac.uk',
  ].map(to => this.sendEmail(to, subject, body)))

  sendEmail = (to: string, subject: string, body: string) => {
    const mailOptions = {
      from,
      to,
      subject,
      text: body,
    };

    console.log(`Sending email to: ${to}; subject: ${subject}; body: ${body}`);
    this.client.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }
}
