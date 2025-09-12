import { PhoneNumber } from 'react-native-phone-input/dist';
import { parse } from 'date-fns';
import { Gender, ImportBrandClient } from '@symbiot-core-apps/api';
import { DateHelper, isEmailValid } from '@symbiot-core-apps/shared';

export interface ImportedClientsSummary {
  succeed: number;
  failed: number;
}

export const parseImportedClients = (
  clients: Array<string[]>,
  genders: Gender[],
) => {
  const keys = {
    firstname: 0,
    lastname: 1,
    email: 2,
    phone: 3,
    birthday: 4,
    gender: 5,
    address: 6,
    avatarUrl: 7,
  };
  const result: {
    summary: ImportedClientsSummary;
    clients: ImportBrandClient[];
  } = {
    summary: {
      succeed: 0,
      failed: 0,
    },
    clients: [],
  };

  clients.forEach((client, index) => {
    if (client.every((value) => value === '' || value === '-')) {
      return;
    }

    const firstname =
      client[keys.firstname] && client[keys.firstname] !== '-'
        ? String(client[keys.firstname]).trim().substring(0, 50)
        : '';
    const lastname =
      client[keys.lastname] && client[keys.lastname] !== '-'
        ? String(client[keys.lastname]).trim().substring(0, 50)
        : '';
    const address =
      client[keys.address] && client[keys.address] !== '-'
        ? String(client[keys.address]).trim().substring(0, 150)
        : '';
    const avatarUrl =
      client[keys.avatarUrl] && client[keys.avatarUrl] !== '-'
        ? String(client[keys.avatarUrl])
        : '';
    const gender =
      client[keys.gender] && client[keys.gender] !== '-'
        ? genders.find(
            ({ id, name }) =>
              name.toLowerCase() ===
              String(client[keys.gender]).toLowerCase().trim(),
          )?.id
        : undefined;
    let email =
      client[keys.email] && client[keys.email] !== '-'
        ? String(client[keys.email]).trim().substring(0, 150)
        : '';
    let phone =
      client[keys.phone] && client[keys.phone] !== '-'
        ? `+${String(client[keys.phone]).trim().replace(/\D/g, '')}`
        : '';
    let birthday =
      client[keys.birthday] && client[keys.birthday] !== '-'
        ? String(client[keys.birthday]).trim()
        : null;

    if (!email || (email && !isEmailValid(email))) {
      email = '';
    }

    if (
      !phone ||
      (phone &&
        !PhoneNumber.isValidNumber(
          phone,
          PhoneNumber.getCountryCodeOfNumber(phone),
        ))
    ) {
      phone = '';
    }

    if (!email && !phone) {
      if (index !== 0) {
        result.summary.failed += 1;
      }

      return;
    }

    if (birthday && !DateHelper.isValid(new Date(birthday))) {
      birthday = null;
    }

    result.summary.succeed += 1;
    result.clients.push({
      firstname,
      lastname,
      email,
      address,
      avatarUrl,
      gender,
      birthday: birthday
        ? DateHelper.startOfDay(
            parse(birthday, 'dd-MM-yyyy', new Date()),
          ).toUTCString()
        : null,
      phones: phone
        ? [
            {
              country: PhoneNumber.getCountryCodeOfNumber(phone),
              tel: phone,
              formatted: PhoneNumber.format(
                phone,
                PhoneNumber.getCountryCodeOfNumber(phone),
              ),
              name: '',
            },
          ]
        : [],
    });
  });

  return result;
};
