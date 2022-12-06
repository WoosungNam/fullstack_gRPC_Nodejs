const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./serverstreaming.proto";
var protoLoader = require("@grpc/proto-loader");

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const serverstreamingproto = grpc.loadPackageDefinition(packageDefinition).serverstreaming;


function get_message(call){
    console.log("Server processing gRPC server-streaming.");
    let info;
    //client의 request 요청 만큼 message를 보내주기 위한 코드
    for(let i = 0; i < call.request.value; i++){
        //각 시행마다 message를 만들고 wirte함수를 통해 client에게 보내준다.
        info = "message #" + String(i+1);
        call.write({message: info});
    }
    //시행이 끝나면 end()를 호출한다.
    call.end();
}

function main(){
    var server = new grpc.Server();
    server.addService(serverstreamingproto.ServerStreaming.service, {GetServerResponse: get_message});
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log("Starting server. Listening on port 50051.");
        server.start();
    });
}

main();