export type TLoginUser = {
  email: string
  password: string
}

export type TRegisterUser = {
  name: string
  email: string
  password: string
  role?: "user" | "vendor" | "admin"
}
