import { UserModel } from "../../models/user.model";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function bootstrapAdmin() {
    const count = await UserModel.countDocuments();

    if (count > 0) {
        console.log("[auth] Users already exist, skipping bootstrap");
        return;
    }

    const email = process.env.FLINT_ADMIN_EMAIL;
    const password = process.env.FLINT_ADMIN_PASSWORD;

    if (!email || !password) {
        console.warn(
            "[auth] No users exist and FLINT_ADMIN_EMAIL / PASSWORD not set"
        );
        return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await UserModel.create({
        name: "Admin User",
        email,
        passwordHash,
    });

    console.log(`[auth] Admin user created: ${email}`);
}
