import { PrismaClient } from "@prisma/client/extension"

// model InvoiceItem {
//     id        String    @id    @default(cuid())
//     name      String
//     quantity  Int?
//     amount    Int
//     invoiceId String
//     createdAt DateTime  @default(now())
//     updatedAt DateTime  @updatedAt
  
//     invoice   Invoice   @relation(fields: [invoiceId], references: [id], onDelete: Cascade )
// }

export class invoiceItem{
    private prisma; 

    constructor(prisma : PrismaClient){
        this.prisma = prisma
    }
       
    create(){

    }

    update(){

    }

    get(){

    }

    getAll(){

    }

    delete(){

    }
}