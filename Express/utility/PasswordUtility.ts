import bcrypt from "bcrypt"

export const generatePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}

export const generateSalt = async () => {
    return await bcrypt.genSalt()
}

export const validatePassword = async (
    enteredPassword: string,
    savedPassword: string,
    savedSalt: string
) => {
    return (await generatePassword(enteredPassword, savedSalt)) == savedPassword
}
