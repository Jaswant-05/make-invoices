import { 
    BlobSASPermissions, 
    StorageSharedKeyCredential,
    ContainerClient
} from "@azure/storage-blob";

enum TYPE {
    READ,
    WRITE
}

interface CreateUrlProps {
    type : TYPE,
    blobName : string
}

export class Azure{

    private AZURE_ACCOUNTNAME : string
    private AZURE_KEY : string
    private credential : StorageSharedKeyCredential;
    private containerClient;

    constructor(url : string){
        this.AZURE_ACCOUNTNAME = process.env.AZURE_ACCOUNTNAME || ""
        this.AZURE_KEY = process.env.AZURE_KEY || ""
        this.credential = new StorageSharedKeyCredential(this.AZURE_ACCOUNTNAME, this.AZURE_KEY);
        this.containerClient = new ContainerClient(url, this.credential);
    }

    async createUrl({type, blobName} : CreateUrlProps){
        let permissions = new BlobSASPermissions();
        if(type === TYPE.READ) permissions.read = true;
        if(type === TYPE.WRITE) {
            permissions.read = true;
            permissions.write = true;
            permissions.create = true
        }
        const currentTime = new Date();
        const expiresOn = new Date(currentTime.setHours(currentTime.getHours() + 1));
        const options = { 
            permissions,
            expiresOn,
        };

        const tempBlockBlobClient = this.containerClient.getBlockBlobClient(blobName);
        return await tempBlockBlobClient.generateSasUrl(options);
        
    }

    // Function used in the frontend here just for reference
    // async function uploadFile(url, filePath) {
    //     let size = fs.statSync(filePath).size;
    
    //     await fetch(url, {
    //         method:'PUT', 
    //         headers: {
    //             'Content-Type':'image/*',
    //             'Content-Length':size,
    //             'x-ms-blob-type':'BlockBlob'
    //         },
    //         body: fs.readFileSync(filePath)
    //     });
    
    // }
}