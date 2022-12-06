const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./clientstreaming.proto";
var protoLoader = require("@grpc/proto-loader");

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const clientstreamingproto = grpc.loadPackageDefinition(packageDefinition).clienttreaming;

function main(){
    let client = new clientstreamingproto.ClientStreaming(
        "localhost:50051",
        grpc.credentials.createInsecure()
    );
    
    //call 선언, server의 동작이 끝났을 경우의 동작 구현
    let call = client.GetServerResponse(function(error, response){
        console.log("[server to client] " + response.value);
    })

    //request 횟수만큼 message를 생성해서 server에게 전송
    let info;
    //request 횟수는 임의로 설정
    let request = 5;
    for(let i = 0; i < request; i++){
        info = "message #" + String(i+1);
        console.log("[client to server] " + info);
        call.write({message: info});
    }
    //모든 message를 전송했으면 end()호출
    call.end();
}

main();