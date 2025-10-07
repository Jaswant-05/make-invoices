import { 
    BlobServiceClient, 
    BlobSASPermissions, 
    generateBlobSASQueryParameters, 
    StorageSharedKeyCredential
} from "@azure/storage-blob";

enum TYPE {
    READ,
    WRITE
}

interface CreateUrlProps {
    type : TYPE,

}

export class Azure{

    private AZURE_ACCOUNTNAME : string
    private AZURE_KEY : string
    private AZURE_CONTAINERNAME : string 
    private AZURE_CONNECTIONSTRING : string
    private blobServiceClient;
    private containerClient;

    constructor(){
        this.AZURE_ACCOUNTNAME = process.env.AZURE_ACCOUNTNAME || ""
        this.AZURE_KEY = process.env.AZURE_KEY || ""
        this.AZURE_CONTAINERNAME = process.env.AZURE_CONTAINERNAME || ""
        this.AZURE_CONNECTIONSTRING = process.env.AZURE_CONNECTIONSTRING || ""

        this.blobServiceClient = BlobServiceClient.fromConnectionString(this.AZURE_CONNECTIONSTRING);
        this.containerClient = this.blobServiceClient.getContainerClient(this.AZURE_CONTAINERNAME);
    }

    async createUrl({type} : CreateUrlProps){
        let permissions = new BlobSASPermissions();
        if(type === TYPE.READ) permissions.read = true;
        if(type === TYPE.WRITE) permissions.write = true;

        const currentTime = new Date();
        const expiresOn = new Date(currentTime.setHours(currentTime.getHours() + 1));
        const options = { 
            containerName : this.AZURE_CONTAINERNAME,
            permissions,
            expiresOn,
        };

        let credential = new StorageSharedKeyCredential(this.AZURE_ACCOUNTNAME, this.AZURE_KEY);
        const queryParams = generateBlobSASQueryParameters(options, credential);
    }
}