export interface IRegister {
    name: string,
    email: string,
    password: string,
}

export interface IJWT {
    id: string,
    name: string,
    image: string,
    iat?: number,
    exp?: number,
}
