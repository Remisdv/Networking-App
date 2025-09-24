import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { registerUser } from '../api/auth';

const passwordSchema = z
  .string()
  .min(12, 'Le mot de passe doit contenir au moins 12 caracteres.')
  .regex(/(?=.*[a-z])/, 'Ajoutez au moins une lettre minuscule.')
  .regex(/(?=.*[A-Z])/, 'Ajoutez au moins une lettre majuscule.')
  .regex(/(?=.*\d)/, 'Ajoutez au moins un chiffre.')
  .regex(/(?=.*[^\w\s])/, 'Ajoutez au moins un caractere special.');

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'Le prenom doit contenir au moins 2 caracteres.')
      .max(60, 'Le prenom est trop long.')
      .transform((value) => value.trim()),
    lastName: z
      .string()
      .min(2, 'Le nom doit contenir au moins 2 caracteres.')
      .max(80, 'Le nom est trop long.')
      .transform((value) => value.trim()),
    email: z
      .string()
      .email('Adresse e-mail invalide.')
      .transform((value) => value.trim().toLowerCase()),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z
      .boolean()
      .refine((value) => value === true, {
        message: "Vous devez accepter les conditions d'utilisation.",
      }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Les mots de passe ne correspondent pas.',
        path: ['confirmPassword'],
      });
    }
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      setRegistrationSuccess(false);
    },
    onSuccess: () => {
      setRegistrationSuccess(true);
      reset();
    },
  });

  const onSubmit = handleSubmit((values) => {
    mutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      acceptTerms: values.acceptTerms,
    });
  });

  return (
    <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Creer un compte</h1>
      <p className="mt-2 text-sm text-slate-600">
        Rejoignez la plateforme et accedez a l'espace collaboratif.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="firstName">
              Prenom
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="lastName">
              Nom
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              Au moins 12 caracteres avec majuscules, minuscules, chiffres et caracteres speciaux.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
              Confirmation
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <input
            id="acceptTerms"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            {...register('acceptTerms')}
          />
          <label htmlFor="acceptTerms" className="text-sm text-slate-600">
            J'ai lu et j'accepte les conditions d'utilisation et la politique de confidentialite.
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="-mt-2 text-sm text-red-600">{errors.acceptTerms.message}</p>
        )}

        <button
          type="submit"
          className="w-full rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Creation en cours...' : 'Creer mon compte'}
        </button>

        {mutation.isError && (
          <p className="text-sm text-red-600">
            {(mutation.error as Error).message ?? 'Une erreur inattendue est survenue.'}
          </p>
        )}

        {registrationSuccess && (
          <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Votre compte a ete cree. Vous pourrez vous connecter des que l'espace sera disponible.
          </div>
        )}
      </form>
    </div>
  );
}

