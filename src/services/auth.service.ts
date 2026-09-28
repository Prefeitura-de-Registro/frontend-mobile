import { api } from './api';

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: 'municipe' | 'funcionario';
  created_at: string;
}

export interface LoginResponse {
  usuario: UsuarioLogado;
  token: string;
}

/**
 * TODO(backend/produto): a tela de login (sign_in) pede "Matrícula", mas o
 * backend só tem login por e-mail (POST /api/user/login espera
 * { email, senha } — não existe campo de matrícula no model User).
 *
 * Por enquanto, o que a pessoa digita no campo "Matrícula" é mandado como
 * "email" mesmo, senão a tela não teria como funcionar. Isso precisa de uma
 * decisão do time: ou o backend ganha um campo de matrícula de verdade, ou
 * o campo do front passa a se chamar/validar como e-mail.
 */
export async function login(identificador: string, senha: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/api/user/login', {
    email: identificador,
    senha,
  });

  return response.data;
}
