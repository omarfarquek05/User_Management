import { userRepository } from "./user.repository";

export const userService = {

  getAllUsers: async () => {
    return await userRepository.findAll();
  },

  getUserById: async (id: string) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error("USER_NOT_FOUND");
    return user;
  },

  createUser: async (data: { name: string; email: string; password: string }) => {
    // Business logic: email duplicate check
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new Error("EMAIL_ALREADY_EXISTS");

    const hashedPassword = await Bun.password.hash(data.password);

    return await userRepository.create({
      ...data,
      password: hashedPassword,
    });
  },

  updateUser: async (id: string, data: { name?: string; email?: string; password?: string }) => {
    const existing = await userRepository.findById(id);
    if (!existing) throw new Error("USER_NOT_FOUND");

    // Email conflict check (different user এর email নয় তো?)
    if (data.email && data.email !== existing.email) {
      const emailTaken = await userRepository.findByEmail(data.email);
      if (emailTaken) throw new Error("EMAIL_ALREADY_EXISTS");
    }

    const updateData: Record<string, unknown> = { ...data };
    if (data.password) updateData.password = await Bun.password.hash(data.password);

    return await userRepository.update(id, updateData);
  },

  deleteUser: async (id: string) => {
    const existing = await userRepository.findById(id);
    if (!existing) throw new Error("USER_NOT_FOUND");
    return await userRepository.delete(id);
  },
};