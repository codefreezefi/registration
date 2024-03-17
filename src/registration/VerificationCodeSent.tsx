export const VerificationCodeSent = (props: { email: string }) => (
  <div class="alert alert-warning">
    <p>
      We've sent you a verification code to your email{" "}
      <code>{props.email}</code>. Please enter the code below. If you haven't
      received the email, check your SPAM folder or search for the sender{" "}
      <code>registration@codefreeze.fi</code>.
    </p>
  </div>
);
