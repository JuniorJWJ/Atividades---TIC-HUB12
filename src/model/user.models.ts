import { Role } from "../enums/Role";

export class User {
  constructor(
    public id: number,
    public username: string,
    public email: string,
    public role: Role
  ) {
    if (!username.trim()) {
      throw new Error("User: o nome de usuário não pode ser vazio.");
    }

    if (!email.includes("@")) {
      throw new Error("User: informe um e-mail válido.");
    }
  }

  getRoleLabel(): string {
    return this.role === Role.ADMIN ? "Administrador" : "Cliente";
  }
}
