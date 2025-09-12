export const PasswordPattern =
  /^(?=(?:[^a-zA-Z]*[a-zA-Z]){2})(?=\D*\d)[\s\S]{8,}$/;

export const EmailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isEmailValid = (email: string) => {
  return String(email).toLowerCase().match(EmailPattern);
};
