function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
        return parts.pop().split(';').shift();
}

function uploadFiles() {
    // CODE
    var files = Array.from(document.getElementById("driveFiles").files);
    var accessToken = getCookie("token");
    var publicationName = document.getElementById("publicationName").value;

    
    var publicationResponse = createPublicationFolder(accessToken, publicationName);
    var publicationFolder = JSON.parse(publicationResponse);

    publicationFolder['files'] = files.map(file => {
     var fileResponse = uploadPublicationFiles(accessToken, file, publicationFolder);
     return JSON.parse(fileResponse);
    });

    // CODE


    console.log(publicationFolder);

    // Python thing - remove
    $('html,body').scrollTop(0);
    if(publicationFolder.name && publicationFolder.name === publicationName) {
        document.getElementById("flash").innerHTML = "";
        $('#flash').append("<button type='button' class='btn btn-success btn-lg btn-block' id='buttonSuccess'>Upload feito com sucesso</button>");
        document.getElementById("buttonSuccessFlash").style.display="none";
        document.getElementById("buttonErrorFlash").style.display="none";
    } else {
        $('#flash').append("<button type='button' class='btn btn-danger btn-lg btn-block' id='buttonError'>Erro ao fazer upload</button>");
        document.getElementById("buttonSuccessFlash").style.display="none";
        document.getElementById("buttonErrorFlash").style.display="none";
    }
    // Remove
 }

function createPublicationFolder(accessToken, folderName){
    var metadata = {
        'name': folderName,
        'mimeType': 'application/vnd.google-apps.folder', 
        'parents': ['root'], // Use 'root' to create file/folder in the homepage/base folder in google drive
    };
    var body = new FormData();
    body.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json; charset=UTF-8'}));
    return sendRequestSync(accessToken, body);
}

function uploadPublicationFiles(accessToken, file, parent) {
    var metadata = {
        'name': file.name,
        'mimeType': file.type, 
        'parents': ["1-KVQhIqKw9lSu08ELFvR1IlBaBfO9Su3"], // Receive the id of parent folder
    };
    var body = new FormData();
    body.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json; charset=UTF-8'}));
    body.append('file', file);
    return sendRequestSync(accessToken, body);
}

function sendRequestSync(accessToken, body){
    var httpRequest = new XMLHttpRequest();
    // "false" parameter make the request synchronous. If you need to make some request async use the other function as example or use fetch module in native js. 
    // Use the async function for better perfomance and good luck with callback
    httpRequest.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', false);
    httpRequest.setRequestHeader('Authorization', `Bearer ${accessToken}`);
    httpRequest.send(body);
    return httpRequest.responseText;
}

// Example of async call. Same same but different
async function sendRequestAsync(accessToken, body, callback){
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    httpRequest.responseType = 'json';
    httpRequest.onreadystatechange = async () => callback(this);
    httpRequest.send(body);
}