import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface PasswordResetEmailProps {
  resetLink: string;
  userName?: string;
}

export const PasswordResetEmail = ({
  resetLink,
  userName = 'there',
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your Roof Leads Pro password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={text}>Hi {userName},</Text>
        <Text style={text}>
          We received a request to reset your password for your Roof Leads Pro account.
          Click the button below to reset it:
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={resetLink}>
            Reset Password
          </Button>
        </Section>
        <Text style={text}>
          If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
        </Text>
        <Text style={text}>
          This link will expire in 1 hour for security reasons.
        </Text>
        <Text style={footer}>
          Best regards,
          <br />
          The Roof Leads Pro Team
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333333',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
  width: '200px',
  margin: '0 auto',
};

const footer = {
  ...text,
  fontSize: '14px',
  color: '#666666',
  marginTop: '32px',
}; 