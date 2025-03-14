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

import { useTranslate } from "src/locales";

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from "../../hooks";
import { getErrorMessage } from '../../utils';
import { FormHead } from '../../components/form-head';

// ----------------------------------------------------------------------

export type SignInSchemaType = zod.infer<ReturnType<typeof createSignInSchema>>;

export const createSignInSchema = (t: TFunction) =>
  zod.object({
    email: zod
      .string()
      .min(1, { message: t('required.email') })
      .email({ message: t('invalid.email') }),
    password: zod
      .string()
      .min(1, { message: t('required.password') })
      .min(6, { message: t('password.minLength', { length: 6 }) }),
  });

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const router = useRouter();

  const { t } = useTranslate('auth');

  const showPassword = useBoolean();

  const { login } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignInSchemaType = {
    email: '',
    password: '',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(createSignInSchema(t)),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login({ email: data.email, password: data.password });
      router.refresh();
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      <Field.Text name="email" label={t('email.label')} slotProps={{ inputLabel: { shrink: true } }} />

      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
        <Link
          component={RouterLink}
          href="#"
          variant="body2"
          color="inherit"
          sx={{ alignSelf: 'flex-end' }}
        >
          {t('forgotPassword')}
        </Link>

        <Field.Text
          name="password"
          label={t('password.label')}
          placeholder={t('password.placeholder', { length: 6 })}
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator={t('connectAccount.loadingIndicator')}
      >
        {t('connectAccount.label')}
      </LoadingButton>
    </Box>
  );

  return (
    <>
      <FormHead
        title={t('connectYourAccount')}
        description={
          <>
            {`${t('dontHaveAccount')} `}
            <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
              {t('signUp')}
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
    </>
  );
}
