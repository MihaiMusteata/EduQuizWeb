import type { TFunction } from "i18next";

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';
import { SignUpTerms } from '../../components/sign-up-terms';

// ----------------------------------------------------------------------

export type SignUpSchemaType = zod.infer<ReturnType<typeof createSignUpSchema>>;

export const createSignUpSchema = (t: TFunction) =>
  zod.object({
    firstName: zod.string().min(1, { message: t('required.firstName') }),
    lastName: zod.string().min(1, { message: t('required.lastName') }),
    email: zod
      .string()
      .min(1, { message: t('required.email') })
      .email({ message: t('invalid.email') }),
    password: zod
      .string()
      .min(1, { message: t('required.password') })
      .min(6, { message: t('password.minLength', { length: 6 }) })
      .regex(/[A-Z]/, { message: t('password.uppercase') })
      .regex(/[^a-zA-Z0-9]/, { message: t('password.nonAlphanumeric') }),
  });

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const router = useRouter();

  const { t } = useTranslate('auth');

  const showPassword = useBoolean();

  const { checkUserSession, signup } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignUpSchemaType = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(createSignUpSchema(t)),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signup(data);
      await checkUserSession?.();

      router.push(paths.auth.jwt.signIn);
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Field.Text
          name="firstName"
          label={t('firstName.label')}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Field.Text
          name="lastName"
          label={t('lastName.label')}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>

      <Field.Text name="email" label={t('email.label')} slotProps={{ inputLabel: { shrink: true } }} />

      <Field.Text
        name="password"
        label={t("password.label")}
        placeholder={t('password.placeholder', { length: 6 })}
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={t('createAccount.loadingIndicator')}
      >
        {t('createAccount.label')}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title={t('getStarted')}
        description={
          <>
            {`${t('alreadyHaveAccount')} `}
            <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
              {t('signIn')}
            </Link>
          </>
        }
        sx={{ textAlign: { xs: 'center', md: 'left' } }}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <SignUpTerms t={t} />
    </>
  );
}
