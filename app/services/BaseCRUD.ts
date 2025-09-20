import { type PrismaClient } from "@prisma/client";
import { z } from "zod";

export abstract class BaseCRUD<T, CreateT, UpdateT, GetT, DeleteT> {
    protected prisma: PrismaClient;
    protected modelName: string;

    constructor(prisma: PrismaClient, modelName: string) {
        this.prisma = prisma;
        this.modelName = modelName;
    }

    // Abstract methods for schema validation - each subclass defines their own
    protected abstract getCreateSchema(): z.ZodSchema<CreateT>;
    protected abstract getUpdateSchema(): z.ZodSchema<UpdateT>;
    protected abstract getGetSchema(): z.ZodSchema<GetT>;
    protected abstract getDeleteSchema(): z.ZodSchema<DeleteT>;

    async create(input: CreateT) {
        const { data, error } = this.getCreateSchema().safeParse(input);

        if (error) {
            return {
                success: false,
                error: error.message
            };
        }

        try {
            // Use bracket notation to access the model dynamically
            const result = await (this.prisma as any)[this.modelName].create({
                data: data
            });

            if (!result) {
                throw new Error(`Unable to create ${this.modelName}`);
            }

            return {
                success: true,
                data: result
            };
        } catch (err: any) {
            return {
                success: false,
                error: err.message
            };
        }
    }

    async get(input: GetT) {
        const { data, error } = this.getGetSchema().safeParse(input);

        if (error) {
            return {
                success: false,
                error: error.message
            };
        }

        try {
            const result = await (this.prisma as any)[this.modelName].findFirst({
                where: data
            });

            if (!result) {
                throw new Error(`Unable to fetch ${this.modelName}`);
            }

            return {
                success: true,
                data: result
            };
        } catch (err: any) {
            return {
                success: false,
                error: err.message
            };
        }
    }

    async getAll(input: Partial<GetT>) {
        const { data, error } = this.getGetSchema().safeParse(input);

        if (error) {
            return {
                success: false,
                error: error.message
            };
        }

        try {
            const result = await (this.prisma as any)[this.modelName].findMany({
                where: data
            });

            return {
                success: true,
                data: result
            };
        } catch (err: any) {
            return {
                success: false,
                error: err.message
            };
        }
    }

    async update(input: UpdateT) {
        const { data, error } = this.getUpdateSchema().safeParse(input);

        if (error) {
            return {
                success: false,
                error: error.message
            };
        }

        try {
            const { id, ...updateData } = data as any;

            const result = await (this.prisma as any)[this.modelName].update({
                where: { id },
                data: updateData
            });

            if (!result) {
                throw new Error(`Error updating ${this.modelName}`);
            }

            return {
                success: true,
                data: result
            };
        } catch (err: any) {
            return {
                success: false,
                error: err.message
            };
        }
    }

    async delete(input: DeleteT) {
        const { data, error } = this.getDeleteSchema().safeParse(input);

        if (error) {
            return {
                success: false,
                error: error.message
            };
        }

        try {
            await (this.prisma as any)[this.modelName].delete({
                where: data
            });

            return {
                success: true,
                message: `${this.modelName} deleted successfully`
            };
        } catch (err: any) {
            return {
                success: false,
                error: err.message
            };
        }
    }
}