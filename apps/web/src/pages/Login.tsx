import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { loginUser } from '../api/auth';
import { useAuthSession } from '../hooks/useAuthSession';

const loginSchema = z.object({
  email: z
    .string()
    .email('Adresse e-mail invalide.')
    .transform((value) => value.trim().toLowerCase()),
  password: z.string().min(12, 'Le mot de passe doit contenir au moins 12 caracteres.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate({ from: '/login' });
  const session = useAuthSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (session) {
      navigate({ to: '/' });
    }
  }, [session, navigate]);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      navigate({ to: '/' });
    },
  });

  const onSubmit = handleSubmit((values) => {
    mutation.mutate({
      email: values.email,
      password: values.password,
    });
  });

  return (
    <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Se connecter</h1>
      <p className="mt-2 text-sm text-slate-600">Accedez a votre espace en entrant vos identifiants.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
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

        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
            {...register('password')}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Connexion en cours...' : 'Se connecter'}
        </button>

        {mutation.isError && (
          <p className="text-sm text-red-600">
            {(mutation.error as Error).message ?? 'Une erreur inattendue est survenue.'}
          </p>
        )}
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Pas encore de compte ?{' '}
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
          Creer un compte
        </Link>
      </p>
    </div>
  );
}
