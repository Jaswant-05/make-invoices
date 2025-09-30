export function generateCode({len} : {len : number}){
    const available = "abcdefghijklmnopqrstuvwxyz";
    let code = ""
    
    for(let i=0; i<len; i++){
        let index = Math.floor(Math.random() * available.length);
        code = code + available[index];
    }

    return code
}