import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const SALT_ROUNDS = 10;

export async function createUser(email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    return UserModel.create({ email, passwordHash });
}

export async function login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email
        }
    };
}
